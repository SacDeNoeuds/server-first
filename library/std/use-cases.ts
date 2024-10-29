import type { Simplify, UnionToIntersection } from "./types"

// export function UseCasesProxy<UseCases extends Record<string, any>>(
//   name: string,
// ) {
//   let hasUseCasesBeenDefined = false
//   return new Proxy({} as UseCases, {
//     get: (target, property) => {
//       if (hasUseCasesBeenDefined) return target[property as keyof UseCases]
//       hasUseCasesBeenDefined = Object.keys(target).length > 0
//       if (hasUseCasesBeenDefined) return target[property as keyof UseCases]
//       throw new Error(`${name} use cases have not been defined`)
//     },
//   })
// }

type ShapeOfUseCasesToMake = Record<string, (deps: any) => any>
export type DepsOf<UseCasesToMake extends ShapeOfUseCasesToMake> = Simplify<
  UnionToIntersection<
    {
      [UseCase in keyof UseCasesToMake]: Parameters<UseCasesToMake[UseCase]>[0]
    }[keyof UseCasesToMake]
  >
>

export type UseCasesOf<UseCasesToMake extends ShapeOfUseCasesToMake> = {
  [UseCase in keyof UseCasesToMake]: ReturnType<UseCasesToMake[UseCase]>
}

export function defineUseCases<UseCasesToMake extends ShapeOfUseCasesToMake>(
  thunk: UseCasesOf<UseCasesToMake>,
  useCasesToMake: UseCasesToMake,
  deps: DepsOf<UseCasesToMake>,
) {
  for (const name in useCasesToMake) {
    thunk[name] = useCasesToMake[name]!(deps)
  }
  return thunk
}
