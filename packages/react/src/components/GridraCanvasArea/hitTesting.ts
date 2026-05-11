import type { GridraId, GridraRect } from "@gridra-ui/core";
import {
  getConnectionRect,
  getNodeRect,
  rectsIntersect,
} from "./geometry";
import type { GridraCanvasNode, GridraNodeConnection } from "./types";

export function hitTestNodes<TNode extends GridraCanvasNode>(
  nodes: TNode[],
  selectionRect: GridraRect,
  canvas: HTMLDivElement,
  gridColumns: number,
  gridRows: number,
): GridraId[] {
  if (selectionRect.width === 0 && selectionRect.height === 0) {
    return [];
  }

  return nodes
    .filter((node) =>
      rectsIntersect(
        selectionRect,
        getNodeRect(node.placement, canvas, gridColumns, gridRows),
      ),
    )
    .map((node) => node.id);
}

export function hitTestConnections<TNode extends GridraCanvasNode>(
  connections: GridraNodeConnection[],
  nodes: TNode[],
  selectionRect: GridraRect,
  canvas: HTMLDivElement,
  gridColumns: number,
  gridRows: number,
): GridraNodeConnection[] {
  if (selectionRect.width === 0 && selectionRect.height === 0) {
    return [];
  }

  return connections.filter((connection) => {
    const source = nodes.find((node) => node.id === connection.sourceId);
    const target = nodes.find((node) => node.id === connection.targetId);

    if (!source || !target) {
      return false;
    }

    return rectsIntersect(
      selectionRect,
      getConnectionRect(source.placement, target.placement, canvas, gridColumns, gridRows),
    );
  });
}
