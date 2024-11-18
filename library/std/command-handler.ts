export type CommandHandler<Input, Errors, Output> = (
  input: Input,
) => Promise<Errors | Output>
