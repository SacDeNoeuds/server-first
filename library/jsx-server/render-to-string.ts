import type { JSX } from "./jsx-runtime"

/** @type {Set<keyof import("./jsx-runtime").JSX.IntrinsicElements>} */
const selfClosingTags = new Set([
  "input",
  "hr",
  "br",
  "img",
  "link",
  "meta",
  "area",
  "base",
])

export function renderToString(element: JSX.Child): string {
  if (element === null || typeof element !== "object")
    return primitiveChildToText(element)

  if (element.type === "fragment")
    return element.children?.map(renderToString).join("") ?? ""
  if (element.type === "rawHtml") return element.children

  const attributes = serializeAttributes(element.attributes)
  const openingTag = `<${[element.tag, attributes].filter(Boolean).join(" ")}>`
  if (selfClosingTags.has(element.tag)) return openingTag
  const closingTag = `</${element.tag}>`
  const children = element.children.map(renderToString).join("")

  return openingTag + children + closingTag
}

type AttributeValue = string | number | boolean | null | undefined
function serializeAttributes(
  attributes: Record<string, AttributeValue>,
): string {
  // If EVER needed, this can be optimized using array.reduce.
  return Object.entries(attributes)
    .map(serializeAttribute)
    .filter(Boolean)
    .join(" ")
}

function serializeAttribute([key, value]: [string, AttributeValue]):
  | string
  | undefined {
  if (typeof value === "boolean" && key.startsWith("aria-"))
    return `${key}="${value}"`
  if (!value) return undefined
  if (value === true) return key
  return `${key}="${value}"`
}

function primitiveChildToText(
  child: Exclude<JSX.Child, JSX.JSXElement>,
): string {
  if (!child) return ""
  return escapeHtml(String(child))
}

function escapeHtml(text: string): string {
  // TODO: May be optimized by using a regex approach with replace groups.
  return text
    .replaceAll("&", "&amp;") // careful, order matters !
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}
