// 実際にグリッド上に描画される土台のコンポーネント

import type {
  CSSProperties,
  HTMLAttributes,
  KeyboardEvent,
  PointerEvent,
  ReactNode,
} from "react";
import { useMemo, useRef, useState } from "react";
import type { GridraId, GridraPoint, GridraRect } from "@gridra-ui/core";
import { GridraConnectionHandle } from "./GridraConnectionHandle";
import { GridraDragHandle } from "./GridraDragHandle";
import { GridraNode, type GridraNodePlacement } from "./GridraNode";
import { GridraResizeHandle } from "./GridraResizeHandle";
import { GridraSelectionBox } from "./GridraSelectionBox";
import { useControllableValue } from "./useControllableValue";

// キャンバス上に配置されるノード（要素）のインタフェース
export interface GridraCanvasNode {
  id: GridraId;
  placement: GridraNodePlacement;
  label?: ReactNode;
}

export type GridraNodePlacements = Record<string, GridraNodePlacement>;

export interface GridraConnectionHandleAttributes
  extends HTMLAttributes<HTMLSpanElement> {
  "data-gridra-connection-node-id": GridraId;
}

export interface GridraCanvasRenderNodeState {
  selected: boolean;
  dragging: boolean;
  resizing: boolean;
  connecting: boolean;
  connectionHandleProps: {
    input: GridraConnectionHandleAttributes;
    output: GridraConnectionHandleAttributes;
  };
  connectionHandles: ReactNode;
  dragHandleProps: HTMLAttributes<HTMLSpanElement>;
  dragHandle: ReactNode;
  resizeHandleProps: HTMLAttributes<HTMLSpanElement>;
  resizeHandle: ReactNode;
}

// Canvasに渡すpropsをまとめたインタフェース
export interface GridraCanvasAreaProps<
  TNode extends GridraCanvasNode = GridraCanvasNode,
