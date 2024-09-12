import type { ComponentProps, JSX } from "jsx-server/jsx-runtime"
import { NewGroceryListForm } from "./new-grocery-list-form"
import { PageLayout } from "./page-layout"

type FormProps = ComponentProps<typeof NewGroceryListForm>
type Props = FormProps

export function NewGroceryListPage(props: Props): JSX.JSXElement {
  return (
    <PageLayout heading="Your New Grocery List">
      <NewGroceryListForm {...props} />
    </PageLayout>
  )
}
