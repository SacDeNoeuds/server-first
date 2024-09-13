// @ts-check
import { getBySelector } from "../library.js"

export class InsertChildrenElement extends HTMLElement {
  connectedCallback() {
    this.#insertChildren()
    this.remove()
  }

  #insertChildren() {
    const target = getBySelector(this.getAttribute("target"))
    // update to accept a template child.
    const children = Array.from(this.children)

    const at = this.getAttribute("at")
    if (at === "end") return target.append(...children)

    const index = at === "start" ? 0 : Number(at)
    if (Number.isNaN(index)) throw new Error(`"at" not a number: ${at}`)

    const targetChildren = Array.from(target.children)
    const elementBefore = targetChildren.at(index)
    if (!elementBefore) return target.append(...children)

    const fragment = document.createDocumentFragment()
    fragment.append(...children)
    target.insertBefore(fragment, elementBefore)
  }
}

Object.assign(globalThis, { InsertChildrenElement })
customElements.define("insert-children", InsertChildrenElement)
