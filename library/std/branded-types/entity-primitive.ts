import { pipe } from "../core"
import { schema as S } from "../schema"
import type { Brand, ValueOf, ValueOf as ValueOfBranded } from "./brand"

export type ValueEntity<E extends Brand<unknown, string>> = S.Schema<E> & {
  (value: ValueOf<E>): E
}

export { For as for }
function For<E extends Brand<unknown, any>>(
  inputSchema: S.Schema<ValueOf<E>>,
): ValueEntity<E> {
  const schema = pipe(
    inputSchema,
    S.map((value) => value as E),
  )
  const fn = (value: ValueOfBranded<E>) => S.unsafeDecode(value, schema)
  return Object.assign(fn, {
    ...schema,
  }) as unknown as ValueEntity<E>
}
