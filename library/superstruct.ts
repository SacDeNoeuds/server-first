import { coerce, date, refine, string } from "superstruct"

export const DateFromString = refine(
  coerce(date(), string(), (string) => new Date(string)),
  "DateFromString",
  (value) => !Number.isNaN(value.getTime()),
)
