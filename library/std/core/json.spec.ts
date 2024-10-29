import assert from "assert"
import { parse, stringify } from "./json"

function test() {
  const demo = {
    n: 42,
    s: "world",
    big: BigInt(42),
    date: new Date(),
    array: ["toto", "jack"],
    object: { max: "la menace" },
    map: new Map([
      ["a", new Set([new Map([["a", "b"]])])],
      ["b", new Set([new Map([["a", "b"]])])],
    ]),
    set: new Set([1, 2, 3]),
    regexp: /^hello(?:(world|42))$/g,
  }

  assert.deepStrictEqual(demo, parse(stringify(demo)))
  console.info("All good ✅")
}
test()
