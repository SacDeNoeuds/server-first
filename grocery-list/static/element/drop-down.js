import { createRandomId, css } from "../library.js"

export class DropDownElement extends HTMLElement {
  // no need for disconnectedCallback, we only attached listeners to direct children.
  connectedCallback() {
    const { trigger, popover, control } = this.#setup()
    this.id ||= createRandomId()

    this.#setAnchorStyles(popover)
    popover.popover = "manual" // ensure this.

    this.addEventListener("focusin", () => popover.showPopover())
    this.addEventListener("focusout", () => {
      requestAnimationFrame(() => {
        if (!this.contains(document.activeElement)) popover.hidePopover()
      })
    })

    popover.addEventListener("click", (event) => {
      const data = this.#getOptionDataIfAny(event.target)
      if (!data) return
      if (trigger instanceof HTMLInputElement) trigger.value = data.label

      // set the control's value if some control is found.
      control && (control.value = data.value)

      this.hasAttribute("close-on-select") && popover.hidePopover()
    })
  }

  #getOptionDataIfAny(/** @type {Element | null} */ target) {
    const value = target?.getAttribute("value") ?? target?.dataset.value
    const label = target?.textContent
    return value && label ? { value, label } : undefined
  }

  #setup() {
    /** @type {HTMLElement | null} */
    const trigger = this.querySelector("input,button,[tabindex]")
    /** @type {HTMLElement | null} */
    const popover = this.querySelector("[popover]")
    if (!popover?.hasAttribute("popover") || !trigger)
      throw new Error("wrong children, see usage")

    const controlName = this.getAttribute("control-name")

    /** @type {HTMLFormElement | null} */
    const form = "form" in trigger ? trigger.form : this.closest("form")
    /** @type {HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | undefined} */
    const control = (controlName && form?.elements[controlName]) ?? undefined

    return { trigger, popover, control }
  }

  /**
   * @param {HTMLElement} popover
   */
  #setAnchorStyles(popover) {
    // FIXME: wait for the anchor positioning api to be stable
    const anchorName = `--${this.id}`
    this.#addInlineStyle(this, `anchor-name: ${anchorName}`)
    this.#addInlineStyle(
      popover,
      `position-anchor: ${anchorName}; top: anchor(${anchorName} bottom); left: anchor(${anchorName} left); width: anchor-size(width)`,
    )
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
    & [popover] {
      position: absolute;
      transform: translateY(var(--space-s, 0.5rem));
    }
  }
`
