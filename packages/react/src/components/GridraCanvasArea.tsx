// 実際にグリッド上に描画される土台のコンポーネント

import type { CSSProperties, HTMLAttributes, PointerEvent, ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import type { GridraId, GridraPoint, GridraRect } from "@gridra-ui/core";
import { GridraNode, type GridraNodePlacement } from "./GridraNode";
import { GridraSelectionBox } from "./GridraSelectionBox";
import { useControllableValue } from "./useControllableValue";

// キャンバス上に配置されるノード（要素）のインタフェース
export interface GridraCanvasNode {
  id: GridraId;
  placement: GridraNodePlacement;
  label?: ReactNode;
}

// Canvasに渡すpropsをまとめたインタフェース
export interface GridraCanvasAreaProps<
  TNode extends GridraCanvasNode = GridraCanvasNode,
> extends HTMLAttributes<HTMLDivElement> {
  gridColumns?: number;
  gridRows?: number;
  nodes?: TNode[]; // Canvas上に配置されるノードのリスト
  selectedId?: GridraId | null; // 選択されているノードのID（外部から制御する場合）
  defaultSelectedId?: GridraId | null; // 選択されているノードのIDの初期値（内部で制御する場合）
  selectedIds?: GridraId[];
  defaultSelectedIds?: GridraId[];
  enableRangeSelection?: boolean;
  onSelectionChange?: (
    selectedId: GridraId | null,
    previousSelectedId: GridraId | null,
  ) => void; // ノードの選択が変更されたときに呼び出されるコールバック関数
  onSelectionIdsChange?: (
    selectedIds: GridraId[],
    previousSelectedIds: GridraId[],
  ) => void;
  renderNode?: (node: TNode, state: { selected: boolean }) => ReactNode; // ノードの描画をカスタマイズするための関数
}

// ここがコンポーネントの根幹
export function GridraCanvasArea<
  TNode extends GridraCanvasNode = GridraCanvasNode,
>({
  children,
  className,
  defaultSelectedId = null,
  defaultSelectedIds = [],
  enableRangeSelection = true,
  gridColumns,
  gridRows,
  nodes = [],
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
  const dragOriginRef = useRef<GridraPoint | null>(null);
  const dragPointerIdRef = useRef<number | null>(null);
  const [selectionRect, setSelectionRect] = useState<GridraRect | null>(null);
  const normalizedGridColumns =
    gridColumns === undefined ? undefined : normalizeGridCount(gridColumns);
  const normalizedGridRows =
    gridRows === undefined ? undefined : normalizeGridCount(gridRows);
  const normalizedNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        placement: normalizeGridPlacement(
          node.placement,
          normalizedGridColumns,
          normalizedGridRows,
        ),
      })),
    [nodes, normalizedGridColumns, normalizedGridRows],
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
        if (!event.defaultPrevented) {
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
        if (!event.defaultPrevented) {
          updateRangeSelection(event);
        }
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (!event.defaultPrevented) {
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

        // renderNodeが渡されている場合はそれを使ってノードを描画し、そうでない場合はデフォルトのGridraNodeコンポーネントを使用する
        if (renderNode) {
          return renderNode(renderableNode, { selected });
        }

        // デフォルトの描画方法
        return (
          <GridraNode
            id={node.id}
            key={node.id}
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
  event: PointerEvent<HTMLDivElement>,
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
  const column = normalizeGridLine(placement.column, gridColumns);
  const row = normalizeGridLine(placement.row, gridRows);
  const columnSpan = normalizeGridSpan(placement.columnSpan, gridColumns, column);
  const rowSpan = normalizeGridSpan(placement.rowSpan, gridRows, row);

  return {
    x: paddingLeft + (column - 1) * (cellWidth + columnGap),
    y: paddingTop + (row - 1) * (cellHeight + rowGap),
    width: cellWidth * columnSpan + columnGap * Math.max(0, columnSpan - 1),
    height: cellHeight * rowSpan + rowGap * Math.max(0, rowSpan - 1),
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
