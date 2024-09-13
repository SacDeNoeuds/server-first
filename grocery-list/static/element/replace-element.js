// @ts-check
import { getBySelector } from "../library.js"

export class ReplaceElementElement extends HTMLElement {
  connectedCallback() {
    this.#replaceElement()
    this.remove()
  }

  #replaceElement() {
    const target = getBySelector(this.getAttribute("target"))
    const template = this.children[0]
    if (template && !(template instanceof HTMLTemplateElement))
      throw new Error("expected only child to be a template")
    const replacement = template?.children[0]
    replacement ? target.replaceWith(replacement) : target.remove()
  }
}

Object.assign(globalThis, { ReplaceElementElement })

customElements.define("replace-element", ReplaceElementElement)
