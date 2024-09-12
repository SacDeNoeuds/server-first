// @ts-check
// @ts-ignore
class CopyButtonElement extends HTMLElement {
  get copyTarget() {
    const selector = this.getAttribute("copy-target")
    return selector && document.querySelector(selector)
  }
  get delayInS() {
    const value = this.getAttribute("delay-s") ?? "3"
    const delayInS = Number(value)
    if (Number.isNaN(delayInS))
      throw new Error(`invalid delay in seconds: ${value}`)
    return delayInS
  }
  get button() {
    const element = this.children[0]
    if (element instanceof HTMLButtonElement) return element
    throw new Error("expected only child to be a button")
  }

  constructor() {
    super()
    this.addEventListener("click", this.copyTextOfTarget)
  }

  copyTextOfTarget = () => {
    const target = this.copyTarget
    if (!target || !(target instanceof HTMLInputElement)) return
    // select and copy the selected text:
    target.select()
    document.execCommand("copy")
    const formerText = this.button.textContent
    this.button.textContent = "Copied"
    setTimeout(() => {
      this.button.textContent = formerText
    }, this.delayInS * 1000)
  }
}

Object.assign(globalThis, { CopyButtonElement })

globalThis.customElements.define("copy-button", CopyButtonElement)
