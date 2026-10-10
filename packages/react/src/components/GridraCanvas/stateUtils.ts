import type { GridraCanvasNode, GridraCanvasState } from "./types";
import { connectionsEqual } from "./connectionUtils";

function arraysEqual<T>(first: T[], second: T[], equals: (a: T, b: T) => boolean = Object.is) {
  return first === second || (first.length === second.length && first.every((item, index) => equals(item, second[index])));
}

type Comparators<TNode extends GridraCanvasNode> = {
  [K in keyof GridraCanvasState<TNode>]: (a: GridraCanvasState<TNode>[K], b: GridraCanvasState<TNode>[K]) => boolean;
};
const stateComparators: Comparators<GridraCanvasNode> = {
  nodes: Object.is,
  selectedIds: arraysEqual,
  connections: (a, b) => arraysEqual(a, b, connectionsEqual),
  selectedConnections: (a, b) => arraysEqual(a, b, connectionsEqual),
};

/** 状態項目を追加したら、対応する比較関数も型チェックで要求する。 */
export function canvasStatesEqual<TNode extends GridraCanvasNode>(first: GridraCanvasState<TNode>, second: GridraCanvasState<TNode>): boolean {
  const comparators: Comparators<TNode> = stateComparators;
  const equalField = <K extends keyof GridraCanvasState<TNode>>(key: K) => comparators[key](first[key], second[key]);
  return (Object.keys(comparators) as (keyof GridraCanvasState<TNode>)[]).every(equalField);
}
