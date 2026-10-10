import {
  useCallback, useEffect, useId, useMemo, useRef, useState,
  type ButtonHTMLAttributes, type HTMLAttributes, type PointerEvent, type Ref,
} from "react";
import type { GridraId, GridraPoint } from "@gridra-ui/core";
import type { GridraConnectionHandleKind } from "../GridraConnectionHandle";
import { composeHandlers } from "../../internal/composeHandlers";
import { mergeRefs } from "../../internal/mergeRefs";
import {
  createRect, getCanvasPoint,
  normalizeGridCount, normalizeGridPlacement, placementsEqual,
} from "./geometry";
import { computeDragPlacement, computeResizePlacement } from "./interactionUtils";
import { hitTestConnections, hitTestNodes } from "./hitTesting";
import { createNodeConnection, getConnectionKey, hasConnection } from "./connectionUtils";
import { getSelectionMode, mergeSelectedIds } from "./selectionUtils";
import { useClientLayoutEffect } from "../../internal/useClientLayoutEffect";
import { useGridGeometry } from "./useGridGeometry";
import { computeOverlay } from "./overlayUtils";
import { canvasStatesEqual } from "./stateUtils";
import type { Operation, OperationRequest } from "./operation";
import type {
  GridraCanvasNode, GridraCanvasState, GridraCanvasOverlayProps,
  GridraConnectionHandleAttributes, UseGridraCanvasOptions,
} from "./types";

type DOMProps<T extends HTMLElement> = HTMLAttributes<T> & { ref?: Ref<T> };
type NodeProps = ButtonHTMLAttributes<HTMLButtonElement> & { ref?: Ref<HTMLButtonElement> };
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
  const metrics = useGridGeometry(container, columns, rows);
  const nodes = useMemo(() => state.nodes.map((node) => ({
    ...node, placement: normalizeGridPlacement(node.placement, columns, rows),
  })), [state.nodes, columns, rows]);

  const emit = (patch: Partial<GridraCanvasState<TNode>>) => {
    const previous = latest.current.state;
    const next = { ...previous, ...patch };
    if (canvasStatesEqual(previous, next)) return;
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
  useClientLayoutEffect(() => {
    setOperation(null);
    return () => {
      const op = operationRef.current;
      operationRef.current = null;
      releaseCapture(op, container);
    };
  }, [container, columns, rows, releaseCapture]);
  useEffect(() => {
    const op = operationRef.current;
    if (op && (!container || (op.type !== "range" && !state.nodes.some((node) => node.id === op.id)))) {
      clearOperation();
    }
  }, [container, state.nodes]);

  const findNode = (id: GridraId) => nodes.find((node) => node.id === id);
  const enabled: Record<Operation["type"], boolean> = {
    range: interactions.rangeSelection !== false,
    drag: interactions.dragging === true,
    resize: interactions.resizing === true,
    connect: interactions.connecting === true,
  };
  const start = (event: PointerEvent<HTMLElement>, request: OperationRequest) => {
    const element = containerRef.current;
    if (!element || !metrics || operationRef.current || !enabled[request.type] ||
      event.currentTarget.closest("button:disabled") || !element.contains(event.currentTarget) ||
      (event.button !== undefined && event.button !== 0)) return;
    const origin = getCanvasPoint(event, element);
    const pointer = { origin, point: origin, pointerId: event.pointerId };
    let next: Operation;
    if (request.type === "range") next = { ...pointer, ...request };
    else {
      const node = findNode(request.id);
      if (!node) return;
      next = request.type === "connect" ? { ...pointer, ...request } : { ...pointer, ...request, placement: node.placement };
    }
    updateOperation(next);
    emit({ selectedConnections: [], ...(next.type !== "range" ? {
      selectedIds: state.selectedIds.includes(next.id) && next.type !== "connect" ? state.selectedIds : [next.id],
    } : {}) });
    element.setPointerCapture?.(event.pointerId);
    event.preventDefault();
    event.stopPropagation();
  };
  const updatePlacement = (op: Extract<Operation, { type: "drag" | "resize" }>, currentPoint: GridraPoint) => {
    if (!metrics) return;
    const source = latest.current.state.nodes.find((node) => node.id === op.id);
    if (!source) { clearOperation(); return; }
    const input = { metrics, currentPoint, origin: op.origin, startPlacement: op.placement };
    const placement = op.type === "drag" ? computeDragPlacement(input) : computeResizePlacement(input);
    if (!placementsEqual(source.placement, placement)) emit({
      nodes: latest.current.state.nodes.map((node) => node.id === op.id ? { ...node, placement } : node),
    });
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    const op = operationRef.current;
    const element = containerRef.current;
    if (!op || !element || op.pointerId !== event.pointerId) return;
    const point = getCanvasPoint(event, element);
    if (op.type === "drag" || op.type === "resize") updatePlacement(op, point);
    if (operationRef.current !== op) return;
    updateOperation({ ...op, point });
    event.preventDefault();
  };
  const finish = (event: PointerEvent<HTMLElement>) => {
    const op = operationRef.current;
    const element = containerRef.current;
    if (!op || !element || op.pointerId !== event.pointerId) return;
    const point = getCanvasPoint(event, element);
    if (op.type === "drag" || op.type === "resize") updatePlacement(op, point);
    if (op.type === "range" && metrics) {
      const rect = createRect(op.origin, point);
      emit({
        selectedIds: mergeSelectedIds(getSelectionMode(event, interactions.selectionMode ?? "replace",
          interactions.selectionModifierKeys), latest.current.state.selectedIds,
          hitTestNodes(nodes, rect, metrics)),
        selectedConnections: hitTestConnections(latest.current.state.connections, nodes, rect, metrics),
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
        targetId !== undefined && findNode(targetId) && (kind === "input" || kind === "output") ?
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
      if (event.target === event.currentTarget) start(event, { type: "range" });
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
  const getHandleProps = (request: Exclude<OperationRequest, { type: "range" }>, props: DOMProps<HTMLElement>) => ({
    ...props, style: { ...props.style, touchAction: "none" as const },
    onPointerDown: composeHandlers(props.onPointerDown, (event: PointerEvent<HTMLElement>) => start(event, request)),
    onClick: composeHandlers(props.onClick, (event) => event.stopPropagation()),
  });
  const getDragHandleProps = (id: GridraId, props: DOMProps<HTMLElement> = {}) => getHandleProps({ type: "drag", id }, props);
  const getResizeHandleProps = (id: GridraId, props: DOMProps<HTMLElement> = {}) => getHandleProps({ type: "resize", id }, props);
  const getConnectionHandleProps = (id: GridraId, kind: GridraConnectionHandleKind, props: DOMProps<HTMLElement> = {}) => ({
    ...getHandleProps({ type: "connect", id, kind }, props),
    "data-gridra-connection-node-id": id, "data-gridra-connection-kind": kind, "data-gridra-canvas-owner": owner,
  } satisfies GridraConnectionHandleAttributes & { ref?: Ref<HTMLElement>; "data-gridra-canvas-owner": string });

  const overlayData = useMemo(() => computeOverlay({ ...state, nodes }, operation, metrics), [state, nodes, operation, metrics]);
  const overlayProps: GridraCanvasOverlayProps = {
    ...overlayData,
    onConnectionSelect: (connection) => {
      emit({ selectedConnections: [connection] });
      containerRef.current?.focus();
    },
  };
  return { nodes, selectedId: state.selectedIds[0] ?? null,
    getContainerProps, getNodeProps, getDragHandleProps, getResizeHandleProps,
    getConnectionHandleProps, overlayProps };
}
