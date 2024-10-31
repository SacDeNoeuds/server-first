export declare const symbolForTag: unique symbol
export declare const symbolForValue: unique symbol

export type Brand<Value, Tag = symbol> = Value & {
  readonly [symbolForTag]: Tag
  readonly [symbolForValue]: Value
}

export type TagOf<T> = T extends { [symbolForTag]: infer Tag } ? Tag : never
export type ValueOf<T extends Brand<unknown, string>> = T[typeof symbolForValue]

// type Test01 = Branded<number, "Age">
// type Test02 = TagOf<Test01>
// type Test03 = ValueOf<Test01>
