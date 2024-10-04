import assert from "assert"

declare module "jsx-server/jsx-runtime" {
  // eslint-disable-next-line
  namespace JSX {
    // That's how you fully provide the custom element's attributes, including ones
    // from HTML.
    interface MyComponentAttributes extends HTMLAttributes {
      likelihood: number
    }
    interface IntrinsicElements {
      "my-component": MyComponentAttributes
    }

    interface IntrinsicAttributes {
      "x-test"?: "hello-world!"
    }
  }
}

const test = () => {
  const FakeApp = () => (
    <div class="toto">
      <span hidden aria-hidden>
        Test {'<script>alert("hey")</script>'}
      </span>
      <input min={3} max={undefined} value={null} />
      <>
        {/* eslint-disable-next-line */}
        {false && "nothing"}
        <my-component likelihood={0.6} />
      </>
    </div>
  )

  const html = <FakeApp />

  // to test:
  // - string attribute
  // - boolean attribute
  // - number attribute
  // - aria-X
  // - custom attribute
  // - custom element
  // - fragment
  const htmlOfScript = "&lt;script&gt;alert(&quot;hey&quot;)&lt;/script&gt;"
  const expected = `<div class="toto"><span hidden aria-hidden="true">Test ${htmlOfScript}</span><input min="3"><my-component likelihood="0.6"></my-component></div>`
  assert.strictEqual(html.toString(), expected)
  console.info("all good ✅")
  // Yey, that's it !
}

test()
