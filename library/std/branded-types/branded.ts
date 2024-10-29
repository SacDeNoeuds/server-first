declare const symbolForTag: unique symbol
declare const symbolForValue: unique symbol

export type Branded<Value, Tag extends string> = Value & {
  readonly [symbolForTag]: Tag
  readonly [symbolForValue]: Value
}

export type TagOf<T> = T extends { [symbolForTag]: infer Tag } ? Tag : never
export type ValueOf<T extends Branded<unknown, string>> =
  T[typeof symbolForValue]

type Test01 = Branded<number, "Age">
type Test02 = TagOf<Test01>
type Test03 = ValueOf<Test01>
