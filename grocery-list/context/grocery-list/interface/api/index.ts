import { groceryList } from "@domain/grocery-list"
import { CreateGroceryListApiHandler } from "./create-grocery-list"
import { EditGroceryListItemApiHandler } from "./edit-grocery-list-item"

export const GroceryListApi = (deps: {
  queries: groceryList.Queries
  commands: groceryList.Commands
}) => ({
  createGroceryList: CreateGroceryListApiHandler(deps.commands),
  editGroceryListItem: EditGroceryListItemApiHandler({
    editGroceryListItem: deps.commands.editGroceryListItem,
    findGroceryListById: deps.queries.findGroceryListById,
  }),
})
