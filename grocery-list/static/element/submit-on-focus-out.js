// @ts-check

export class SubmitOnFocusOutElement extends HTMLElement {
  get #feedbackDelayInSeconds() {
    const value = this.getAttribute("feedback-delay")
    const delay = Number(value)
    if (Number.isNaN(delay))
      throw new Error(`invalid feedback-delay-in-s: ${value}`)
    return delay
  }

  connectedCallback() {
    this.addEventListener("focusout", this.#watchSubmit)
  }

  #watchSubmit = () => {
    requestAnimationFrame(async () => {
      if (this.contains(document.activeElement)) return
      const elements = {
        pending: this.#getBy("[slot=pending]"),
        success: this.#getBy("[slot=success]"),
        form: /** @type {HTMLFormElement} */ (this.#getBy("form")),
      }
      const action = elements.form.action
      const method = elements.form.method
      const type = elements.form.enctype
      // @ts-ignore
      const body = new URLSearchParams(new FormData(elements.form))
      elements.pending.hidden = false
      // TODO: Use `fetchHtml` from /library.js
      const response = await fetch(action, {
        method,
        headers: { "Content-Type": type },
        body,
        credentials: "include",
      })
      elements.pending.hidden = true
      elements.success.hidden = !response.ok
      setTimeout(() => {
        elements.success.hidden = true
      }, this.#feedbackDelayInSeconds * 1000)
    })
  }

  /** @param {string} selector */
  #getBy(selector) {
    const el = this.querySelector(selector)
    if (el) return /** @type {HTMLElement} */ (el)
    throw new Error(`no element found matching "${selector}"`)
  }
}

Object.assign(globalThis, { SubmitOnFocusOutElement })

customElements.define("submit-on-focus-out", SubmitOnFocusOutElement)
