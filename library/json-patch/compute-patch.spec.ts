// import { computeJsonPatch } from "./get-patch";

// broken !
// console.dir({
//   map: computePatch(
//     new Map([
//       ["a", 12],
//       ["b", 42],
//     ]),
//     new Map([
//       ["a", 42],
//       ["b", 62],
//     ]),
//   ),
// })

// function test() {
//   const original = {
//     email: "thomas",
//     profiles: [
//       { role: "admin" },
//       { role: "productOwner" },
//       { role: "brandManager" },
//       { role: "talent", id: 1 },
//       { role: "talent", id: 3 },
//     ],
//   };
//   const getCopy = () => ({
//     ...original,
//     profiles: original.profiles.map((p) => ({ ...p })),
//   });

//   it("computes nested array addition", () => {
//     const next = {
//       ...original,
//       profiles: [
//         ...original.profiles.slice(0, 3),
//         { role: "talent", id: 1 },
//         { role: "talent", id: 2 },
//         { role: "talent", id: 3 },
//       ],
//     };
//     const patch = computeJsonPatch(original, next);
//     expect(patch).toEqual([
//       { op: "replace", path: "/profiles/4/id", value: 2 },
//       { op: "add", path: "/profiles/5", value: { role: "talent", id: 3 } },
//     ]);
//   });

//   // NOTE: I couldn't find a lib handling that case.
//   it("computes nested array change", () => {
//     const next = getCopy();
//     next.profiles[3]!.id = 2;
//     const patch = computeJsonPatch(original, next);
//     expect(patch).toEqual([
//       { op: "replace", path: "/profiles/3/id", value: 2 },
//     ]);
//   });

//   it("handles deletion at root", () => {
//     expect(computeJsonPatch(original, null)).toEqual([
//       { op: "replace", path: "", value: null },
//     ]);
//   });
// });
