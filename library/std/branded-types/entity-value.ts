import { pipe } from "../core"
import * as S from "../schema"
import type { Brand, ValueOf, ValueOf as ValueOfBranded } from "./brand"

export type EntityValue<E extends Brand<unknown, string>> = S.Schema<E> & {
  (value: ValueOf<E>): E
}

export function fromSchema<E extends Brand<unknown, any>>(
  inputSchema: S.Schema<ValueOf<E>>,
): EntityValue<E> {
  const schema = pipe(
    inputSchema,
    S.map((value) => value as E),
  )
  const fn = (value: ValueOfBranded<E>) => S.unsafeDecode(value, schema)
  return Object.assign(fn, {
    ...schema,
  }) as unknown as EntityValue<E>
}
