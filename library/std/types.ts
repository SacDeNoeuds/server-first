export type Simplify<T> = {
  [Key in keyof T]: T[Key]
}

export type ToNumber<T> = T extends `${infer N extends number}` ? N : never

export type If<Condition extends boolean, Then, Else> = Condition extends true
  ? Then
  : Else
export type Is<A, B> = [A] extends [B] ? true : false

/**
 * Convert a union of type to an intersection.
 */
export type UnionToIntersection<U> = (
  U extends any ? (arg: U) => any : never
) extends (arg: infer I) => void
  ? I
  : never
