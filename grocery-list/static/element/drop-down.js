import { createRandomId, css } from "../library.js"

export class DropDownElement extends HTMLElement {
  // no need for disconnectedCallback, we only attached listeners to direct children.
  connectedCallback() {
    const { trigger, popover, form } = this.#getElements()
    this.id ||= createRandomId()
    const anchorName = `--${this.id}`
    this.#addInlineStyle(this, `anchor-name: ${anchorName}`)
    this.#addInlineStyle(
      popover,
      `position-anchor: ${anchorName}; top: anchor(${anchorName} bottom); left: anchor(${anchorName} left); width: anchor-size(width)`,
    )
    popover.popover = "manual" // ensure this.
    this.contains(document.activeElement)
      ? popover.showPopover()
      : popover.hidePopover()

    this.addEventListener("focusin", () => popover.showPopover())
    this.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (!this.contains(document.activeElement)) popover.hidePopover()
      })
    })

    popover.addEventListener("click", (event) => {
      const data = this.#getTargetData(event.target)
      if (!data) return
      if (trigger instanceof HTMLInputElement) trigger.value = data.label
      const control =
        form && data.name in form.elements && form.elements[data.name]
      "value" in control && (control.value = data.value)
      this.hasAttribute("close-on-select") && popover.hidePopover()
    })
  }

  #getTargetData(/** @type {Element | null} */ target) {
    const value = target?.getAttribute("value") ?? target?.dataset.value
    const name = target?.getAttribute("name") ?? target?.dataset.name
    const label = target?.textContent
    return value && label && name ? { name, value, label } : undefined
  }

  #getElements() {
    const trigger = /** @type {HTMLElement | null} */ (
      this.querySelector("input,button,[tabindex]")
    )
    const popover = /** @type {HTMLElement | null} */ (
      this.querySelector("[popover]")
    )
    if (!popover?.hasAttribute("popover") || !trigger)
      throw new Error("wrong children, see usage")

    const form = /** @type {HTMLFormElement | null} */ (
      "form" in trigger ? trigger.form : this.closest("form")
    )
    return { trigger, popover, form }
  }
  /**
   * @param {HTMLElement} element
   * @param {string} rules
   */
  #addInlineStyle(element, rules) {
    const current = element.getAttribute("style")
    element.setAttribute("style", [current, rules].filter(Boolean).join(";"))
  }
}

Object.assign(globalThis, { DropDownElement })
customElements.define("drop-down", DropDownElement)

// Styling
if (!("anchorName" in document.documentElement.style)) {
  import("https://unpkg.com/@oddbird/css-anchor-positioning")
}

css`
  drop-down {
    outline: blue 1px solid;
    outline-offset: 2px;

    & [popover] {
      position: absolute;
      transform: translateY(var(--space-s, 0.5rem));
    }
  }
`
