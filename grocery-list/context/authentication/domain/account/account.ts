import type { Opaque } from "@/std/types"

export type AccountId = Opaque<string>
export const AccountId = {
  fromString: (id: string) => id as AccountId,
}

export type Account = {
  id: AccountId
  email: string
}
