import { pipe } from "../core"
import * as S from "../schema"
import * as tagged from "./tagged-v2"

export type Satisfies<Raw, Tagged> = Tagged extends Raw
  ? Exclude<keyof Tagged, "_tag"> extends keyof Raw
    ? Tagged
    : never
  : never

export interface Entity<
  T extends tagged.Shape,
  Rules extends RulesFor<T> = Record<string, never>,
> {
  from: (value: Omit<tagged.ValueOf<T>, "_tag"> & { _tag?: T["_tag"] }) => T
  schema: S.ObjectSchema<T>
  rules: Rules
}

export type Object<E extends tagged.Shape> = tagged.Object<E>
export { make as object }
export function make<E extends tagged.Object<tagged.Shape>>(
  tag: E["_tag"],
  props: S.PropsOf<Omit<tagged.ValueOf<E>, "_tag">>,
): Entity<E> {
  const from = tagged.fromObject<E>(tag)
  const schema = pipe(
    S.object({ _tag: S.literal(tag) }),
    S.object.concat(props),
  ) as S.ObjectSchema<E>

  return {
    schema,
    from,
    rules: {},
  } as Entity<E>
}

function refine<T extends tagged.Object<tagged.Shape>>(
  name: string,
  refiner: (value: T) => boolean,
) {
  return (entity: Entity<T>): Entity<T> => {
    const schema = pipe(entity.schema, S.refine(name, refiner))
    return { ...entity, schema }
  }
}

export type RulesFor<T> = Record<string, (value: T) => boolean>

export function applyRules<
  T extends tagged.Object<tagged.Shape>,
  Rules extends RulesFor<T>,
>(rules: Rules) {
  return function apply(entity: Entity<T>): Entity<T, Rules> {
    let acc = entity
    for (const [key, value] of Object.entries(rules))
      acc = refine(key, value)(acc)
    return { ...acc, rules }
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
