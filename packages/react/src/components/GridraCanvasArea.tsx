// 実際にグリッド上に描画される土台のコンポーネント

import type { CSSProperties, HTMLAttributes, PointerEvent, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import type { GridraId, GridraPoint, GridraRect } from "@gridra-ui/core";
import { GridraDragHandle } from "./GridraDragHandle";
import { GridraNode, type GridraNodePlacement } from "./GridraNode";
import { GridraSelectionBox } from "./GridraSelectionBox";
import { useControllableValue } from "./useControllableValue";

// キャンバス上に配置されるノード（要素）のインタフェース
export interface GridraCanvasNode {
  id: GridraId;
  placement: GridraNodePlacement;
  label?: ReactNode;
}

export type GridraNodePlacements = Record<string, GridraNodePlacement>;

export interface GridraCanvasRenderNodeState {
  selected: boolean;
  dragging: boolean;
  dragHandleProps: HTMLAttributes<HTMLSpanElement>;
  dragHandle: ReactNode;
}

// Canvasに渡すpropsをまとめたインタフェース
export interface GridraCanvasAreaProps<
  TNode extends GridraCanvasNode = GridraCanvasNode,
> extends HTMLAttributes<HTMLDivElement> {
  gridColumns?: number;
  gridRows?: number;
  nodes?: TNode[]; // Canvas上に配置されるノードのリスト
  nodePlacements?: GridraNodePlacements;
  defaultNodePlacements?: GridraNodePlacements;
  selectedId?: GridraId | null; // 選択されているノードのID（外部から制御する場合）
  defaultSelectedId?: GridraId | null; // 選択されているノードのIDの初期値（内部で制御する場合）
  selectedIds?: GridraId[];
  defaultSelectedIds?: GridraId[];
  enableNodeDragging?: boolean;
  enableRangeSelection?: boolean;
  onNodeMove?: (
    id: GridraId,
    placement: GridraNodePlacement,
    previousPlacement: GridraNodePlacement,
  ) => void;
  onNodePlacementsChange?: (
    nodePlacements: GridraNodePlacements,
    previousNodePlacements: GridraNodePlacements,
  ) => void;
  onSelectionChange?: (
    selectedId: GridraId | null,
    previousSelectedId: GridraId | null,
  ) => void; // ノードの選択が変更されたときに呼び出されるコールバック関数
  onSelectionIdsChange?: (
    selectedIds: GridraId[],
    previousSelectedIds: GridraId[],
  ) => void;
  renderNode?: (node: TNode, state: GridraCanvasRenderNodeState) => ReactNode; // ノードの描画をカスタマイズするための関数
}

interface NodeDragState {
  id: GridraId;
  origin: GridraPoint;
  pointerId: number;
  startPlacement: GridraNodePlacement;
}

// ここがコンポーネントの根幹
export function GridraCanvasArea<
  TNode extends GridraCanvasNode = GridraCanvasNode,
>({
  children,
  className,
  defaultSelectedId = null,
  defaultSelectedIds = [],
  defaultNodePlacements = {},
  enableNodeDragging = false,
  enableRangeSelection = true,
  gridColumns,
  gridRows,
  nodePlacements,
  nodes = [],
  onNodeMove,
  onNodePlacementsChange,
  onSelectionChange,
  onSelectionIdsChange,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  renderNode,
  selectedId,
  selectedIds,
  style,
  ...props
}: GridraCanvasAreaProps<TNode>) {
  // 選択しているnodeを持っている
  const [currentSelectedId, setSelectedId] = useControllableValue(
    selectedId,
    defaultSelectedId,
    onSelectionChange,
  );
  const [currentSelectedIds, setSelectedIds] = useControllableValue(
    selectedIds,
    defaultSelectedIds,
    onSelectionIdsChange,
  );
  const [currentNodePlacements, setNodePlacements] = useControllableValue(
    nodePlacements,
    defaultNodePlacements,
    onNodePlacementsChange,
  );
  const dragOriginRef = useRef<GridraPoint | null>(null);
  const dragPointerIdRef = useRef<number | null>(null);
  const nodeDragStateRef = useRef<NodeDragState | null>(null);
  const [selectionRect, setSelectionRect] = useState<GridraRect | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<GridraId | null>(null);
  const normalizedGridColumns =
    gridColumns === undefined ? undefined : normalizeGridCount(gridColumns);
  const normalizedGridRows =
    gridRows === undefined ? undefined : normalizeGridCount(gridRows);
  const normalizedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        placement: normalizeGridPlacement(
          currentNodePlacements[node.id] ?? node.placement,
          normalizedGridColumns,
          normalizedGridRows,
        ),
      })),
    [currentNodePlacements, nodes, normalizedGridColumns, normalizedGridRows],
  );
  // クラス名と結合して、スタイルを定義
  const canvasClassName = ["gridra-canvas-area", className]
    .filter(Boolean)
    .join(" ");
  // グリッドの列数と行数をCSS変数としてスタイルに追加
  const canvasStyle = {
    ...style,
    ...(normalizedGridColumns
      ? { "--gridra-grid-columns": normalizedGridColumns.toString() } // base.cssの129行目でこの変数を使用している
      : null),
    ...(normalizedGridRows
      ? { "--gridra-grid-rows": normalizedGridRows.toString() } // base.cssの130行目でこの変数を使用している
      : null),
  } as CSSProperties;

  const selectSingleNode = (nextId: GridraId, selected: boolean) => {
    const nextSelectedId = selected ? null : nextId;

    setSelectedId(nextSelectedId);
    setSelectedIds(nextSelectedId ? [nextSelectedId] : []);
  };

  const startNodeDrag = (
    event: PointerEvent<HTMLSpanElement>,
    node: TNode,
    selected: boolean,
  ) => {
    if (
      !enableNodeDragging ||
      (event.button !== undefined && event.button !== 0)
    ) {
      return;
    }

    const canvas = event.currentTarget.closest(".gridra-canvas-area");

    if (!(canvas instanceof HTMLDivElement)) {
      return;
    }

    nodeDragStateRef.current = {
      id: node.id,
      origin: getCanvasPoint(event, canvas),
      pointerId: event.pointerId,
      startPlacement: node.placement,
    };
    setDraggingNodeId(node.id);
    if (!selected) {
      setSelectedId(node.id);
      setSelectedIds([node.id]);
    }
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  };

  const updateNodeDrag = (event: PointerEvent<HTMLDivElement>): boolean => {
    const dragState = nodeDragStateRef.current;

    if (dragState === null || dragState.pointerId !== event.pointerId) {
      return false;
    }

    const gridColumnsForDrag = normalizedGridColumns ?? 12;
    const gridRowsForDrag = normalizedGridRows ?? 6;
    const metrics = getGridMetrics(event.currentTarget, gridColumnsForDrag, gridRowsForDrag);
    const currentPoint = getCanvasPoint(event, event.currentTarget);
    const nextPlacement = normalizeGridPlacement(
      {
        ...dragState.startPlacement,
        column:
          dragState.startPlacement.column +
          Math.round((currentPoint.x - dragState.origin.x) / metrics.columnStep),
        row:
          dragState.startPlacement.row +
          Math.round((currentPoint.y - dragState.origin.y) / metrics.rowStep),
      },
      gridColumnsForDrag,
      gridRowsForDrag,
    );
    const previousPlacement =
      currentNodePlacements[dragState.id] ?? dragState.startPlacement;

    if (!placementsEqual(previousPlacement, nextPlacement)) {
      setNodePlacements({
        ...currentNodePlacements,
        [dragState.id]: nextPlacement,
      });
      onNodeMove?.(dragState.id, nextPlacement, previousPlacement);
    }

    event.preventDefault();
    return true;
  };

  const finishNodeDrag = (event: PointerEvent<HTMLDivElement>): boolean => {
    const dragState = nodeDragStateRef.current;

    if (dragState === null || dragState.pointerId !== event.pointerId) {
      return false;
    }

    updateNodeDrag(event);
    nodeDragStateRef.current = null;
    setDraggingNodeId(null);
    event.preventDefault();

    return true;
  };

  const cancelNodeDrag = (event: PointerEvent<HTMLDivElement>): boolean => {
    const dragState = nodeDragStateRef.current;

    if (dragState === null || dragState.pointerId !== event.pointerId) {
      return false;
    }

    nodeDragStateRef.current = null;
    setDraggingNodeId(null);

    return true;
  };

  const startRangeSelection = (event: PointerEvent<HTMLDivElement>) => {
    if (!enableRangeSelection || (event.button !== undefined && event.button !== 0)) {
      return;
    }

    if (event.target !== event.currentTarget) {
      return;
    }

    const origin = getCanvasPoint(event, event.currentTarget);

    dragOriginRef.current = origin;
    dragPointerIdRef.current = event.pointerId;
    setSelectionRect(createRect(origin, origin));
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  };

  const updateRangeSelection = (event: PointerEvent<HTMLDivElement>) => {
    if (
      dragOriginRef.current === null ||
      dragPointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    setSelectionRect(
      createRect(dragOriginRef.current, getCanvasPoint(event, event.currentTarget)),
    );
  };

  const finishRangeSelection = (event: PointerEvent<HTMLDivElement>) => {
    if (
      dragOriginRef.current === null ||
      dragPointerIdRef.current !== event.pointerId
    ) {
      return;
    }

    const rect = createRect(
      dragOriginRef.current,
      getCanvasPoint(event, event.currentTarget),
    );
    const nextSelectedIds = hitTestNodes(
      normalizedNodes,
      rect,
      event.currentTarget,
      normalizedGridColumns ?? 12,
      normalizedGridRows ?? 6,
    );

    dragOriginRef.current = null;
    dragPointerIdRef.current = null;
    setSelectionRect(null);
    setSelectedIds(nextSelectedIds);
    setSelectedId(nextSelectedIds[0] ?? null);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  const cancelRangeSelection = (event: PointerEvent<HTMLDivElement>) => {
    if (dragPointerIdRef.current !== event.pointerId) {
      return;
    }

    dragOriginRef.current = null;
    dragPointerIdRef.current = null;
    setSelectionRect(null);
  };

  return (
    <div
      className={canvasClassName}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        if (!event.defaultPrevented && !cancelNodeDrag(event)) {
          cancelRangeSelection(event);
        }
      }}
      onPointerDown={(event) => {
        onPointerDown?.(event);
        if (!event.defaultPrevented) {
          startRangeSelection(event);
        }
      }}
      onPointerMove={(event) => {
        onPointerMove?.(event);
        if (!event.defaultPrevented && !updateNodeDrag(event)) {
          updateRangeSelection(event);
        }
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (!event.defaultPrevented && !finishNodeDrag(event)) {
          finishRangeSelection(event);
        }
      }}
      style={canvasStyle}
      {...props}
    >
      {normalizedNodes.map((node) => {
        const selected =
          node.id === currentSelectedId || currentSelectedIds.includes(node.id);
        const renderableNode = node;
        const dragging = draggingNodeId === node.id;
        const dragHandleProps = {
          onPointerDown: (event: PointerEvent<HTMLSpanElement>) =>
            startNodeDrag(event, renderableNode, selected),
        };
        const dragHandle = enableNodeDragging ? (
          <GridraDragHandle
            {...dragHandleProps}
            position="top-right"
          />
        ) : null;

        // renderNodeが渡されている場合はそれを使ってノードを描画し、そうでない場合はデフォルトのGridraNodeコンポーネントを使用する
        if (renderNode) {
          return renderNode(renderableNode, {
            selected,
            dragging,
            dragHandleProps,
            dragHandle,
          });
        }

        // デフォルトの描画方法
        return (
          <GridraNode
            id={node.id}
            key={node.id}
            dragHandle={selected ? dragHandle : null}
            onSelect={(nextId) => selectSingleNode(nextId, selected)}
            placement={node.placement}
            selected={selected}
          >
            {node.label ?? node.id}
          </GridraNode>
        );
      })}
      <GridraSelectionBox rect={selectionRect ?? undefined} />
      {children}
    </div>
  );
}

