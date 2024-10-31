import PromisePool from "promisedip"
import { pipe } from "./functions"

const hiddenController: unique symbol = Symbol("AbortController")
export interface Task<T> {
  [hiddenController]: AbortController
  run: () => Promise<T>
}
export type ValueOf<T> = T extends Task<infer U> ? U : never

export const Task = {
  delay,
  of,
  fromPromise,
  abort,
  map,
  flatMap,
  object,
  array,
  tuple,
}

function cascadeAbort(from: AbortController, to: AbortController) {
  const abort = () => !to.signal.aborted && to.abort(from.signal.reason)
  if (from.signal.aborted && !to.signal.aborted) abort()
  from.signal.addEventListener("abort", abort)
}

function mergeControllers(a: AbortController, b: AbortController) {
  cascadeAbort(a, b)
  cascadeAbort(b, a)
}

async function runIfNotAborted<T>(
  controller: AbortController,
  fn: () => T,
): Promise<Awaited<T>> {
  if (!controller.signal.aborted) return await fn()
  const error = new Error("aborted", { cause: controller.signal.reason })
  return await Promise.reject(error)
}

/**
 * @example
 * const task = std.pipe(
 *   std.Task.delay(500),
 *   std.Task.map(() => 'Hello!'),
 * )
 * const promise = task.run()
 */
function abort(task: Task<unknown>) {
  task[hiddenController].abort()
}

function fromPromise<T>(fn: () => Promise<T>): Task<T> {
  const controller = new AbortController()
  return {
    [hiddenController]: controller,
    run: () => runIfNotAborted(controller, fn),
  }
}

function of<T>(value: T): Task<T> {
  return fromPromise(() => Promise.resolve(value))
}

function delay(ms: number): Task<void> {
  return fromPromise(() => new Promise((resolve) => setTimeout(resolve, ms)))
}

function map<T, U>(mapper: (value: T) => U) {
  return (task: Task<T>): Task<U> => {
    const controller = task[hiddenController]
    return {
      [hiddenController]: task[hiddenController],
      run: async () => {
        const value = await runIfNotAborted(controller, task.run)
        return runIfNotAborted(controller, () => mapper(value))
      },
    }
  }
}

function flatMap<T, U>(mapper: (value: T) => Task<U>) {
  return (task: Task<T>): Task<U> => {
    const controller = task[hiddenController]
    return {
      [hiddenController]: task[hiddenController],
      run: async () => {
        const value = await runIfNotAborted(controller, task.run)
        const chained = mapper(value)
        mergeControllers(chained[hiddenController], controller)
        return runIfNotAborted(controller, chained.run)
      },
    }
  }
}

type CompositeOptions = {
  concurrency?: number
}

/**
 * @example
 * const tasks = [Task.of(1), Task.of(2), Task.of(3)]
 *
 * const parallel = Task.array()(tasks)
 * const result = await parallel.run() // number[]
 *
 * const pooled = Task.array({ concurrency: 3 })(tasks)
 * const result = await pooled.run() // number[]
 */
function array({ concurrency }: CompositeOptions = {}) {
  return <T>(tasks: Task<T>[]) => {
    const controller = new AbortController()
    tasks.forEach((task) =>
      mergeControllers(task[hiddenController], controller),
    )
    const task: Task<T[]> = {
      [hiddenController]: controller,
      run: async () => {
        const runTask = (task: Task<T>) => {
          return runIfNotAborted(controller, task.run)
        }
        return concurrency
          ? PromisePool.map(tasks, runTask, { concurrency })
          : Promise.all(tasks.map(runTask))
      },
    }
    return task
  }
}

/**
 * @example
 * const tasks = [Task.of(1), Task.of(2), Task.of(3)] as const
 *
 * const parallel = Task.tuple()(tasks)
 * const result = await parallel.run() // [number, number, number]
 *
 * const pooled = Task.tuple({ concurrency: 3 })(tasks)
 * const result = await pooled.run() // [number, number, number]
 */
function tuple(options: CompositeOptions = {}) {
  return array(options) as <T extends readonly unknown[] | []>(
    values: T,
  ) => Task<{ -readonly [P in keyof T]: ValueOf<T[P]> }>
}

function mapObjectEntry([key, task]: [string, Task<any>]) {
  return map((value) => [key, value])(task)
}

/**
 * @example
 * const tasks = {
 *   a: Task.of(1),
 *   b: Task.of(2),
 *   c: Task.of(3),
 * }
 *
 * const parallel = Task.object()(tasks)
 * const result = await parallel.run() // { a: number, b: number, c: number }
 *
 * const pooled = Task.object({ concurrency: 3 })(tasks)
 * const result = await pooled.run() // { a: number, b: number, c: number }
 */
function object(options: CompositeOptions = {}) {
  return <Props extends Record<string, Task<any>>>(props: Props) => {
    return pipe(
      Object.entries(props).map(mapObjectEntry),
      array(options),
      map((entries) => Object.fromEntries(entries)),
    ) as Task<{ [Key in keyof Props]: ValueOf<Props[Key]> }>
  }
}
