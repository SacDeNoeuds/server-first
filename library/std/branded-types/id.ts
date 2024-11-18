import { pipe } from "../core"
import { flow, StringId } from "../core/functions"
import * as S from "../schema"
import * as branded from "./branded"

interface Id<T extends branded.Type<string, any>> {
  schema: S.Schema<T>
  from: (base: branded.BaseOf<T>) => T
  new: () => T
}

export { Id as StringId }
function Id<T extends branded.Type<string, any>>(): Id<T> {
  const schema = pipe(
    S.string,
    // @ts-ignore I'm smarter?
    S.size({
      min: 6,
      max: 12,
      reason: "StringId",
    }),
    S.map(branded.castAs<T>),
  )
  return {
    schema,
    from: (base) => S.unsafeDecode(base, schema),
    // @ts-ignore I'm smarter?
    new: flow(StringId, branded.castAs<T>),
  }
}
