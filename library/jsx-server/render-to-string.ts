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
  let html = ""
  if (element === null || typeof element !== "object")
    return html + primitiveChildToText(element)
  switch (element.type) {
    case "fragment":
      return html + (element.children?.map(renderToString).join("") ?? "")
    case "element":
      const attributes = serializeAttributes(element.attributes)
      const openingTag = `<${[element.tag, attributes]
        .filter(Boolean)
        .join(" ")}>`
      if (selfClosingTags.has(element.tag)) return html + openingTag
      const closingTag = `</${element.tag}>`
      return (
        html +
        `${openingTag}${element.children
          .map(renderToString)
          .join("")}${closingTag}`
      )
  }
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
  if (!value && !key.startsWith("aria-")) return undefined
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
  // TODO
  return text
}
