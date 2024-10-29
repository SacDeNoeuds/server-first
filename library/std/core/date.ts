export const from = (input: number | string | Date) => new Date(input)

export const isValid = (date: Date) => !Number.isNaN(date.valueOf())
