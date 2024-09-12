import type { GroceryList } from "../entity/grocery-list"
import { GroceryListItemFormModal } from "./grocery-list-item-form-modal"
import { PageLayout } from "./page-layout"
import { TickGroceryListItemButton } from "./tick-grocery-list-item-button"

interface Props {
  groceryList: GroceryList
  joinUrl: URL
}
export function GroceryListPage({ groceryList, joinUrl }: Props) {
  return (
    <PageLayout heading={groceryList.name}>
      {groceryList.items.length === 0 && (
        <div>You don’t have any item yet.</div>
      )}

      {groceryList.items.map((item, index) => (
        <div
          class="grocery-list-item"
          style="padding-block: 0.5rem; display: flex; gap: 0.5rem; justify-content: space-between; align-items: center; flex-wrap: wrap"
        >
          <div>
            {item.name} – ×{item.quantity}
          </div>
          <div style="display: flex; align-items: center; gap: 0.25rem">
            <GroceryListItemFormModal
              groceryListId={groceryList.id}
              values={{ ...item, index }}
            >
              Edit
            </GroceryListItemFormModal>
            <span>{"•"}</span>
            <TickGroceryListItemButton
              groceryListId={groceryList.id}
              index={index}
            />
          </div>
        </div>
      ))}

      <hr />

      <GroceryListItemFormModal groceryListId={groceryList.id}>
        Add
      </GroceryListItemFormModal>

      <div>
        <p>Copy-Paste that link and share it with your shop-mates</p>
        <input type="url" id="join-url-control" readonly value={joinUrl.href} />
        <copy-button copy-target="#join-url-control">
          <button type="button">Copy</button>
        </copy-button>
      </div>
    </PageLayout>
  )
}
