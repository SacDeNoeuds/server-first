import { fetchHtml, getBySelector } from "../library.js"

/**
 * @property {url} URL
 * @property {Record<string, HTMLInputElement>} paramTargets
 * @property {Record<string, HTMLInputElement>} searchTargets
 * @property {HTMLTemplateElement} pendingTemplate
 * @property {HTMLTemplateElement} failureTemplate
 * @property {HTMLElement} successTarget
 * @property {HTMLElement | undefined} currentResultNode
 */
export class RemoteHtmlElement extends HTMLElement {
  connectedCallback() {
    this.#setup()
    const inputs = [
      ...Object.values(this.searchTargets),
      ...Object.values(this.paramTargets),
    ]
    inputs.forEach((input) => {
      input.addEventListener(this.triggerEvent, this.#fetch)
    })
    this.#fetch()
  }

  #fetch = (event) => {
    event?.preventDefault()
    const url = new URL(this.url)
    for (const [name, input] of Object.entries(this.paramTargets)) {
      if (!input.value) return console.debug("no param for", name)
      url.pathname = url.pathname.replaceAll(`:${name}`, input.value)
    }
    for (const [name, input] of Object.entries(this.searchTargets)) {
      if (!input.value) return console.debug("no search for", name)
      return url.searchParams.set(name, input.value)
    }
    this.action?.controller.abort()
    this.action = fetchHtml({ url })
    this.#renderPending()
    this.action.trigger().then(this.#renderSuccess).catch(this.#renderFailure)
  }

  #renderPending() {
    this.successElement.ariaBusy = "true"
    this.currentResultNode?.remove()
    if (this.successElement.innerHTML !== "") return
    this.currentResultNode = this.#createHtml(this.pendingTemplate.innerHTML)
    this.append(this.currentResultNode)
  }

  #renderSuccess = (html) => {
    this.currentResultNode?.remove()
    this.successElement.ariaBusy = "false"
    this.successElement.innerHTML = html
    this.successElement.hidden = false
  }

  #renderFailure = (error) => {
    this.successElement.classList.remove("pending")
    this.successElement.hidden = true
    this.currentResultNode?.remove()
    const html = this.failureTemplate.innerHTML.replaceAll(
      "[error]",
      error.message,
    )
    this.currentResultNode = this.#createHtml(html)
    this.append(this.currentResultNode)
  }

  #setup() {
    this.style.display = "contents"
    const endpoint = this.getAttribute("endpoint")
    if (!endpoint) throw new Error("no endpoint provided")
    this.url = new URL(endpoint, globalThis.location.href)
    this.searchTargets = this.#parseTargets("search-targets")
    this.paramTargets = this.#parseTargets("param-targets")
    this.pendingTemplate = getBySelector('template[when-is="pending"]')
    this.failureTemplate = getBySelector('template[when-is="failure"]')
    this.successElement = getBySelector('[when-is="success"]')
    /** @type {'blur' | 'change' | 'input'} */
    this.triggerEvent = this.getAttribute("trigger-fetch-on") ?? "blur"
  }

  /**
   * @param {string} attributeName
   * @returns {Record<string, HTMLInputElement>}
   */
  #parseTargets(attributeName) {
    const targets = this.getAttribute(attributeName)
    /** @type {Record<string, HTMLInputElement>} */
    const elements = {}
    if (!targets) return elements
    new URLSearchParams(targets).forEach((selector, name) => {
      const input = document.querySelector(selector)
      if (input instanceof HTMLInputElement) elements[name] = input
      else console.warn(`"${selector}" is not an input`)
    })
    return elements
  }

  /** @param {string} html */
  #createHtml(html) {
    const span = document.createElement("span")
    span.innerHTML = html
    span.style.display = "contents"
    return span
  }
}

Object.assign(globalThis, { RemoteHtmlElement })
customElements.define("remote-html", RemoteHtmlElement)
