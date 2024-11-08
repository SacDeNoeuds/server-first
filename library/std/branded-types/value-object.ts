import { pipe } from "../core"
import * as S from "../schema"
import type { Brand, ValueOf, ValueOf as ValueOfBranded } from "./brand"

export type ValueObject<E extends Brand<unknown, string>> = S.Schema<E> & {
  (value: ValueOf<E>): E
}

export type { Brand as Of, ValueOf } from "./brand"

export function fromSchema<E extends Brand<unknown, any>>(
  inputSchema: S.Schema<ValueOf<E>>,
): ValueObject<E> {
  const schema = pipe(
    inputSchema,
    S.map((value) => value as E),
  )
  const fn = (value: ValueOfBranded<E>) => S.unsafeDecode(value, schema)
  return Object.assign(fn, {
    ...schema,
  }) as unknown as ValueObject<E>
}
