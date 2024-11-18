import { schema as S } from "@/std"
import { redirectTo, type ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import { ListName, Participant } from "@domain/grocery-list/domain"
import type { CreateGroceryListCommand } from "@domain/grocery-list/domain/command/create-grocery-list"
import type { JSX } from "jsx-server/jsx-runtime"
import { NewGroceryListForm } from "../components/new-grocery-list-form"
import { PageLayout } from "../components/page-layout"

type Handler = ServerHandler<JSX.Element, { account: authentication.Account }>

export const CreateGroceryListHttpUiHandler =
  (command: { createGroceryList: CreateGroceryListCommand }): Handler =>
  async (ctx) => {
    const bodySchema = S.object({ name: ListName.schema })
    const body = bodySchema.decode(ctx.body)

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

    const groceryList = await command.createGroceryList({
      author: ctx.account.id,
      participant: Participant.from(ctx.account.id),
      name: body.value.name,
    })

    if (S.isFailure(groceryList)) {
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

    return redirectTo(new URL(`/grocery-list/${groceryList.id}`, ctx.url))
  }
