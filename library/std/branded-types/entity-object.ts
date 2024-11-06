import { pipe } from "../core"
import * as S from "../schema"
import type { ValueOf } from "./brand"
import * as tagged from "./tagged"

export type EntityObject<
  T extends tagged.Object<tagged.Shape>,
  Rules extends RulesFor<T> = Record<string, never>,
> = S.ObjectSchema<T> & {
  (value: Omit<ValueOf<T>, "_tag"> & { _tag?: T["_tag"] }): T
  rules: Rules
}

export { Obj as Object }
type Obj<E extends tagged.Shape> = tagged.Object<E>
function Obj<E extends tagged.Object<tagged.Shape>>(
  tag: E["_tag"],
  props: S.PropsOf<Omit<ValueOf<E>, "_tag">>,
): EntityObject<E> {
  const fn = tagged.fromTag<E>(tag)
  const schema = pipe(
    S.object({ _tag: S.literal(tag) }),
    S.object.concat(props),
  ) as S.ObjectSchema<E>

  return Object.assign(fn, {
    ...schema,
  }) as EntityObject<E>
}

function refine<T extends tagged.Object<tagged.Shape>>(
  name: string,
  refiner: (value: T) => boolean,
) {
  return (entity: EntityObject<T>): EntityObject<T> => {
    const schema = pipe(entity, S.refine(name, refiner))
    return Object.assign(entity, schema)
  }
}

export type RulesFor<T> = Record<string, (value: T) => boolean>

export function applyRules<
  T extends tagged.Object<tagged.Shape>,
  Rules extends RulesFor<T>,
>(rules: Rules) {
  return function apply(entity: EntityObject<T>): EntityObject<T, Rules> {
    let acc = entity
    for (const [key, value] of Object.entries(rules))
      acc = refine(key, value)(acc)
    return Object.assign(acc, { rules })
  }
}

export function validate<T, Rules extends RulesFor<T>>(
  value: T,
  rules: Rules,
): Set<keyof Rules> {
  const errors = new Set<string>()
  for (const [ruleName, isValid] of Object.entries(rules))
    if (!isValid(value)) errors.add(ruleName)

  return errors as Set<keyof Rules>
}