// グリッドの列数と行数を正規化する関数。無限大やNaNなどの非有限な値を1に変換し、1未満の値を切り捨てて1にする。
function normalizeGridCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

function normalizeGridPlacement(
  placement: GridraNodePlacement,
  maxColumns?: number,
  maxRows?: number,
): GridraNodePlacement {
  const column = normalizeGridLine(placement.column, maxColumns);
  const row = normalizeGridLine(placement.row, maxRows);

  return {
    column,
    row,
    columnSpan: normalizeGridSpan(placement.columnSpan, maxColumns, column),
    rowSpan: normalizeGridSpan(placement.rowSpan, maxRows, row),
  };
}

function normalizeGridLine(value: number, max?: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  const line = Math.max(1, Math.floor(value));

  return max === undefined ? line : Math.min(line, max);
}

function normalizeGridSpan(value = 1, max?: number, start = 1): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  const span = Math.max(1, Math.floor(value));

  if (max === undefined) {
    return span;
  }

  return Math.min(span, Math.max(1, max - start + 1));
}

function getCanvasPoint(
  event: PointerEvent<Element>,
  canvas: HTMLDivElement,
): GridraPoint {
  const bounds = canvas.getBoundingClientRect();

  return {
    x: event.clientX - bounds.left + canvas.scrollLeft,
    y: event.clientY - bounds.top + canvas.scrollTop,
  };
}

