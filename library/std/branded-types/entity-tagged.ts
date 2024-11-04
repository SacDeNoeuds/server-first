import { pipe } from "../core"
import * as S from "../schema"
import type { ValueOf } from "./brand"
import * as tagged from "./tagged"

export type TaggedEntity<E extends tagged.Tagged<tagged.Shape>> =
  S.ObjectSchema<E> & {
    (value: Omit<ValueOf<E>, "_tag"> & { _tag?: E["_tag"] }): E
  }

export { Obj as Object }
type Obj<E extends tagged.Shape> = tagged.Tagged<E>
function Obj<E extends tagged.Tagged<tagged.Shape>>(
  tag: E["_tag"],
  props: S.PropsOf<Omit<ValueOf<E>, "_tag">>,
): TaggedEntity<E> {
  const fn = tagged.fromTag<E>(tag)
  const schema = pipe(
    S.object({ _tag: S.literal(tag) }),
    S.object.concat(props),
  ) as S.ObjectSchema<E>

  return Object.assign(fn, {
    ...schema,
  }) as TaggedEntity<E>
}
