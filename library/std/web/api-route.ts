import * as S from "../schema"

type ApiRouteMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE"
export type { Shape as ApiRouteShape }
interface Shape {
  method: ApiRouteMethod
  path: `/${string}`
  body?: any
  response?: S.Schema<any>
}

export type ApiRoutes = Record<
  `${ApiRouteMethod} /${string}`,
  Omit<Shape, "method" | "path">
>

export function getApiRouteFromEntry([key, value]: [
  string,
  Omit<Shape, "method" | "path">,
]): Shape {
  const [method, path] = key.split(" ") as [ApiRouteMethod, `/${string}`]
  return { method, path, ...value }
}

// type GetGroceryListsRoute = ServerRoute<{
//   method: ""
//   path: "/test"
//   // response: { type: "Json"; body: string }
// }>
export const routes = {
  "GET /lists": { response: S.array(S.string) },
} satisfies ApiRoutes
