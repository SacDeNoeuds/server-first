import { Html } from "grocery-list/ui-kit/html"
import type { JSX } from "jsx-server/jsx-runtime"

interface Props {
  heading: JSX.Child
  children: JSX.Children
}
export function PageLayout(props: Props) {
  return (
    <Html>
      <h1>{props.heading}</h1>
      {props.children}
    </Html>
  )
}
