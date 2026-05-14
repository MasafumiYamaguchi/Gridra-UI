// 実際にグリッド上に描画される土台のコンポーネント

import type {
  CSSProperties,
  KeyboardEvent,
  PointerEvent,
} from "react";
import { useMemo, useRef, useState } from "react";
import type { GridraId, GridraPoint, GridraRect } from "@gridra-ui/core";
import { GridraConnectionHandle } from "../GridraConnectionHandle";
import { GridraDragHandle } from "../GridraDragHandle";
import { GridraNode } from "../GridraNode";
import { GridraResizeHandle } from "../GridraResizeHandle";
import { GridraSelectionBox } from "../GridraSelectionBox";
import { GridraSnapGuide } from "../GridraSnapGuide";
import { useControllableValue } from "../../hooks/useControllableValue";
import { GridraConnectionLayer } from "./GridraConnectionLayer";
import { getConnectionKey, hasConnection } from "./connectionUtils";
import {
  createRect,
  formatCssLength,
  getCanvasPoint,
  getGridMetrics,
  getNodeRect,
  normalizeGridCount,
  normalizeGridPlacement,
  normalizeGridSpan,
  placementsEqual,
} from "./geometry";
import { hitTestConnections, hitTestNodes } from "./hitTesting";
import type {
  GridraCanvasAreaProps,
  GridraCanvasNode,
  GridraNodeConnection,
  NodeConnectionState,
  NodeDragState,
  NodeResizeState,
  NodeSnapGuide,
  GridraSelectionMode,
} from "./types";

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
  selectionMode = "replace",
  selectionModifierKeys,
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
  const [snapGuides, setSnapGuides] = useState<NodeSnapGuide[]>([]);
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
  const canvasClassName = [
    "gridra-canvas-area",
    snapGuides.length > 0 ? "gridra-canvas-area--snap-guides-visible" : null,
    className,
  ]
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
        onNodeConnect?.(nextConnection);
      }
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
    setSnapGuides(createNodeDragSnapGuides(nextPlacement, event.currentTarget, gridColumnsForDrag, gridRowsForDrag));

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
    setSnapGuides([]);
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
    setSnapGuides([]);

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
    setSnapGuides(createNodeResizeSnapGuides(nextPlacement, event.currentTarget, gridColumnsForResize, gridRowsForResize));

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
    setSnapGuides([]);
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
    setSnapGuides([]);

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
    const hitSelectedIds = hitTestNodes(
      normalizedNodes,
      rect,
      event.currentTarget,
      normalizedGridColumns ?? 12,
      normalizedGridRows ?? 6,
    );
    const nextSelectedIds = mergeSelectedIds(
      getSelectionMode(event, selectionMode, selectionModifierKeys),
      currentSelectedIds.length > 0
        ? currentSelectedIds
        : currentSelectedId
          ? [currentSelectedId]
          : [],
      hitSelectedIds,
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
      {snapGuides.map((guide) => (
        <GridraSnapGuide
          end={guide.end}
          key={`${guide.orientation}-${guide.position}-${guide.start ?? 0}-${guide.end ?? "full"}`}
          orientation={guide.orientation}
          position={guide.position}
          start={guide.start}
        />
      ))}
      {children}
    </div>
  );
}

function createNodeDragSnapGuides(
  placement: GridraCanvasNode["placement"],
  canvas: HTMLDivElement,
  gridColumns: number,
  gridRows: number,
): NodeSnapGuide[] {
  const metrics = getGridMetrics(canvas, gridColumns, gridRows);
  const rect = getNodeRect(placement, canvas, gridColumns, gridRows);
  const verticalStart = metrics.paddingTop;
  const horizontalStart = metrics.paddingLeft;

  return [
    {
      orientation: "vertical",
      position: rect.x,
      start: verticalStart,
      end: verticalStart + metrics.rowStep * gridRows,
    },
    {
      orientation: "horizontal",
      position: rect.y,
      start: horizontalStart,
      end: horizontalStart + metrics.columnStep * gridColumns,
    },
  ];
}

function getSelectionMode(
  event: PointerEvent<HTMLDivElement>,
  fallbackMode: GridraSelectionMode,
  modifierKeys?: { additive?: "Shift"; toggle?: "Meta" | "Control" },
): GridraSelectionMode {
  if (modifierKeys?.additive === "Shift" && event.shiftKey) {
    return "additive";
  }

  if (modifierKeys?.toggle === "Meta" && event.metaKey) {
    return "toggle";
  }

  if (modifierKeys?.toggle === "Control" && event.ctrlKey) {
    return "toggle";
  }

  return fallbackMode;
}

function mergeSelectedIds(
  mode: GridraSelectionMode,
  currentSelectedIds: GridraId[],
  hitSelectedIds: GridraId[],
): GridraId[] {
  if (mode === "replace") {
    return hitSelectedIds;
  }

  const currentSet = new Set(currentSelectedIds);

  if (mode === "additive") {
    return Array.from(new Set([...currentSelectedIds, ...hitSelectedIds]));
  }

  hitSelectedIds.forEach((id) => {
    if (currentSet.has(id)) {
      currentSet.delete(id);
    } else {
      currentSet.add(id);
    }
  });

  return currentSelectedIds
    .filter((id) => currentSet.has(id))
    .concat(hitSelectedIds.filter((id) => currentSet.has(id) && !currentSelectedIds.includes(id)));
}

function createNodeResizeSnapGuides(
  placement: GridraCanvasNode["placement"],
  canvas: HTMLDivElement,
  gridColumns: number,
  gridRows: number,
): NodeSnapGuide[] {
  const metrics = getGridMetrics(canvas, gridColumns, gridRows);
  const rect = getNodeRect(placement, canvas, gridColumns, gridRows);
  const verticalStart = metrics.paddingTop;
  const horizontalStart = metrics.paddingLeft;

  return [
    {
      orientation: "vertical",
      position: rect.x + rect.width,
      start: verticalStart,
      end: verticalStart + metrics.rowStep * gridRows,
    },
    {
      orientation: "horizontal",
      position: rect.y + rect.height,
      start: horizontalStart,
      end: horizontalStart + metrics.columnStep * gridColumns,
    },
  ];
}
