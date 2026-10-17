import type { GridraId, GridraRect } from "@gridra-ui/core";
import { getConnectionRect, getNodeRect, rectsIntersect, type GridMetrics } from "./geometry";
import type { GridraCanvasNode, GridraNodeConnection } from "./types";

export function hitTestNodes<TNode extends GridraCanvasNode>(
  nodes: TNode[], selectionRect: GridraRect, metrics: GridMetrics,
): GridraId[] {
  if (selectionRect.width === 0 && selectionRect.height === 0) return [];
  return nodes.filter((node) => rectsIntersect(selectionRect, getNodeRect(node.placement, metrics))).map((node) => node.id);
}

export function hitTestConnections<TNode extends GridraCanvasNode>(
  connections: GridraNodeConnection[], nodes: TNode[], selectionRect: GridraRect, metrics: GridMetrics,
): GridraNodeConnection[] {
  if (selectionRect.width === 0 && selectionRect.height === 0) return [];
  const rects = new Map(nodes.map((node) => [node.id, getNodeRect(node.placement, metrics)]));
  return connections.filter((connection) => {
    const source = rects.get(connection.sourceId);
    const target = rects.get(connection.targetId);
    return source && target && rectsIntersect(selectionRect, getConnectionRect(source, target));
  });
}
