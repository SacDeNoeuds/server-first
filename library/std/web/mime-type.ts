export const MimeType = {
  Json: "application/json",
  Js: "text/javascript",
  Html: "text/html",
  Css: "text/css",
  Png: "image/png",
  Jpeg: "image/jpeg",
  Webp: "image/webp",
  Blob: "application/octet-stream",
} as const
export type MimeType = keyof typeof MimeType
export type MimeTypeOf<T extends MimeType> = T

export const mimeTypeFromExtension: Record<string, string> = {
  ".json": MimeType.Json,
  ".js": MimeType.Js,
  ".html": MimeType.Html,
  ".css": MimeType.Css,
  ".png": MimeType.Png,
  ".jpeg": MimeType.Jpeg,
  ".webp": MimeType.Webp,
}
