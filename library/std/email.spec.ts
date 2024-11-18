import { Email } from "./email"

console.info({
  "thomas@me": Email.schema.decode("thomas@me"),
  "thomas+test@me": Email.schema.decode("thomas+test@me"),
})