> extends HTMLAttributes<HTMLDivElement> {
  gridColumns?: number;
  gridRows?: number;
  nodes?: TNode[]; // Canvas上に配置されるノードのリスト
  connectionLineWidth?: number | string;
  nodeConnections?: GridraNodeConnection[];
  defaultNodeConnections?: GridraNodeConnection[];
  nodePlacements?: GridraNodePlacements;
  defaultNodePlacements?: GridraNodePlacements;
  selectedId?: GridraId | null; // 選択されているノードのID（外部から制御する場合）
  defaultSelectedId?: GridraId | null; // 選択されているノードのIDの初期値（内部で制御する場合）
  selectedIds?: GridraId[];
  defaultSelectedIds?: GridraId[];
  enableNodeConnecting?: boolean;
  enableNodeDragging?: boolean;
  enableNodeResizing?: boolean;
  enableRangeSelection?: boolean;
  onNodeMove?: (
    id: GridraId,
    placement: GridraNodePlacement,
    previousPlacement: GridraNodePlacement,
  ) => void;
  onNodeConnect?: (connection: GridraNodeConnection) => void;
  onNodeConnectionCancel?: (sourceId: GridraId) => void;
  onNodeConnectionDelete?: (connection: GridraNodeConnection) => void;
  onNodeConnectionsChange?: (
    nodeConnections: GridraNodeConnection[],
    previousNodeConnections: GridraNodeConnection[],
  ) => void;
  onNodeConnectionStart?: (sourceId: GridraId) => void;
  onNodeResize?: (
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

export interface GridraNodeConnection {
  sourceId: GridraId;
  targetId: GridraId;
}

interface GridraConnectionSegment {
  connection: GridraNodeConnection;
  path: string;
}

interface NodeDragState {
  id: GridraId;
  origin: GridraPoint;
  pointerId: number;
  startPlacement: GridraNodePlacement;
}

interface NodeResizeState {
  id: GridraId;
  origin: GridraPoint;
  pointerId: number;
  startPlacement: GridraNodePlacement;
}

interface NodeConnectionState {
  pointerId: number;
  sourceId: GridraId;
}

// ここがコンポーネントの根幹
export function GridraCanvasArea<
  TNode extends GridraCanvasNode = GridraCanvasNode,
>({
  children,
  className,
  connectionLineWidth,
  defaultNodeConnections = [],
  defaultSelectedId = null,
  defaultSelectedIds = [],
  defaultNodePlacements = {},
  enableNodeConnecting = false,
  enableNodeDragging = false,
  enableNodeResizing = false,
  enableRangeSelection = true,
  gridColumns,
  gridRows,
  nodeConnections,
  nodePlacements,
  nodes = [],
  onNodeConnect,
  onNodeConnectionCancel,
  onNodeConnectionDelete,
  onNodeConnectionsChange,
  onNodeConnectionStart,
  onNodeMove,
  onNodeResize,
  onNodePlacementsChange,
  onSelectionChange,
  onSelectionIdsChange,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onKeyDown,
  renderNode,
  selectedId,
  selectedIds,
  style,
  tabIndex,
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
  const [currentNodeConnections, setNodeConnections] = useControllableValue(
    nodeConnections,
    defaultNodeConnections,
    onNodeConnectionsChange,
  );
  const [currentNodePlacements, setNodePlacements] = useControllableValue(
    nodePlacements,
    defaultNodePlacements,
    onNodePlacementsChange,
  );
  const dragOriginRef = useRef<GridraPoint | null>(null);
  const dragPointerIdRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const nodeConnectionStateRef = useRef<NodeConnectionState | null>(null);
  const nodeDragStateRef = useRef<NodeDragState | null>(null);
  const nodeResizeStateRef = useRef<NodeResizeState | null>(null);
  const [selectionRect, setSelectionRect] = useState<GridraRect | null>(null);
  const [connectingNodeId, setConnectingNodeId] = useState<GridraId | null>(null);
  const [draggingNodeId, setDraggingNodeId] = useState<GridraId | null>(null);
  const [resizingNodeId, setResizingNodeId] = useState<GridraId | null>(null);
  const [selectedConnectionKeys, setSelectedConnectionKeys] = useState<string[]>([]);
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
    ...(connectionLineWidth === undefined
      ? null
      : { "--gridra-connection-line-width": formatCssLength(connectionLineWidth) }),
  } as CSSProperties;

  const selectSingleNode = (nextId: GridraId, selected: boolean) => {
    const nextSelectedId = selected ? null : nextId;

    setSelectedConnectionKeys([]);
    setSelectedId(nextSelectedId);
    setSelectedIds(nextSelectedId ? [nextSelectedId] : []);
  };

  const startNodeConnection = (
    event: PointerEvent<HTMLSpanElement>,
    node: TNode,
  ) => {
    if (
      !enableNodeConnecting ||
      (event.button !== undefined && event.button !== 0)
    ) {
      return;
    }

    nodeConnectionStateRef.current = {
      pointerId: event.pointerId,
      sourceId: node.id,
    };
    setSelectedConnectionKeys([]);
    setConnectingNodeId(node.id);
    setSelectedId(node.id);
    setSelectedIds([node.id]);
    onNodeConnectionStart?.(node.id);
    event.preventDefault();
    event.stopPropagation();
  };

  const finishNodeConnection = (event: PointerEvent<HTMLDivElement>): boolean => {
    const connectionState = nodeConnectionStateRef.current;

    if (
      connectionState === null ||
      connectionState.pointerId !== event.pointerId
    ) {
      return false;
    }

    const handle =
      event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-gridra-connection-node-id]")
        : null;
    const targetId = handle?.dataset.gridraConnectionNodeId;

    if (targetId && targetId !== connectionState.sourceId) {
      const nextConnection = {
        sourceId: connectionState.sourceId,
        targetId,
      };

      if (!hasConnection(currentNodeConnections, nextConnection)) {
        setNodeConnections([...currentNodeConnections, nextConnection]);
      }
      onNodeConnect?.(nextConnection);
    } else {
      onNodeConnectionCancel?.(connectionState.sourceId);
    }

    nodeConnectionStateRef.current = null;
    setConnectingNodeId(null);
    event.preventDefault();

    return true;
  };

  const selectNodeConnection = (connection: GridraNodeConnection) => {
    setSelectedConnectionKeys([getConnectionKey(connection)]);
    canvasRef.current?.focus();
  };

  const deleteSelectedNodeConnection = () => {
    if (selectedConnectionKeys.length === 0) {
      return false;
    }

    const selectedKeys = new Set(selectedConnectionKeys);
    const deletedConnections = currentNodeConnections.filter((connection) =>
      selectedKeys.has(getConnectionKey(connection)),
    );

    if (deletedConnections.length === 0) {
      setSelectedConnectionKeys([]);
      return false;
    }

    setNodeConnections(
      currentNodeConnections.filter((connection) => !selectedKeys.has(getConnectionKey(connection))),
    );
    setSelectedConnectionKeys([]);
    deletedConnections.forEach((connection) => onNodeConnectionDelete?.(connection));

    return true;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "Delete" || event.key === "Backspace") {
      if (deleteSelectedNodeConnection()) {
        event.preventDefault();
      }
    }
  };

  const cancelNodeConnection = (event: PointerEvent<HTMLDivElement>): boolean => {
    const connectionState = nodeConnectionStateRef.current;

    if (
      connectionState === null ||
      connectionState.pointerId !== event.pointerId
    ) {
      return false;
    }

    onNodeConnectionCancel?.(connectionState.sourceId);
    nodeConnectionStateRef.current = null;
    setConnectingNodeId(null);

    return true;
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
    setSelectedConnectionKeys([]);
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

  const startNodeResize = (
    event: PointerEvent<HTMLSpanElement>,
    node: TNode,
    selected: boolean,
  ) => {
    if (
      !enableNodeResizing ||
      (event.button !== undefined && event.button !== 0)
    ) {
      return;
    }

    const canvas = event.currentTarget.closest(".gridra-canvas-area");

    if (!(canvas instanceof HTMLDivElement)) {
      return;
    }

    nodeResizeStateRef.current = {
      id: node.id,
      origin: getCanvasPoint(event, canvas),
      pointerId: event.pointerId,
      startPlacement: node.placement,
    };
    setSelectedConnectionKeys([]);
    setResizingNodeId(node.id);
    if (!selected) {
      setSelectedId(node.id);
      setSelectedIds([node.id]);
    }
    event.currentTarget.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  };

  const updateNodeResize = (event: PointerEvent<HTMLDivElement>): boolean => {
    const resizeState = nodeResizeStateRef.current;

    if (resizeState === null || resizeState.pointerId !== event.pointerId) {
      return false;
    }

    const gridColumnsForResize = normalizedGridColumns ?? 12;
    const gridRowsForResize = normalizedGridRows ?? 6;
    const metrics = getGridMetrics(event.currentTarget, gridColumnsForResize, gridRowsForResize);
    const currentPoint = getCanvasPoint(event, event.currentTarget);
    const nextPlacement = normalizeGridPlacement(
      {
        ...resizeState.startPlacement,
        columnSpan:
          normalizeGridSpan(resizeState.startPlacement.columnSpan) +
          Math.round((currentPoint.x - resizeState.origin.x) / metrics.columnStep),
        rowSpan:
          normalizeGridSpan(resizeState.startPlacement.rowSpan) +
          Math.round((currentPoint.y - resizeState.origin.y) / metrics.rowStep),
      },
      gridColumnsForResize,
      gridRowsForResize,
    );
    const previousPlacement =
      currentNodePlacements[resizeState.id] ?? resizeState.startPlacement;

    if (!placementsEqual(previousPlacement, nextPlacement)) {
      setNodePlacements({
        ...currentNodePlacements,
        [resizeState.id]: nextPlacement,
      });
      onNodeResize?.(resizeState.id, nextPlacement, previousPlacement);
    }

    event.preventDefault();
    return true;
  };

  const finishNodeResize = (event: PointerEvent<HTMLDivElement>): boolean => {
    const resizeState = nodeResizeStateRef.current;

    if (resizeState === null || resizeState.pointerId !== event.pointerId) {
      return false;
    }

    updateNodeResize(event);
    nodeResizeStateRef.current = null;
    setResizingNodeId(null);
    event.preventDefault();

    return true;
  };

  const cancelNodeResize = (event: PointerEvent<HTMLDivElement>): boolean => {
    const resizeState = nodeResizeStateRef.current;

    if (resizeState === null || resizeState.pointerId !== event.pointerId) {
      return false;
    }

    nodeResizeStateRef.current = null;
    setResizingNodeId(null);

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

    setSelectedConnectionKeys([]);
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
    const nextSelectedConnectionKeys = hitTestConnections(
      currentNodeConnections,
      normalizedNodes,
      rect,
      event.currentTarget,
      normalizedGridColumns ?? 12,
      normalizedGridRows ?? 6,
    ).map(getConnectionKey);

    dragOriginRef.current = null;
    dragPointerIdRef.current = null;
    setSelectionRect(null);
    setSelectedIds(nextSelectedIds);
    setSelectedId(nextSelectedIds[0] ?? null);
    setSelectedConnectionKeys(nextSelectedConnectionKeys);
    if (nextSelectedConnectionKeys.length > 0) {
      canvasRef.current?.focus();
    }
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
      onKeyDown={handleKeyDown}
      onPointerCancel={(event) => {
        onPointerCancel?.(event);
        if (
          !event.defaultPrevented &&
          !cancelNodeConnection(event) &&
          !cancelNodeResize(event) &&
          !cancelNodeDrag(event)
        ) {
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
        if (
          !event.defaultPrevented &&
          !updateNodeResize(event) &&
          !updateNodeDrag(event)
        ) {
          updateRangeSelection(event);
        }
      }}
      onPointerUp={(event) => {
        onPointerUp?.(event);
        if (
          !event.defaultPrevented &&
          !finishNodeConnection(event) &&
          !finishNodeResize(event) &&
          !finishNodeDrag(event)
        ) {
          finishRangeSelection(event);
        }
      }}
      ref={canvasRef}
      style={canvasStyle}
      tabIndex={tabIndex ?? -1}
      {...props}
    >
      <GridraConnectionLayer
        connections={currentNodeConnections}
        gridColumns={normalizedGridColumns ?? 12}
        gridRows={normalizedGridRows ?? 6}
        nodes={normalizedNodes}
        onConnectionSelect={selectNodeConnection}
        selectedConnectionKeys={selectedConnectionKeys}
      />
      {normalizedNodes.map((node) => {
        const selected =
          node.id === currentSelectedId || currentSelectedIds.includes(node.id);
        const renderableNode = node;
        const connecting = connectingNodeId === node.id;
        const dragging = draggingNodeId === node.id;
        const resizing = resizingNodeId === node.id;
        const connectionHandleProps = {
          input: {
            "data-gridra-connection-node-id": node.id,
          },
          output: {
            "data-gridra-connection-node-id": node.id,
            onPointerDown: (event: PointerEvent<HTMLSpanElement>) =>
              startNodeConnection(event, renderableNode),
          },
        };
        const connectionHandles = enableNodeConnecting ? (
          <>
            <GridraConnectionHandle
              {...connectionHandleProps.input}
              active={connectingNodeId !== null && !connecting}
              kind="input"
              position="left"
            />
            <GridraConnectionHandle
              {...connectionHandleProps.output}
              active={connecting}
              kind="output"
              position="right"
            />
          </>
        ) : null;
        const dragHandleProps = {
          onPointerDown: (event: PointerEvent<HTMLSpanElement>) =>
            startNodeDrag(event, renderableNode, selected),
        };
        const resizeHandleProps = {
          onPointerDown: (event: PointerEvent<HTMLSpanElement>) =>
            startNodeResize(event, renderableNode, selected),
        };
        const dragHandle = enableNodeDragging ? (
          <GridraDragHandle
            {...dragHandleProps}
            position="top-right"
          />
        ) : null;
        const resizeHandle = enableNodeResizing ? (
          <GridraResizeHandle
            {...resizeHandleProps}
            position="bottom-right"
          />
        ) : null;

        // renderNodeが渡されている場合はそれを使ってノードを描画し、そうでない場合はデフォルトのGridraNodeコンポーネントを使用する
        if (renderNode) {
          return renderNode(renderableNode, {
            selected,
            connecting,
            dragging,
            resizing,
            connectionHandleProps,
            connectionHandles,
            dragHandleProps,
            dragHandle,
            resizeHandleProps,
            resizeHandle,
          });
        }

        // デフォルトの描画方法
        return (
          <GridraNode
            id={node.id}
            key={node.id}
            connectionHandles={connectionHandles}
            dragHandle={selected ? dragHandle : null}
            onSelect={(nextId) => selectSingleNode(nextId, selected)}
            placement={node.placement}
            resizeHandle={selected ? resizeHandle : null}
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

function GridraConnectionLayer<TNode extends GridraCanvasNode>({
  connections,
  gridColumns,
  gridRows,
  nodes,
  onConnectionSelect,
  selectedConnectionKeys,
}: {
  connections: GridraNodeConnection[];
  gridColumns: number;
  gridRows: number;
  nodes: TNode[];
  onConnectionSelect: (connection: GridraNodeConnection) => void;
  selectedConnectionKeys: string[];
}) {
  const segments = getConnectionSegments(connections, nodes, gridColumns, gridRows);
  const selectedKeySet = new Set(selectedConnectionKeys);

  if (segments.length === 0) {
    return null;
  }

  return (
    <svg
      aria-hidden="true"
      className="gridra-connection-layer"
      preserveAspectRatio="none"
      viewBox={`0 0 ${gridColumns} ${gridRows}`}
    >
      {segments.map((segment, index) => (
        <path
          className={[
            "gridra-connection-line",
            selectedKeySet.has(getConnectionKey(segment.connection))
              ? "gridra-connection-line--selected"
              : null,
          ]
            .filter(Boolean)
            .join(" ")}
          d={segment.path}
          data-gridra-connection-source-id={segment.connection.sourceId}
          data-gridra-connection-target-id={segment.connection.targetId}
          key={`${segment.connection.sourceId}:${segment.connection.targetId}:${index}`}
          onClick={(event) => {
            event.stopPropagation();
            onConnectionSelect(segment.connection);
          }}
        />
      ))}
    </svg>
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

function getConnectionSegments<TNode extends GridraCanvasNode>(
  connections: GridraNodeConnection[],
  nodes: TNode[],
  gridColumns: number,
  gridRows: number,
): GridraConnectionSegment[] {
  return connections.flatMap((connection) => {
    const source = nodes.find((node) => node.id === connection.sourceId);
    const target = nodes.find((node) => node.id === connection.targetId);

    if (!source || !target) {
      return [];
    }

    return [
      {
        connection,
        path: getConnectionPath(
          source.placement,
          target.placement,
          gridColumns,
          gridRows,
        ),
      },
    ];
  });
}

function getConnectionPath(
  source: GridraNodePlacement,
  target: GridraNodePlacement,
  gridColumns: number,
  gridRows: number,
): string {
  const sourcePoint = getConnectionPoint(source, "output", gridColumns, gridRows);
  const targetPoint = getConnectionPoint(target, "input", gridColumns, gridRows);
  const controlDistance = Math.max(0.5, Math.abs(targetPoint.x - sourcePoint.x) * 0.5);
  const sourceControlX = Math.min(gridColumns, sourcePoint.x + controlDistance);
  const targetControlX = Math.max(0, targetPoint.x - controlDistance);

  return [
    `M ${sourcePoint.x} ${sourcePoint.y}`,
    `C ${sourceControlX} ${sourcePoint.y}`,
    `${targetControlX} ${targetPoint.y}`,
    `${targetPoint.x} ${targetPoint.y}`,
  ].join(" ");
}

function getConnectionPoint(
  placement: GridraNodePlacement,
  side: "input" | "output",
  gridColumns: number,
  gridRows: number,
): GridraPoint {
  const column = normalizeGridLine(placement.column, gridColumns);
  const row = normalizeGridLine(placement.row, gridRows);
  const columnSpan = normalizeGridSpan(placement.columnSpan, gridColumns, column);
  const rowSpan = normalizeGridSpan(placement.rowSpan, gridRows, row);
  const x = side === "output" ? column - 1 + columnSpan : column - 1;
  const y = row - 1 + rowSpan / 2;

  return {
    x: clampNumber(x, 0, gridColumns),
    y: clampNumber(y, 0, gridRows),
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

function hitTestConnections<TNode extends GridraCanvasNode>(
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

function getConnectionRect(
  sourcePlacement: GridraNodePlacement,
  targetPlacement: GridraNodePlacement,
  canvas: HTMLDivElement,
  gridColumns: number,
  gridRows: number,
): GridraRect {
  const sourceRect = getNodeRect(sourcePlacement, canvas, gridColumns, gridRows);
  const targetRect = getNodeRect(targetPlacement, canvas, gridColumns, gridRows);
  const sourcePoint = {
    x: sourceRect.x + sourceRect.width,
    y: sourceRect.y + sourceRect.height / 2,
  };
  const targetPoint = {
    x: targetRect.x,
    y: targetRect.y + targetRect.height / 2,
  };
  const x = Math.min(sourcePoint.x, targetPoint.x);
  const y = Math.min(sourcePoint.y, targetPoint.y);

  return {
    x,
    y,
    width: Math.abs(targetPoint.x - sourcePoint.x),
    height: Math.abs(targetPoint.y - sourcePoint.y),
  };
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

function hasConnection(
  connections: GridraNodeConnection[],
  nextConnection: GridraNodeConnection,
): boolean {
  return connections.some(
    (connection) =>
      connection.sourceId === nextConnection.sourceId &&
      connection.targetId === nextConnection.targetId,
  );
}

function getConnectionKey(connection: GridraNodeConnection): string {
  return `${connection.sourceId}->${connection.targetId}`;
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

function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return Math.min(max, Math.max(min, value));
}

function formatCssLength(value: number | string): string {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return "0px";
    }

    return `${Math.max(0, value)}px`;
  }

  return value;
}
