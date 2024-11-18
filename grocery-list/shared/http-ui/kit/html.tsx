import { RawHtml, type JSX } from "jsx-server/jsx-runtime"
import {
  customElementsImportMap,
  harvestCustomElements,
} from "../static/custom-elements"
import { Head } from "./head"

interface Props {
  children: JSX.Children
}

export function Html(props: Props) {
  const html = <>{props.children}</>
  const customElements = harvestCustomElements(html.toString())
  const elementsMap = customElementsImportMap as Record<string, string>
  const scripts = Array.from(customElements)
    .map((element) => elementsMap[element] ?? "")
    .filter(Boolean)

  return (
    <>
      <RawHtml>{"<!DOCTYPE html>"}</RawHtml>
      <html lang="en">
        <Head scripts={scripts} />
        <body>{html}</body>
      </html>
    </>
  )
}
