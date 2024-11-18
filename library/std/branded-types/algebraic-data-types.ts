import * as tagged from "./tagged-v2"

export interface Success<T> extends tagged.Value<"Success", T> {}
export const Success = tagged.fromValue("Success") as {
  <T>(value: T): Success<T>
}

export interface Failure<E> extends tagged.Value<"Failure", E> {}
export const Failure = tagged.fromValue("Failure") as {
  <E>(error: E): Failure<E>
}
export type Result<E, T> = Failure<E> | Success<T>

export const Option = {
  ap:
    <A>(first: Option<A>) =>
    <R, Rest extends tagged.Shape>(
      funcOrRest: Option<(a: A) => R> | Rest,
    ): Option<R> | Rest => {
      if (isNone(funcOrRest) || isNone(first)) return None()
      if (isSome(funcOrRest))
        return isSome(first) ? Some(funcOrRest.value(first.value)) : None()
      return funcOrRest
    },
}

type Test01 = Success<number> | Option<(a: number) => string>
type Test02 = Exclude<Test01, Option<unknown>>

export interface Some<T> extends tagged.Value<"Some", T> {}
export interface None extends tagged.Value<"None", undefined> {}
export const isNone = tagged.isTaggedAs<None>("None")

export const isSome = tagged.isTaggedAs("Some") as <
  T,
  Rest extends tagged.Shape,
>(
  input: Some<T> | Rest,
) => input is Some<T>

export const Some = tagged.fromValue("Some") as { <T>(value: T): Some<T> }
export const none: None = Object.freeze({ _tag: "None", value: undefined })
export const None = () => none
export type Option<T> = None | Some<T>
