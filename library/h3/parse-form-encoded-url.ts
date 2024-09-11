import { parse } from "qs"

export function parseFormEncodedUrl(
  url: string | undefined,
): Record<string, unknown> | undefined {
  // I'd rather follow JS notation as much as I can
  // about nested[] vs nested[index], I prefer nested[] because
  // the order should be determined by the order _displayed_ to the user.
  // thus following DOM order.
  return url ? parse(url, { allowDots: true }) : undefined
}
