import { pipe } from "../core"
import {
  Failure,
  Success,
  type Option,
  type Result,
} from "./algebraic-data-types"
import * as tagged from "./tagged-v2"

const r1 = Success(42) as Result<Error, number> | Option<Date>
pipe(
  r1,
  tagged.flatMap({ Some: (date) => Failure(new Error("raah!")) }),
  (v) => v,
)

pipe(
  r1,
  tagged.flatMap({
    Some: (date) => Success(date),
    None: () => Failure(42),
  }),
  (v) => v,
  tagged.flatMap({ Failure: (err) => Success(err) }),
  tagged.fold({ Success: (value) => value }),
  (v) => v,
)
