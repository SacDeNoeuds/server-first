import { pipe } from "../core"
import { schema as S } from "../schema"
import { Kinded, type KindedShape } from "./kinded"
import { Tagged, type TagOf, type ValueOf } from "./tagged"

export type EntityValue<E extends Tagged<string, any>> = S.Schema<E> & {
  (value: ValueOf<E>): E
  tag: TagOf<E>
}

export function EntityValue<E extends Tagged<string, any>>(
  tag: TagOf<E> & string,
  options: {
    schema: S.Schema<ValueOf<E>>
  },
): EntityValue<E> {
  const fn = Tagged<E>(tag)
  const schema = pipe(options.schema, S.map(fn))
  return Object.assign(fn, {
    ...schema,
    tag,
  }) as unknown as EntityValue<E>
}

export type EntityObject<E extends Tagged<string, any>> = S.Schema<E> & {
  (value: Omit<ValueOf<E>, "_kind">): E
  tag: TagOf<E>
}
export function EntityObject<E extends Kinded<KindedShape>>(
  kind: TagOf<E> & string,
  props: S.PropsOf<Omit<ValueOf<E>, "_kind">>,
): EntityObject<E> {
  const fn = Kinded<E>(kind)
  const schema = pipe(
    S.object(props),
    S.object.concat({ _kind: S.literal(kind) }),
    S.map(fn),
  )
  return Object.assign(fn, {
    ...schema,
    tag: kind,
  }) as unknown as EntityObject<E>
}
