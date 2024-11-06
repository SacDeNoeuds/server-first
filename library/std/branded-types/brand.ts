export declare const tag: unique symbol
export declare const value: unique symbol

export type Brand<Value, Tag> = Value & {
  readonly [tag]: Tag
  readonly [value]: Value
}

export type TagOf<T> = T extends { [tag]: infer Tag } ? Tag : never
export type ValueOf<T extends Brand<unknown, string>> = T[typeof value]

// type Test01 = Branded<number, "Age">
// type Test02 = TagOf<Test01>
// type Test03 = ValueOf<Test01>
