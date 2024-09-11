export class HttpError {
  readonly code!: number
  readonly message?: string
  readonly cause?: unknown
  constructor(init: HttpError) {
    Object.assign(this, init)
  }

  static fromCode = (code: number) => (init?: Omit<HttpError, "code">) => {
    return new HttpError({ code, ...init })
  }
}

export const BadRequest = HttpError.fromCode(400)
export const Unauthorized = HttpError.fromCode(401)
export const Forbidden = HttpError.fromCode(403)
export const NotFound = HttpError.fromCode(404)
export const MethodNotAllowed = HttpError.fromCode(405)
export const Conflict = HttpError.fromCode(409)
export const InternalServerError = HttpError.fromCode(500)
export const NotImplemented = HttpError.fromCode(501)
export const ServiceUnavailable = HttpError.fromCode(503)