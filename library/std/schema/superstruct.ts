import { coerce, date, refine, string } from "superstruct"

const dateFromString = coerce(date(), string(), (value) => new Date(value))
export const DateFromString = refine(
  dateFromString,
  "DateFromString",
  (value) => !Number.isNaN(value.getTime()),
)