function createRect(origin: GridraPoint, current: GridraPoint): GridraRect {
  const x = Math.min(origin.x, current.x);
  const y = Math.min(origin.y, current.y);

  return {
    x,
    y,
    width: Math.abs(current.x - origin.x),
    height: Math.abs(current.y - origin.y),
  };
}

function hitTestNodes<TNode extends GridraCanvasNode>(
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

function getNodeRect(
  placement: GridraNodePlacement,
  canvas: HTMLDivElement,
  gridColumns: number,
  gridRows: number,
): GridraRect {
  const metrics = getGridMetrics(canvas, gridColumns, gridRows);
  const column = normalizeGridLine(placement.column, gridColumns);
  const row = normalizeGridLine(placement.row, gridRows);
  const columnSpan = normalizeGridSpan(placement.columnSpan, gridColumns, column);
  const rowSpan = normalizeGridSpan(placement.rowSpan, gridRows, row);

  return {
    x: metrics.paddingLeft + (column - 1) * metrics.columnStep,
    y: metrics.paddingTop + (row - 1) * metrics.rowStep,
    width: metrics.cellWidth * columnSpan + metrics.columnGap * Math.max(0, columnSpan - 1),
    height: metrics.cellHeight * rowSpan + metrics.rowGap * Math.max(0, rowSpan - 1),
  };
}

function getGridMetrics(
  canvas: HTMLDivElement,
  gridColumns: number,
  gridRows: number,
) {
  const styles = getComputedStyle(canvas);
  const paddingLeft = parseCssPx(styles.paddingLeft);
  const paddingTop = parseCssPx(styles.paddingTop);
  const paddingRight = parseCssPx(styles.paddingRight);
  const paddingBottom = parseCssPx(styles.paddingBottom);
  const columnGap = parseCssPx(styles.columnGap || styles.gap);
  const rowGap = parseCssPx(styles.rowGap || styles.gap);
  const bounds = canvas.getBoundingClientRect();
  const canvasWidth = canvas.clientWidth || bounds.width;
  const canvasHeight = canvas.clientHeight || bounds.height;
  const contentWidth = Math.max(0, canvasWidth - paddingLeft - paddingRight);
  const contentHeight = Math.max(0, canvasHeight - paddingTop - paddingBottom);
  const cellWidth =
    (contentWidth - columnGap * Math.max(0, gridColumns - 1)) / gridColumns;
  const cellHeight =
    (contentHeight - rowGap * Math.max(0, gridRows - 1)) / gridRows;

  return {
    cellHeight,
    cellWidth,
    columnGap,
    columnStep: Math.max(1, cellWidth + columnGap),
    paddingLeft,
    paddingTop,
    rowGap,
    rowStep: Math.max(1, cellHeight + rowGap),
  };
}

function parseCssPx(value: string): number {
  const parsed = Number.parseFloat(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function rectsIntersect(first: GridraRect, second: GridraRect): boolean {
  return (
    first.x <= second.x + second.width &&
    first.x + first.width >= second.x &&
    first.y <= second.y + second.height &&
    first.y + first.height >= second.y
  );
}

function placementsEqual(
  first: GridraNodePlacement,
  second: GridraNodePlacement,
): boolean {
  return (
    first.column === second.column &&
    first.row === second.row &&
    normalizeGridSpan(first.columnSpan) === normalizeGridSpan(second.columnSpan) &&
    normalizeGridSpan(first.rowSpan) === normalizeGridSpan(second.rowSpan)
  );
}
