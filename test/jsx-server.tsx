// The test must be located outside the jsx-server folder.

import assert from "assert"
import { renderToString } from "jsx-server/render-to-string"

declare module "jsx-server/jsx-runtime" {
  namespace JSX {
    // That's how you fully provide the custom element's attributes, including ones
    // from HTML.
    interface MyComponentHTMLAttributes extends HTMLAttributes {
      likelihood: number
    }
    interface IntrinsicElements {
      "my-component": MyComponentHTMLAttributes
    }

    interface IntrinsicAttributes {
      "x-test"?: "hello-world!"
    }
  }
}

const test = () => {
  const FakeApp = () => (
    <div class="toto">
      <span hidden aria-hidden="true">
        Test
      </span>
      <input min={3} max={undefined} value={null} />
      <>
        {false && "nothing"}
        <my-component likelihood={0.6} />
      </>
    </div>
  )

  const html = renderToString(<FakeApp />)

  // to test:
  // - string attribute
  // - boolean attribute
  // - number attribute
  // - aria-X
  // - custom attribute
  // - custom element
  // - fragment
  const expected =
    '<div class="toto"><span hidden aria-hidden="true">Test</span><input min="3"><my-component likelihood="0.6"></my-component></div>'
  assert.strictEqual(html, expected)
  console.info("all good ✅")
  // Yey, that's it !
}

test()
