import { Html } from "@shared/http-ui/kit/html"
import type { JSX } from "jsx-server/jsx-runtime"

interface Props {
  heading: JSX.Child
  children: JSX.Children
  class?: string
}

const css = /* css */ `
body {
  display: flex;
  flex-direction: column;
  justify-items: space-between;
  gap: 1rem;
  block-size: 100dvb;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-block-end: 2px solid black;
  background: #fff;
}
.page-body {
  inline-size: min(30rem, 95%);
  margin-inline: auto;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.page-footer {
  background: var(--text-color);
  color: var(--background-color);
  padding: 2rem 4rem;
  text-align: center;
}
`

export function PageLayout(props: Props) {
  return (
    <Html>
      <style>{css}</style>
      <header class="page-header">
        <a href="/">Home</a>
        <form method="post" action="/logout">
          <button>Logout</button>
        </form>
      </header>
      <div class="page-body">
        <div class={props.class ?? "card"}>
          <h1>{props.heading}</h1>
          {props.children}
        </div>
      </div>

      <footer class="page-footer">
        Page Footer. There's no information but it fills up the space.
      </footer>
    </Html>
  )
}
