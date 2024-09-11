import type { JSX } from "jsx-server/jsx-runtime"
import { Head } from "./head"

interface Props {
  children: JSX.Children
}
export function Html(props: Props) {
  return (
    <html lang="en">
      <Head />
      <body>{props.children}</body>
    </html>
  )
}
