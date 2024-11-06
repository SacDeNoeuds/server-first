import { entity, schema as S } from "@/std"

export type Participant = entity.Value<string, "Participant">
export const Participant = entity.fromSchema<Participant>(S.string)
