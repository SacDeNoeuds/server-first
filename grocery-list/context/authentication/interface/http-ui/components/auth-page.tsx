import { Html } from "@shared/http-ui/kit/html"
import type { JSX } from "jsx-server/jsx-runtime"

interface Props {
  children?: JSX.Children
}
export function AuthPage(props: Props) {
  return (
    <Html>
      <div
        class="flex align-center justify-center"
        style="min-block-size: 100dvb;"
      >
        <div class="card">{props.children}</div>
      </div>
    </Html>
  )
}
