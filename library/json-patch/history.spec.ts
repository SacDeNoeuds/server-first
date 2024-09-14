import assert from "assert"
import { computePatch } from "./compute-patch"
import { reconstructFromHistory, type JsonPatchHistory } from "./history"

function test() {
  const original = {
    hello: "world",
  }
  const updated1 = {
    hello: "World!",
    and: "this",
  }
  const updated2 = {
    hello: "World!",
    and: "that…",
  }
  const history: JsonPatchHistory = [
    {
      author: "God",
      date: new Date("2023-01-01T00:00:00.000Z"),
      patch: computePatch(undefined, original), // Creation. Get it ??
    },
    {
      author: "Jack",
      date: new Date("2024-01-02T00:00:00.000Z"),
      patch: computePatch(original, updated1),
    },
    {
      author: "Mary",
      date: new Date("2024-01-03T00:00:00.000Z"),
      patch: computePatch(updated1, updated2),
    },
  ]

  assert.deepStrictEqual(
    reconstructFromHistory(history, {
      until: new Date("2024-01-02T00:00:00.000Z"),
    }),
    updated1,
  )
  assert.deepStrictEqual(
    reconstructFromHistory(history, {
      until: new Date("2024-01-03T00:00:00.000Z"),
    }),
    updated2,
  )
  assert.deepStrictEqual(reconstructFromHistory(history), updated2)
  console.info("all good ✅")
}

test()
