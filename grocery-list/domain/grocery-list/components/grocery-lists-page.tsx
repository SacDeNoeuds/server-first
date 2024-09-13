import type { JSX } from "jsx-server/jsx-runtime"
import type { GroceryList } from "../entity/grocery-list"
import { NewGroceryListForm } from "./new-grocery-list-form"
import { PageLayout } from "./page-layout"

interface Props {
  groceryLists: GroceryList[]
}
export function GroceryListsPage(props: Props): JSX.JSXElement {
  return (
    <PageLayout heading="Your Grocery Lists" class="column gap-m card">
      <div class="column gap-s">
        {props.groceryLists.length === 0 ? (
          <p>You don’t have any grocery lists yet</p>
        ) : (
          <nav>
            <ul>
              {props.groceryLists.map((groceryList) => (
                <li>
                  <a href={`/grocery-list/${groceryList.id}`}>
                    {groceryList.name} ({groceryList.items.length} items)
                  </a>
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
