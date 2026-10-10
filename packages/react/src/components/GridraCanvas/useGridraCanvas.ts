import {
  useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState,
  type ButtonHTMLAttributes, type HTMLAttributes, type PointerEvent, type Ref,
} from "react";
import type { GridraId, GridraPoint } from "@gridra-ui/core";
import type { GridraNodePlacement } from "../GridraNode";
import type { GridraConnectionHandleKind } from "../GridraConnectionHandle";
import { composeHandlers } from "../../internal/composeHandlers";
import { mergeRefs } from "../../internal/mergeRefs";
import {
  createRect, getCanvasPoint, getGridMetrics, getNodeRect,
  normalizeGridCount, normalizeGridPlacement, placementsEqual,
} from "./geometry";
import { computeDragPlacement, computeResizePlacement } from "./interactionUtils";
import { hitTestConnections, hitTestNodes } from "./hitTesting";
import { createNodeConnection, getConnectionKey, hasConnection } from "./connectionUtils";
import { getSelectionMode, mergeSelectedIds } from "./selectionUtils";
import { createNodeDragSnapGuides, createNodeResizeSnapGuides } from "./snapGuideUtils";
import type {
  GridraCanvasNode, GridraCanvasState, GridraCanvasOverlayProps,
  GridraConnectionHandleAttributes, UseGridraCanvasOptions,
} from "./types";

type DOMProps<T extends HTMLElement> = HTMLAttributes<T> & { ref?: Ref<T> };
type NodeProps = ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> };
type Operation = {
  type: "drag" | "resize" | "connect" | "range";
  pointerId: number;
  origin: GridraPoint;
  id?: GridraId;
  placement?: GridraNodePlacement;
  kind?: GridraConnectionHandleKind;
  point: GridraPoint;
};
const useClientLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;

