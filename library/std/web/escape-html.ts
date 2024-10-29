export function escapeHtml(text: string): string {
  // TODO: May be optimized by using a regex approach with replace groups.
  return text
    .replaceAll("&", "&amp;") // careful, order matters !
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}
