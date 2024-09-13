export function getBySelector(selector, root = document) {
  if (!selector) throw new Error(`no selector provided: ${selector}`)
  const element = root.querySelector(selector)
  if (element) return element
  throw new Error(`no element matches "${selector}"`)
}

export function fetchHtml({ controller = new AbortController(), ...init }) {
  /** @type {URL | undefined} */
  let redirect
  const trigger = async () => {
    const response = await fetch(init.url, {
      ...init,
      signal: controller.signal,
      credentials: "include",
      headers: { ...init.headers, Accept: "text/html" },
    })
    if (response.url !== init.url.toString()) redirect = new URL(response.url)
    const html = await response.text()
    // Detect new custom elements to import here.
    // Or leave that responsibility to the caller.
    return html
  }

  return {
    controller,
    trigger,
    get redirect() {
      return redirect
    },
  }
}
