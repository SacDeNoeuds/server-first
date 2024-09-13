export function getBySelector(
  selector: string | null | undefined,
  root?: {
    querySelector(selector: string): HTMLElement | null
  },
): HTMLElement

export interface FetchHtmlOpts
  extends Omit<RequestInit, "headers" | "redirect" | "signal" | "credentials"> {
  controller?: AbortController
  url: string | URL
  headers?: Record<string, string | undefined>
}
export function fetchHtml(init: FetchHtmlOpts): FetchHtmlAction

export type FetchHtmlAction = {
  trigger: () => Promise<string>
  redirect: URL | undefined
  controller: AbortController
}