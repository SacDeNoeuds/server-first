import { applyPatch } from "./apply-patch"

function test() {
  console.dir({
    removingUnexistentProp: applyPatch({ a: 1 }, [
      { op: "remove", path: "/b" },
    ]),
  })
}

test()
