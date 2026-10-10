import { createRect, getConnectionPath, getConnectionPoint, getNodeRect, type GridMetrics } from "./geometry";
import { getConnectionKey } from "./connectionUtils";
import { createNodeSnapGuides } from "./snapGuideUtils";
import type { GridraCanvasNode, GridraCanvasOverlayProps, GridraCanvasState } from "./types";
import type { Operation } from "./operation";

type OverlayData = Pick<GridraCanvasOverlayProps, "width" | "height" | "segments" | "previewPath" | "selectionRect" | "snapGuides">;

/** DOMを読まず、同じ寸法データから接続線と操作中の描画情報を作る。 */
export function computeOverlay<TNode extends GridraCanvasNode>(state: GridraCanvasState<TNode>, operation: Operation | null, metrics: GridMetrics | null): OverlayData {
  if (!metrics) return { width: 0, height: 0, segments: [], snapGuides: [] };
  const rects = new Map(state.nodes.map((node) => [node.id, getNodeRect(node.placement, metrics)]));
  const selected = new Set(state.selectedConnections.map(getConnectionKey));
  const segments = state.connections.flatMap((connection) => {
    const source = rects.get(connection.sourceId);
    const target = rects.get(connection.targetId);
    return source && target ? [{ connection, selected: selected.has(getConnectionKey(connection)),
      path: getConnectionPath(getConnectionPoint(source, "output"), getConnectionPoint(target, "input")) }] : [];
  });
  let previewPath: string | undefined;
  if (operation?.type === "connect") {
    const rect = rects.get(operation.id);
    if (rect) {
      const origin = getConnectionPoint(rect, operation.kind);
      previewPath = operation.kind === "output" ? getConnectionPath(origin, operation.point) : getConnectionPath(operation.point, origin);
    }
  }
  const moving = operation?.type === "drag" || operation?.type === "resize" ? rects.get(operation.id) : undefined;
  return {
    width: metrics.width, height: metrics.height, segments, previewPath,
    selectionRect: operation?.type === "range" ? createRect(operation.origin, operation.point) : undefined,
    snapGuides: moving && operation ? createNodeSnapGuides(moving, metrics, operation.type === "drag" ? "start" : "end") : [],
  };
}
