import assert from "node:assert"
import { pipe } from "../core"
import {
  Failure,
  Option,
  Some,
  Success,
  type Result,
} from "./algebraic-data-types"
import * as tagged from "./tagged-v2"

const r1 = Success(42) as Result<string, number> | Option<Date>
console.info({
  // case1: Success<number> | None | Failure<Date> | Failure<number>
  case1: pipe(
    r1,
    tagged.flatMap({
      Some: Failure<Date>,
      Failure: (value) => Failure(Number(value)),
    }),
  ),
  // case2: string | number | Date
  case2: pipe(
    r1,
    tagged.flatMap({
      Some: (date) => Success(date),
      None: () => Failure(42),
    }),
    tagged.flatMap({ Failure: (err) => Success(err) }),
    // tagged.fold({ Success: (value) => value }),
  ),
})

// Taken from https://gcanti.github.io/fp-ts/modules/Apply.ts.html#apply-overview
const f = (a: string) => (b: number) => (c: boolean) =>
  a + String(b) + String(c)
const fa: Option<string> = Some("s")
const fb: Option<number> = Some(1)
const fc: Option<boolean> = Some(true)

// resultOfApply: Failure<string> | Success<number> | Option<string>
const resultOfApply = pipe(
  // lift a function
  Some(f) as Result<string, number> | Option<typeof f>,
  // apply the first argument
  Option.ap(fa),
  // apply the second argument
  Option.ap(fb),
  // apply the third argument
  Option.ap(fc),
)
assert.deepStrictEqual(resultOfApply, Some("s1true"))
