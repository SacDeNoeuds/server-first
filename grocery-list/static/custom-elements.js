// @ts-check
/**
 * @param {string} markup
 * @returns {Set<`${string}-${string}`>}
 */
export const harvestCustomElements = (markup) => {
  const regex = /<([a-z]+-[-a-z]+)/g
  const match = markup.match(regex) ?? []
  return new Set(
    match.map((s) => /** @type {`${string}-${string}`} */ (s.replace("<", ""))),
  )
}

/** @type {Record<Extract<keyof HTMLElementTagNameMap, `${string}-${string}`>, `/${string}.js`>} */
export const customElementsImportMap = {
  "copy-button": "/static/element/copy-button.js",
  "submit-on-focus-out": "/static/element/submit-on-focus-out.js",
}
