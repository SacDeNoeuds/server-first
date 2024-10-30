import { Tagged, TaggedClass } from "../branded-types"
import { pipe } from "./functions"
import { Task } from "./task"

class Err<E> extends TaggedClass("Err")<{ error: E }> {}
class Ok<T> extends TaggedClass("Ok")<{ value: T }> {}

type Result<E, T> = Err<E> | Ok<T>
const Result = {
  err: <E>(error: E) => new Err({ error }),
  Err: <E>(data: { error: E }) => new Err(data),
  ok: <T>(value: T) => new Ok({ value }),
  Ok: <T>(data: { value: T }) => new Ok(data),
}

class None extends TaggedClass("None")<{}> {}
class Some<T> extends TaggedClass("Some")<{ value: T }> {}
type Option<T> = None | Some<T>
const Option = {
  some: <T>(value: T) => new Some({ value }),
  Some: <T>(data: { value: T }) => new Some<T>(data),
  none: new None({}),
  fold:
    <T, A, B>(onNone: () => A, onSome: (value: T) => B) =>
    (option: Option<T>) =>
      Tagged.matchAll(option as Option<T>, {
        None: () => onNone(),
        Some: ({ value }) => onSome(value),
      }),
}

type Input = Result<string, number> | Option<Date>
const input = Option.some(new Date()) as Input
console.info({
  result01: Tagged.matchAll(input, {
    Err: ({ error }) => error,
    None: () => "there’s nothing…",
    Ok: ({ value }) => value,
    Some: ({ value }) => value.getDate(),
  }),
  complicatedTaskPipeline: pipe(
    Task.delay(1000),
    Task.map(() => Option.some(new Date()) as Option<Date>),
    Task.map(Option.fold(() => Option.none, Result.ok)),
    Task.map((v) => v),
    Task.map(
      Tagged.fold({
        None: () => Result.ok("perfect, I expected no value"),
        Ok: Option.Some<Date>,
      }),
    ),
    Task.map((v) => v),
    Task.map(
      Tagged.fold({
        Some: (date) => Result.err(`failed at: ${date.value.toISOString()}`),
      }),
    ),
    Task.map((v) => v),
    Task.map(
      Tagged.fold({
        Err: () => new Date().toISOString(),
        Ok: (ok) => ok.value,
      }),
    ),
    Task.map((v) => v),
  ),
})
