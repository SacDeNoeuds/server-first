import { pipe } from "../core"
import * as S from "../schema"
import type { ValueOf } from "./brand"
import * as tagged from "./tagged"

export type Entity<
  T extends tagged.Object<tagged.Shape>,
  Rules extends RulesFor<T> = Record<string, never>,
> = S.ObjectSchema<T> & {
  (value: Omit<ValueOf<T>, "_tag"> & { _tag?: T["_tag"] }): T
  rules: Rules
}

// interface EntityClass<Tag extends string, Props extends Record<string, any>> {
//   new (props: Props): Props & { _tag: Tag }
//   rules: RulesFor<Props>
//   props: Props
//   decode: S.Schema<this>["decode"]
// }

// declare const Person: EntityClass<"Person", { age: number; test: string }>

// export function Class<
//   Tag extends string,
//   Props extends Record<string, S.Schema<any>>,
// >(tag: Tag, props: Props) {
//   class Entity {
//     static _tag = tag
//     static schema = pipe(
//       S.object({ _tag: S.literal(tag) }),
//       S.object.concat(props),
//     ) as S.ObjectSchema<T>
//     static rules = {}

//     constructor(properties: any) {
//       Object.assign(this, properties)
//     }
//   }
//   return Entity as unknown as EntityClass<T>
// }

export type Of<E extends tagged.Shape> = tagged.Object<E>
export { make as for }
export function make<E extends tagged.Object<tagged.Shape>>(
  tag: E["_tag"],
  props: S.PropsOf<Omit<ValueOf<E>, "_tag">>,
): Entity<E> {
  const fn = tagged.fromTag<E>(tag)
  const schema = pipe(
    S.object({ _tag: S.literal(tag) }),
    S.object.concat(props),
  ) as S.ObjectSchema<E>

  return Object.assign(fn, {
    ...schema,
  }) as Entity<E>
}

function refine<T extends tagged.Object<tagged.Shape>>(
  name: string,
  refiner: (value: T) => boolean,
) {
  return (entity: Entity<T>): Entity<T> => {
    const schema = pipe(entity, S.refine(name, refiner))
    return Object.assign(entity, schema)
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
