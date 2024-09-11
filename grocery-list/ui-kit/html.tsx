import { RawHtml, type JSX } from "jsx-server/jsx-runtime"
import { Head } from "./head"

interface Props {
  children: JSX.Children
}
export function Html(props: Props) {
  return (
    <>
      <RawHtml>{"<!DOCTYPE html>"}</RawHtml>
      <html lang="en">
        <Head />
        <body>{props.children}</body>
      </html>
    </>
  )
}
