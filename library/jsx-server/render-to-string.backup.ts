import { escapeHtml } from "@/std/escape-html"
import type { JSX } from "./jsx-runtime.backup"

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

export function renderToString(child: JSX.Child): string {
  if (child === null || typeof child !== "object")
    return primitiveChildToText(child)

  if (Array.isArray(child)) return child.map(renderToString).join("")
  if (child.type === "fragment")
    return child.children.flat().map(renderToString).join("") ?? ""
  if (child.type === "rawHtml") return child.children

  const attributes = serializeAttributes(child.attributes)
  const openingTag = `<${[child.tag, attributes].filter(Boolean).join(" ")}>`
  if (selfClosingTags.has(child.tag)) return openingTag
  const closingTag = `</${child.tag}>`
  const children = child.children.flat().map(renderToString).join("")

  return openingTag + children + closingTag
}

type AttributeValue = string | number | boolean | null | undefined
function serializeAttributes(
  attributes: Record<string, AttributeValue>,
): string {
  // If EVER needed, this can be optimized using array.reduce.
  return Object.entries(attributes ?? {})
    .map(serializeAttribute)
    .filter(Boolean)
    .join(" ")
}

function serializeAttribute([key, value]: [string, AttributeValue]):
  | string
  | undefined {
  if (typeof value === "boolean" && key.startsWith("aria-"))
    return `${key}="${value}"`
  if (value === undefined || value === null) return undefined
  if (value === true) return key
  return `${key}="${value}"`
}

function primitiveChildToText(
  child: Exclude<JSX.Child, JSX.JSXElement>,
): string {
  if (!child) return ""
  return escapeHtml(String(child))
}
