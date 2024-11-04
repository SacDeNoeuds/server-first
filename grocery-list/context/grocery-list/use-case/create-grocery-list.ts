import {
  GroceryList,
  GroceryListBehavior,
  ListName,
  Participant,
  type GroceryListRepository,
} from "../domain"

export type CreateGroceryList = (input: {
  author: string
  participant: Participant
  name: ListName
}) => Promise<Omit<GroceryList, "lastUpdate">>

export const CreateGroceryList =
  (repository: { groceryList: GroceryListRepository }): CreateGroceryList =>
  async (input) => {
    const groceryList = GroceryListBehavior.create({
      name: input.name,
      participant: input.participant,
    })
    await repository.groceryList.set(input.author, new Date(), groceryList)
    return groceryList
  }
