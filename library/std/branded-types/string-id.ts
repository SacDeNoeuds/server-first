import { pipe } from "../core"
import { schema as S } from "../schema"
import type { Branded, TagOf } from "./branded"
import { BrandedEntity } from "./entity"

const length = 16

export function StringId(): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

type Shape = Branded<string, string>
export interface BrandedId<Id extends Shape> extends BrandedEntity<Id> {
  new: () => Id
}
export function BrandedId<T extends Shape>(tag: TagOf<T>) {
  const entity = BrandedEntity(tag, {
    schema: pipe(
      S.string,
      S.size({ min: length, max: length, reason: "StringId" }),
    ),
  })
  return Object.assign(entity, {
    new: StringId as () => T,
  }) as BrandedId<T>
}
