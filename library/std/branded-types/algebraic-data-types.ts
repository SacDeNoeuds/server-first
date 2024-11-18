import * as tagged from "./tagged-v2"

export type Success<T> = tagged.Value<"Success", T>
export const Success = tagged.fromValue("Success") as {
  <T>(value: T): Success<T>
}

export type Failure<E> = tagged.Value<"Failure", E>
export const Failure = tagged.fromValue("Failure") as {
  <E>(error: E): Failure<E>
}
export type Result<E, T> = Failure<E> | Success<T>

export type Some<T> = tagged.Value<"Some", T>
export type None = tagged.Value<"None", undefined>

export const Some = tagged.fromValue("Some") as { <T>(value: T): Some<T> }
export const none: None = Object.freeze({ _tag: "None", value: undefined })
export const None = () => none
export type Option<T> = None | Some<T>
