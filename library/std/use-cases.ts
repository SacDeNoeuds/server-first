import type { Simplify, UnionToIntersection } from "./types"

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
  useCasesToMake: UseCasesToMake,
  deps: DepsOf<UseCasesToMake>,
) {
  const thunk = {} as UseCasesOf<UseCasesToMake>
  for (const name in useCasesToMake) thunk[name] = useCasesToMake[name]!(deps)

  return thunk
}
