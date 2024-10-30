import PromisePool from "promisedip"
import { pipe } from "./functions"

const hiddenController: unique symbol = Symbol("AbortController")
export interface Task<T> {
  run: () => Promise<T>
  [hiddenController]: AbortController
}
type ValueOf<T> = T extends Task<infer U> ? U : never

export const Task = {
  of,
  fromPromise,
  abort,
  map,
  flatMap,
  object,
  array,
  tuple,
  delay,
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
  // const firstAborted = findFirstAborted(controllers)
  if (!controller.signal.aborted) return await fn()
  const error = new Error("aborted", { cause: controller.signal.reason })
  return await Promise.reject(error)
}

function abort(task: Task<unknown>) {
  task[hiddenController].abort()
  // task[hiddenController].forEach((controller) => controller.abort())
}

function fromPromise<T>(fn: () => Promise<T>): Task<T> {
  // const controllers = new Set([new AbortController()])
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

const mapObjectEntry = ([key, task]: [string, Task<any>]) =>
  map((value) => [key, value])(task)
function object(options: CompositeOptions = {}) {
  return <Props extends Record<string, Task<any>>>(props: Props) => {
    return pipe(
      Object.entries(props).map(mapObjectEntry),
      array(options),
      map((entries) => Object.fromEntries(entries)),
    ) as Task<{ [Key in keyof Props]: ValueOf<Props[Key]> }>
  }
}

function tuple(options: CompositeOptions = {}) {
  return array(options) as <T extends readonly unknown[] | []>(
    values: T,
  ) => Task<{ -readonly [P in keyof T]: ValueOf<T[P]> }>
}
