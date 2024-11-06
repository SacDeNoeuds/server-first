import type { GroceryList } from "@domain/grocery-list/domain"
import { NewGroceryListForm } from "./new-grocery-list-form"
import { PageLayout } from "./page-layout"

interface Props {
  groceryLists: GroceryList[]
}
export function GroceryListsPage(props: Props) {
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  })

  return (
    <PageLayout heading="Your Grocery Lists" class="column gap-m card">
      <div class="column gap-s">
        {props.groceryLists.length === 0 ? (
          <p>You don’t have any grocery lists yet</p>
        ) : (
          <nav>
            <ul>
              {props.groceryLists.map((groceryList) => (
                <li class="flex gap-m justify-between">
                  <a href={`/grocery-list/${groceryList.id}`}>
                    {groceryList.name} ({groceryList.items.size} items)
                  </a>
                  <span>
                    Last Update: {formatter.format(groceryList.lastUpdate)}
                  </span>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <div class="column gap-s">
        <h2>New Grocery List</h2>
        <NewGroceryListForm />
      </div>
    </PageLayout>
  )
}