/** 利用側が用意した均等なCSS Gridへ操作を取り付ける。確定状態は利用側が管理する。 */
export function useGridraCanvas<TNode extends GridraCanvasNode = GridraCanvasNode>(
  options: UseGridraCanvasOptions<TNode>,
) {
  const { state, interactions = {} } = options;
  const columns = normalizeGridCount(options.grid?.columns ?? 12);
  const rows = normalizeGridCount(options.grid?.rows ?? 6);
  const owner = useId();
  const latest = useRef(options);
  latest.current = options;
  const containerRef = useRef<HTMLElement | null>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const operationRef = useRef<Operation | null>(null);
  const [operation, setOperation] = useState<Operation | null>(null);
  const [geometry, setGeometry] = useState({ width: 0, height: 0, signature: "" });
  const nodes = useMemo(() => state.nodes.map((node) => ({
    ...node, placement: normalizeGridPlacement(node.placement, columns, rows),
  })), [state.nodes, columns, rows]);

  const emit = (patch: Partial<GridraCanvasState<TNode>>) => {
    const previous = latest.current.state;
    const next = { ...previous, ...patch };
    const unchanged = Object.entries(patch).every(([key, value]) => {
      if (key === "nodes") return value === previous.nodes;
      if (key === "selectedIds") {
        const ids = value as GridraId[];
        return ids.length === previous.selectedIds.length && ids.every((id, index) => id === previous.selectedIds[index]);
      }
      const connections = value as GridraCanvasState<TNode>["connections"];
      const old = previous[key as "connections" | "selectedConnections"];
      return connections.length === old.length && connections.every((connection, index) =>
        connection.sourceId === old[index].sourceId && connection.targetId === old[index].targetId);
    });
    if (unchanged) return;
    latest.current.onStateChange(next, previous);
  };
  const updateOperation = (next: Operation | null) => {
    operationRef.current = next;
    setOperation(next);
  };
  const releaseCapture = useCallback((op: Operation | null, element = containerRef.current) => {
    if (!op || !element) return;
    try {
      if (element.hasPointerCapture?.(op.pointerId)) element.releasePointerCapture(op.pointerId);
    } catch { /* ポインターや要素の破棄により、ブラウザがすでにcaptureを解放した場合。 */ }
  }, []);
  const clearOperation = () => {
    const previous = operationRef.current;
    // capture解放でlostpointercaptureが同期発火しても再度キャンセルしないよう、先に操作を消す。
    updateOperation(null);
    releaseCapture(previous);
  };
  const attachContainer = useCallback((element: HTMLElement | null) => {
    containerRef.current = element;
    setContainer(element);
  }, []);
  const refreshGeometry = useCallback(() => {
    const element = containerRef.current;
    if (!element) return;
    const metrics = getGridMetrics(element, columns, rows);
    const bounds = element.getBoundingClientRect();
    const width = element.clientWidth || bounds.width;
    const height = element.clientHeight || bounds.height;
    const signature = JSON.stringify([width, height, metrics]);
    setGeometry((previous) => previous.signature === signature ? previous : { width, height, signature });
  }, [columns, rows]);
  useClientLayoutEffect(refreshGeometry);
  useClientLayoutEffect(() => {
    setOperation(null);
    if (!container) return;
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(refreshGeometry);
    observer?.observe(container);
    window.addEventListener("resize", refreshGeometry);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", refreshGeometry);
      const op = operationRef.current;
      operationRef.current = null;
      releaseCapture(op, container);
    };
  }, [container, refreshGeometry, releaseCapture]);
  useEffect(() => {
    const op = operationRef.current;
    if (op && (!container || (op.id !== undefined && !state.nodes.some((node) => node.id === op.id)))) {
      clearOperation();
    }
  }, [container, state.nodes]);

  const findNode = (id: GridraId) => nodes.find((node) => node.id === id);
  const start = (event: PointerEvent<HTMLElement>, type: Operation["type"], id?: GridraId,
    kind?: GridraConnectionHandleKind) => {
    const element = containerRef.current;
    if (!element || operationRef.current || event.currentTarget.closest("button:disabled") || !element.contains(event.currentTarget) ||
      (event.button !== undefined && event.button !== 0)) return;
    const node = id !== undefined ? findNode(id) : undefined;
    if (id !== undefined && !node) return;
    const enabled = type === "range" ? interactions.rangeSelection !== false :
      type === "drag" ? interactions.dragging : type === "resize" ? interactions.resizing : interactions.connecting;
    if (!enabled) return;
    const origin = getCanvasPoint(event, element);
    updateOperation({ type, id, kind, origin, point: origin, pointerId: event.pointerId, placement: node?.placement });
    if (id !== undefined) emit({ selectedIds: state.selectedIds.includes(id) && type !== "connect" ? state.selectedIds : [id], selectedConnections: [] });
    else emit({ selectedConnections: [] });
    element.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  };
  const updatePlacement = (event: PointerEvent<HTMLElement>, op: Operation) => {
    const element = containerRef.current;
    if (!element || op.id === undefined || !op.placement) return;
    const source = latest.current.state.nodes.find((node) => node.id === op.id);
    if (!source) { clearOperation(); return; }
    const input = { canvas: element, event, gridColumns: columns, gridRows: rows,
      origin: op.origin, startPlacement: op.placement };
    const placement = op.type === "drag" ? computeDragPlacement(input) : computeResizePlacement(input);
    if (!placementsEqual(source.placement, placement)) emit({
      nodes: latest.current.state.nodes.map((node) => node.id === op.id ? { ...node, placement } : node),
    });
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    const op = operationRef.current;
    const element = containerRef.current;
    if (!op || !element || op.pointerId !== event.pointerId) return;
    if (op.type === "drag" || op.type === "resize") updatePlacement(event, op);
    if (operationRef.current !== op) return;
    updateOperation({ ...op, point: getCanvasPoint(event, element) });
    event.preventDefault();
  };
  const finish = (event: PointerEvent<HTMLElement>) => {
    const op = operationRef.current;
    const element = containerRef.current;
    if (!op || !element || op.pointerId !== event.pointerId) return;
    if (op.type === "drag" || op.type === "resize") updatePlacement(event, op);
    if (op.type === "range") {
      const rect = createRect(op.origin, getCanvasPoint(event, element));
      emit({
        selectedIds: mergeSelectedIds(getSelectionMode(event, interactions.selectionMode ?? "replace",
          interactions.selectionModifierKeys), latest.current.state.selectedIds,
          hitTestNodes(nodes, rect, element, columns, rows)),
        selectedConnections: hitTestConnections(latest.current.state.connections, nodes, rect, element, columns, rows),
      });
      element.focus();
    }
    if (op.type === "connect") {
      // pointer capture中のpointerupはコンテナへ届くため、実際のドロップ位置を調べる。
      const target = document.elementFromPoint?.(event.clientX, event.clientY) ??
        (event.target instanceof Element ? event.target : null);
      const handle = target?.closest<HTMLElement>("[data-gridra-connection-node-id]");
      const targetId = handle?.dataset.gridraConnectionNodeId;
      const kind = handle?.dataset.gridraConnectionKind;
      const connection = handle && element.contains(handle) && handle.dataset.gridraCanvasOwner === owner &&
        targetId !== undefined && findNode(targetId) && (kind === "input" || kind === "output") && op.id !== undefined && op.kind ?
        createNodeConnection(op.id, op.kind, targetId, kind) : null;
      if (connection && !hasConnection(latest.current.state.connections, connection)) {
        emit({ connections: [...latest.current.state.connections, connection] });
      }
    }
    clearOperation();
    event.preventDefault();
  };
  const cancel = (event: PointerEvent<HTMLElement>) => {
    if (operationRef.current?.pointerId === event.pointerId) clearOperation();
  };

  const getContainerProps = (props: DOMProps<HTMLElement> = {}) => ({
    ...props,
    ref: props.ref ? mergeRefs<HTMLElement>(props.ref, attachContainer) : attachContainer,
    tabIndex: props.tabIndex ?? -1,
    style: {
      ...props.style, position: "relative" as const, display: "grid",
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    },
    onPointerDown: composeHandlers(props.onPointerDown, (event: PointerEvent<HTMLElement>) => {
      if (event.target === event.currentTarget) start(event, "range");
    }),
    onPointerMove: composeHandlers(props.onPointerMove, move),
    onPointerUp: composeHandlers(props.onPointerUp, finish),
    onPointerCancel: composeHandlers(props.onPointerCancel, cancel),
    onLostPointerCapture: composeHandlers(props.onLostPointerCapture, cancel),
    onKeyDown: composeHandlers(props.onKeyDown, (event) => {
      // 入力欄でのDeleteやBackspaceを接続削除として扱わない。
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest("input,textarea,select"))) return;
      if (event.key === "Delete" || event.key === "Backspace") {
        const current = latest.current.state;
        const keys = new Set(current.selectedConnections.map(getConnectionKey));
        if (keys.size) {
          emit({ connections: current.connections.filter((connection) => !keys.has(getConnectionKey(connection))),
            selectedConnections: [] });
          event.preventDefault();
        }
      }
    }),
  });
  const getNodeProps = (id: GridraId, props: NodeProps = {}) => {
    const node = findNode(id);
    return {
      ...props, type: props.type ?? "button" as const,
      "data-gridra-node-id": id,
      "aria-pressed": state.selectedIds.includes(id),
      style: { ...props.style, ...(node ? {
        gridColumn: `${node.placement.column} / span ${node.placement.columnSpan}`,
        gridRow: `${node.placement.row} / span ${node.placement.rowSpan}`,
      } : {}) },
      onClick: composeHandlers(props.onClick, () => {
        if (!node || props.disabled) return;
        emit({ selectedIds: state.selectedIds.includes(id) ? [] : [id], selectedConnections: [] });
      }),
    };
  };
  const getDragHandleProps = (id: GridraId, props: DOMProps<HTMLElement> = {}) => ({
    ...props, style: { ...props.style, touchAction: "none" as const },
    onPointerDown: composeHandlers(props.onPointerDown, (event: PointerEvent<HTMLElement>) => start(event, "drag", id)),
    onClick: composeHandlers(props.onClick, (event) => event.stopPropagation()),
  });
  const getResizeHandleProps = (id: GridraId, props: DOMProps<HTMLElement> = {}) => ({
    ...props, style: { ...props.style, touchAction: "none" as const },
    onPointerDown: composeHandlers(props.onPointerDown, (event: PointerEvent<HTMLElement>) => start(event, "resize", id)),
    onClick: composeHandlers(props.onClick, (event) => event.stopPropagation()),
  });
  const getConnectionHandleProps = (id: GridraId, kind: GridraConnectionHandleKind,
    props: DOMProps<HTMLElement> = {}) => ({
    ...props, "data-gridra-connection-node-id": id, "data-gridra-connection-kind": kind,
    "data-gridra-canvas-owner": owner,
    style: { ...props.style, touchAction: "none" as const },
    onPointerDown: composeHandlers(props.onPointerDown, (event: PointerEvent<HTMLElement>) => start(event, "connect", id, kind)),
    onClick: composeHandlers(props.onClick, (event) => event.stopPropagation()),
  } satisfies GridraConnectionHandleAttributes & { ref?: Ref<HTMLElement>; "data-gridra-canvas-owner": string });

  const connectionPoint = (id: GridraId, kind: GridraConnectionHandleKind): GridraPoint | null => {
    const node = findNode(id);
    if (!node || !container) return null;
    const rect = getNodeRect(node.placement, container, columns, rows);
    return { x: kind === "output" ? rect.x + rect.width : rect.x, y: rect.y + rect.height / 2 };
  };
  const path = (source: GridraPoint, target: GridraPoint) => {
    const bend = Math.max(16, Math.abs(target.x - source.x) / 2);
    return `M ${source.x} ${source.y} C ${source.x + bend} ${source.y} ${target.x - bend} ${target.y} ${target.x} ${target.y}`;
  };
  const selectedKeys = new Set(state.selectedConnections.map(getConnectionKey));
  const segments = state.connections.flatMap((connection) => {
    const source = connectionPoint(connection.sourceId, "output");
    const target = connectionPoint(connection.targetId, "input");
    return source && target ? [{ connection, path: path(source, target), selected: selectedKeys.has(getConnectionKey(connection)) }] : [];
  });
  const origin = operation?.type === "connect" && operation.id !== undefined && operation.kind ? connectionPoint(operation.id, operation.kind) : null;
  const previewPath = origin && operation ? (operation.kind === "output" ? path(origin, operation.point) : path(operation.point, origin)) : undefined;
  const movingNode = operation?.id !== undefined ? findNode(operation.id) : undefined;
  const snapGuides = container && movingNode && operation && (operation.type === "drag" || operation.type === "resize") ?
    (operation.type === "drag" ? createNodeDragSnapGuides : createNodeResizeSnapGuides)(movingNode.placement, container, columns, rows) : [];
  const overlayProps: GridraCanvasOverlayProps = {
    width: geometry.width, height: geometry.height, segments, previewPath,
    selectionRect: operation?.type === "range" ? createRect(operation.origin, operation.point) : undefined,
    snapGuides,
    onConnectionSelect: (connection) => {
      emit({ selectedConnections: [connection] });
      containerRef.current?.focus();
    },
  };
  return { nodes, selectedId: state.selectedIds[0] ?? null,
    getContainerProps, getNodeProps, getDragHandleProps, getResizeHandleProps,
    getConnectionHandleProps, overlayProps };
}
