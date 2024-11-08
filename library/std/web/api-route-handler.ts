import * as S from "../schema"
import type { If, Is } from "../types"
import type { ApiRouteShape } from "./api-route"
import type { ServerHandler } from "./server-handler"

export type ApiRouteHandler<Route extends ApiRouteShape> = ServerHandler<
  If<
    Is<Route["response"], undefined>,
    void,
    S.ValueOf<NonNullable<Route["response"]>>
  >
>
