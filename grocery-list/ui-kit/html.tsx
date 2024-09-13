import { RawHtml, type JSX } from "jsx-server/jsx-runtime"
import { renderToString } from "jsx-server/render-to-string"
import {
  customElementsImportMap,
  harvestCustomElements,
} from "../static/custom-elements"
import { Head } from "./head"

interface Props {
  children: JSX.Children
}
export function Html(props: Props) {
  const markup = [props.children].flat().map(renderToString).join("")
  const customElements = harvestCustomElements(markup)
  const elementsMap = customElementsImportMap as Record<string, string>
  const scripts = Array.from(customElements)
    .map((element) => elementsMap[element] ?? "")
    .filter(Boolean)

  return (
    <>
      <RawHtml>{"<!DOCTYPE html>"}</RawHtml>
      <html lang="en">
        <Head />
        <body>
          <RawHtml>{markup}</RawHtml>
          {scripts.map((src) => (
            <script type="module" src={src} />
          ))}
        </body>
      </html>
    </>
  )
}
