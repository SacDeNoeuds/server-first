import { branded, StringId } from "@/std"

export type AccountId = branded.Type<string, "AccountId">
export const AccountId = StringId<AccountId>()
