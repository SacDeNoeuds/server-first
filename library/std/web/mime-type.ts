export enum MimeType {
  Json = "application/json",
  Js = "text/javascript",
  Html = "text/html",
  Css = "text/css",
  Png = "image/png",
  Jpeg = "image/jpeg",
  Webp = "image/webp",
  Blob = "application/octet-stream",
}

export const mimeTypeFromExtension: Record<string, MimeType> = {
  ".json": MimeType.Json,
  ".js": MimeType.Js,
  ".html": MimeType.Html,
  ".css": MimeType.Css,
  ".png": MimeType.Png,
  ".jpeg": MimeType.Jpeg,
  ".webp": MimeType.Webp,
}
