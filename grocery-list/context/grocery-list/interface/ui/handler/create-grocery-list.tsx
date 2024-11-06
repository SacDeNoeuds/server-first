import { schema as S } from "@/std"
import { redirectTo, type ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import { ListName, Participant } from "@domain/grocery-list/domain"
import type { CreateGroceryList } from "@domain/grocery-list/use-case/create-grocery-list"
import type { JSX } from "jsx-server/jsx-runtime"
import { NewGroceryListForm } from "../components/new-grocery-list-form"
import { PageLayout } from "../components/page-layout"

type Handler = ServerHandler<JSX.Element, { account: authentication.Account }>

export const CreateGroceryListHandler =
  (useCase: { createGroceryList: CreateGroceryList }): Handler =>
  async (ctx) => {
    const Payload = S.object({
      name: ListName,
    })

    const body = Payload.decode(ctx.body)
    if (S.isFailure(body)) {
      console.warn("error", body)
      return (
        <PageLayout heading="New Grocery List">
          <NewGroceryListForm
            errors={{
              name: "We could not create your grocery list, please try again",
            }}
          />
        </PageLayout>
      )
    }

    const groceryList = await useCase.createGroceryList({
      author: ctx.account.email,
      participant: Participant(ctx.account.id),
      name: body.value.name,
    })

    return redirectTo(new URL(`/grocery-list/${groceryList.id}`, ctx.url))
  }
