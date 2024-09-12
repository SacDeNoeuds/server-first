import type { JSX } from "jsx-server/jsx-runtime"
import { PageLayout } from "./page-layout"

interface Props {
  heading?: JSX.Child
  message: JSX.Child
}
export function NotFoundPage({ heading, message }: Props) {
  return (
    <PageLayout heading={heading ?? "404 Not Found !"}>
      <div>{message}</div>
    </PageLayout>
  )
}
