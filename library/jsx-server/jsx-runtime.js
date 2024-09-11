// @ts-check

export function jsx(tagOrComponent, props) {
  if (typeof tagOrComponent === "function") return tagOrComponent(props)
  const { children, ...attributes } = props
  return {
    type: "element",
    tag: tagOrComponent,
    attributes,
    children: toArray(children).flat(),
  }
}
const toArray = (value) => (Array.isArray(value) ? value : [value])

export { jsx as jsxDEV, jsx as jsxs }

export function Fragment(props) {
  return { type: "fragment", children: toArray(props.children).flat() }
}

export function RawHtml(props) {
  return { type: "rawHtml", children: props.children }
}
