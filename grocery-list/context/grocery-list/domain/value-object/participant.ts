import { schema as S, valueObject } from "@/std"

export type Participant = valueObject.Of<string, "Participant">
export const Participant = valueObject.fromSchema<Participant>(S.string)
