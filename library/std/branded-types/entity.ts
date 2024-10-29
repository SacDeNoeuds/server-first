import type { TagOfBranded, ValueOfBranded } from "."
import { pipe } from "../core"
import { schema as S } from "../schema"
import type { Branded, ValueOf } from "./branded"
import { Tagged, type TaggedShape } from "./tagged"

export type BrandedEntity<E extends Branded<unknown, string>> = S.Schema<E> & {
  (value: ValueOf<E>): E
  tag: TagOfBranded<E>
}

export function BrandedEntity<E extends Branded<unknown, string>>(
  tag: TagOfBranded<E>,
  options: {
    schema: S.Schema<ValueOf<E>>
  },
): BrandedEntity<E> {
  const schema = pipe(
    options.schema,
    S.map((value) => value as E),
  )
  const fn = (value: ValueOfBranded<E>) => S.unsafeDecode(value, schema)
  return Object.assign(fn, {
    ...schema,
    tag,
  }) as unknown as BrandedEntity<E>
}

export type TaggedEntity<E extends Tagged<TaggedShape>> = S.Schema<E> & {
  (value: Omit<ValueOf<E>, "_tag"> & { _tag?: E["_tag"] }): E
  tag: E["_tag"]
}
export function TaggedEntity<E extends Tagged<TaggedShape>>(
  tag: E["_tag"],
  props: S.PropsOf<Omit<ValueOf<E>, "_tag">>,
): TaggedEntity<E> {
  const fn = Tagged<E>(tag)
  const schema = pipe(
    S.object({ _tag: S.literal(tag) }),
    S.object.concat(props),
    S.map(fn),
  )
  return Object.assign(fn, {
    ...schema,
    tag,
  }) as unknown as TaggedEntity<E>
}
