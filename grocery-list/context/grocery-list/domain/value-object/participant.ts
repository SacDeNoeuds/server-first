import { valueObject } from "@/std"
import type { branded } from "@/std/branded-types"
import { AccountId } from "@shared/value-object/account-id"

export type Participant = branded.Type<AccountId, "Participant">
export const Participant = valueObject.fromSchema<Participant>(AccountId.schema)
