import type { GroceryList } from "@domain/grocery-list/domain"
import { GroceryListItemFormModal } from "./grocery-list-item-form-modal"
import { PageLayout } from "./page-layout"
import { QuantityForm } from "./quantity-form"
import { Sandbox } from "./sandbox"
import { TickGroceryListItemButton } from "./tick-grocery-list-item-button"

interface Props {
  groceryList: GroceryList
  lastGroceryListUpdate: Date
  joinUrl: URL
}
export function GroceryListPage({
  groceryList,
  lastGroceryListUpdate,
  joinUrl,
}: Props) {
  return (
    <PageLayout class="card column gap-l" heading={groceryList.name}>
      <Sandbox />

      {groceryList.items.size === 0 && <div>You don’t have any item yet.</div>}

      <div
        class="grid align-center gap-xs"
        style="--template: min-content 1fr min-content;"
      >
        {Array.from(groceryList.items).map(([itemName, item], index) => (
          <>
            <span style="min-inline-size: 5em">{itemName}</span>

            <QuantityForm
              groceryListId={groceryList.id}
              lastGroceryListUpdate={lastGroceryListUpdate}
              values={{ name: itemName, ...item }}
            />

            <small class="flex align-center gap-xs">
              <GroceryListItemFormModal
                groceryListId={groceryList.id}
                lastGroceryListUpdate={lastGroceryListUpdate}
                values={{ name: itemName, ...item }}
              >
                Edit
              </GroceryListItemFormModal>
              <span>{"•"}</span>
              <TickGroceryListItemButton
                groceryListId={groceryList.id}
                lastGroceryListUpdate={lastGroceryListUpdate}
                itemName={itemName}
              />
            </small>
          </>
        ))}
      </div>

      <GroceryListItemFormModal
        groceryListId={groceryList.id}
        lastGroceryListUpdate={lastGroceryListUpdate}
      >
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
