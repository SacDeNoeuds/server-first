export type JsonPatchOperation =
  | AddOperation
  | RemoveOperation
  | ReplaceOperation
  | MoveOperation
  | CopyOperation
  | TestOperation
export type JsonPatch = JsonPatchOperation[]

interface BaseOperation {
  path: string
}

interface AddOperation extends BaseOperation {
  op: "add"
  value: unknown
}

interface RemoveOperation extends BaseOperation {
  op: "remove"
}

/**
 * The JSON patch replace operation
 */
interface ReplaceOperation extends BaseOperation {
  op: "replace"
  value: unknown
}

/**
 * The JSON patch move operation
 */
interface MoveOperation extends BaseOperation {
  op: "move"
  from: unknown
}

/**
 * The JSON patch copy operation.
 */
interface CopyOperation extends BaseOperation {
  op: "copy"
  from: unknown
}

/**
 * The JSON patch test operation
 */
interface TestOperation extends BaseOperation {
  op: "test"
  value: unknown
}
