import assert from "assert"
import { pipe } from "./functions"
import { Task } from "./task"

async function test() {
  console.info("--- testTimeoutBefore500msWithMap() ---")
  await testTimeoutBefore500msWithMap()
  console.info("\n--- testTimeoutBefore500msWithFlatMap() ---")
  await testTimeoutBefore500msWithFlatMap()
  console.info("\n--- testFlatMap() ---")
  await testFlatMap()
  console.info("\n--- testMap() ---")
  await testMap()
  console.info("\n--- testArray() ---")
  await testArray()
  console.info("\n--- testPooledArray() ---")
  await testPooledArray()
  console.info("\n--- testObject() ---")
  await testObject()
  console.info("\n--- testTuple() ---")
  await testTuple()
}
test()

async function testTimeoutBefore500msWithMap() {
  const taskOf500ms = pipe(
    Task.delay(500),
    Task.map(() => console.info("hello! – should not run!")),
  )
  const promise = assert.rejects(taskOf500ms.run)
  setTimeout(() => Task.abort(taskOf500ms), 100)
  await promise
}

async function testTimeoutBefore500msWithFlatMap() {
  const say42 = pipe(
    Task.delay(200),
    Task.map(() => (console.info(42, "– should run"), 42)),
  )
  const sayHello = pipe(
    Task.delay(500),
    Task.map(() => console.info("hello! – should not run!")),
  )
  const say42ThenHello = pipe(
    say42,
    Task.flatMap((n) => {
      console.info("got:", n)
      return sayHello
    }),
  )
  const promise = assert.rejects(say42ThenHello.run)
  setTimeout(() => Task.abort(say42ThenHello), 300)
  await promise
}

async function testFlatMap() {
  const say42 = pipe(
    Task.delay(200),
    Task.map(() => (console.info(42), 42)),
  )
  const sayHello = pipe(
    Task.delay(500),
    Task.map(() => console.info("hello!")),
  )
  const say42ThenHello = pipe(
    say42,
    Task.flatMap((n) => {
      console.info("got:", n)
      return sayHello
    }),
  )
  await say42ThenHello.run()
}

async function testMap() {
  const say42 = pipe(
    Task.delay(200),
    Task.map(() => (console.info(42), 42)),
  )
  const sayHello = pipe(
    say42,
    Task.map((n) => console.info(`hello, ${n} !`)),
  )
  await sayHello.run()
}

async function testArray() {
  const a = Task.of("a")
  const b = Task.of("b")
  const c = Task.of("c")
  const test = Task.array()([a, b, c])
  const result = await test.run()
  console.info("array", result)
}

async function testPooledArray() {
  const resolveAfter = <T>(value: T, ms: number) => {
    return pipe(
      Task.delay(ms),
      Task.map(() => {
        console.info("value:", value, new Date().toISOString())
        return value
      }),
    )
  }
  const a = resolveAfter("a", 1000)
  const b = resolveAfter("b", 1000)
  const c = resolveAfter("c", 1000)
  const test = Task.array({ concurrency: 1 })([a, b, c])
  const result = await test.run()
  console.info("array", result)
}

async function testObject() {
  const a = Task.of(42)
  const b = Task.of("hello")
  const c = Task.of(new Date())
  const test = Task.object()({ a, b, c })
  const result = await test.run()
  console.info("object", result)
}

async function testTuple() {
  const a = Task.of(42)
  const b = Task.of("hello")
  const c = Task.of(new Date())
  const test = Task.tuple()([a, b, c])
  const result = await test.run()
  console.info("tuple", result)
}
