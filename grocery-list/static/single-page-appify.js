// @ts-check
import { fetchHtml } from "./library.js"

/** @type {import('./library').FetchHtmlAction | undefined} */
let action = undefined

/**
 * @param {object} options
 * @param {string} options.href
 * @param {() => void} [options.ifNavigated]
 */
async function maybeNavigateTo({ href, ifNavigated }) {
  const hasNavigated = navigateTo(href)
  if (!hasNavigated) return
  ifNavigated?.()

  await replaceBody(fetchHtml({ url: href }))
}

document.addEventListener("click", async (event) => {
  const target = event.target
  if (!(target instanceof HTMLAnchorElement)) return
  await maybeNavigateTo({
    href: target.href,
    ifNavigated: () => event.preventDefault(),
  })
})

window.addEventListener("popstate", async () => {
  await maybeNavigateTo({ href: location.href })
})

document.addEventListener("submit", async (event) => {
  if (event.defaultPrevented) return
  const form = event.target
  if (!(form instanceof HTMLFormElement)) return
  event.preventDefault()
  const submitter = event.submitter
  const button = submitter instanceof HTMLButtonElement ? submitter : undefined
  button && (button.disabled = true)

  let body = undefined
  if (form instanceof HTMLFormElement) {
    const formData = new FormData(form)
    body =
      form.enctype === "multipart/form-data"
        ? formData
        : // @ts-ignore TS doesn't know form data is an iterable
          new URLSearchParams(formData)
  }

  await replaceBody(
    fetchHtml({
      url: form.action,
      method: form.method,
      body,
      headers: {
        // MDN says multipart/form-data must explicitly NOT be provided.
        "Content-Type":
          form.enctype === "multipart/form-data" ? undefined : form.enctype,
      },
    }),
  )

  button && (button.disabled = false)
})

/**
 * @param {import('./library').FetchHtmlAction} nextAction
 */
async function replaceBody(nextAction) {
  action?.controller.abort()
  action = nextAction
  const html = await action.trigger()
  const lastRedirect = action.redirect
  action = undefined
  replaceBodyElement(html)
  if (lastRedirect) navigateTo(lastRedirect.href)
}

/** @param {string} markup */
function replaceBodyElement(markup) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(markup, "text/html")
  mergeHead(doc.head)
  document.body.replaceWith(doc.body)
}

/** @param {HTMLHeadElement | null} head */
function mergeHead(head) {
  if (!head) return
  const nextTitle = head.querySelector("title")?.textContent
  if (nextTitle) document.title = nextTitle

  // merge stylesheets
  const links = /** @type {HTMLLinkElement[]} */ (
    Array.from(head.querySelectorAll('link[rel="stylesheet"][href]'))
  )
  for (const link of links) {
    const href = link.getAttribute("href")
    if (!document.head.querySelector(`link[href="${href}"]`))
      document.head.append(link)
  }

  const scripts = /** @type {HTMLScriptElement[]} */ (
    Array.from(head.querySelectorAll('script[type="module"][src]'))
  )
  for (const script of scripts) import(script.src)
}

/**
 * @param {string} href
 * @param {'replace'} [action]
 * @returns {boolean} whether it has redirected or not
 */
function navigateTo(href, action) {
  const base = document.querySelector("base")
  const baseUrl = base?.href ?? globalThis.location.origin

  if (!href.startsWith(baseUrl)) return false
  const navigate =
    action === "replace" ? history.replaceState : history.pushState

  navigate.call(history, null, "", href)
  return true
}
