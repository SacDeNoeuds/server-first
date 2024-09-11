const length = 16
// FIXME: This is flawed but I don't care for now
export const StringId = (): string =>
  Math.random()
    .toString(36)
    .substring(2, 2 + length)
