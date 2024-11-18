export declare const tag: unique symbol
export declare const base: unique symbol

/**
 * @example
 * ```ts
 * // Super-safe:
 * export declare const myBrand: unique symbol;
 * export type MyBrandedType = Brand<…, typeof myBrand>
 *
 * // trivial but less safe:
 * export type MyBrandType = Brand<…, 'MyBrand'>
 * ```
 */
export type Type<Base, Brand extends PropertyKey> = BaseOf<Base> & {
  readonly [base]: Base
  readonly [tag]: Brand
}

export type BrandOf<T> = T extends { [tag]: infer Tag } ? Tag : never
export type BaseOf<T> = T extends { [base]: infer U } ? U : T

// type Toto = Type<string, 'Toto'>
// type Tata = Type<Toto, 'Tata'>
// type Test01 = BaseOf<Toto>
// type Test02 = BaseOf<Tata>

export function castAs<T extends Type<unknown, any>>(base: BaseOf<T>): T {
  return base as T
}

// type Test01 = Brand<number, "Age">
// type Test02 = TagOf<Test01>
// type Test03 = ValueOf<Test01>

// declare const age: unique symbol;
// declare const age2: unique symbol;
// declare const test01: Brand<number, typeof age2>
// declare const test02: Brand<number, typeof age>
// test01 === test02
