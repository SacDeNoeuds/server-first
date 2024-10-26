export type Simplify<T> = {
  [Key in keyof T]: T[Key]
}

export type Opaque<T> = T & { readonly opaque: unique symbol }

/**
 * Convert a union of type to an intersection.
 */
export type UnionToIntersection<U> = (
  U extends any ? (arg: U) => any : never
) extends (arg: infer I) => void
  ? I
  : never
