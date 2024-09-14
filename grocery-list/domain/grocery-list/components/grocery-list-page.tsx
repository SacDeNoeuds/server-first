import type { GroceryList } from "../entity/grocery-list"
import { DropdownTest } from "./dropdown-test"
import { GroceryListItemFormModal } from "./grocery-list-item-form-modal"
import { PageLayout } from "./page-layout"
import { QuantityForm } from "./quantity-form"
import { TickGroceryListItemButton } from "./tick-grocery-list-item-button"

interface Props {
  groceryList: GroceryList
  joinUrl: URL
}
export function GroceryListPage({ groceryList, joinUrl }: Props) {
  return (
    <PageLayout class="card column gap-l" heading={groceryList.name}>
      <DropdownTest />

      {groceryList.items.length === 0 && (
        <div>You don’t have any item yet.</div>
      )}

      <div
        class="grid align-center gap-xs"
        style="--template: min-content 1fr min-content;"
      >
        {groceryList.items.map((item, index) => (
          <>
            <span>{item.name}</span>

            <QuantityForm
              groceryListId={groceryList.id}
              values={{ ...item, index }}
            />

            <small class="flex align-center gap-xs">
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
            </small>
          </>
        ))}
      </div>

      <GroceryListItemFormModal groceryListId={groceryList.id}>
        Add
      </GroceryListItemFormModal>

      <hr />

      <div class="column gap-s">
        <p>Copy-Paste that link and share it with your shop-mates</p>
        <div class="flex gap-s align-center">
          <input
            type="url"
            id="join-url-control"
            class="flex-1"
            readonly
            value={joinUrl.href}
          />
          <copy-button copy-target="#join-url-control">
            <button type="button">Copy</button>
          </copy-button>
        </div>
      </div>
    </PageLayout>
  )
}
