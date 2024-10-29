import { Tagged, type TagOf, type ValueOf } from "./tagged"

export type KindedShape = { _kind: string }
export type Kinded<Value extends KindedShape> = Tagged<Value["_kind"], Value>
export type KindOf<T extends KindedShape> = T["_kind"]

export const Kinded = <T extends Kinded<KindedShape>>(
  kind: KindOf<T> & string,
) => {
  const fn = Tagged<T>(kind as TagOf<T> & string)
  return (original: Omit<ValueOf<T>, "_kind">): T => {
    return fn({
      _kind: kind,
      ...original,
    } as ValueOf<T>)
  }
}
