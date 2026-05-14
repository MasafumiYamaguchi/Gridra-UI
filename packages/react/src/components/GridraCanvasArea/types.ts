import type { HTMLAttributes, ReactNode } from "react";
import type { GridraId, GridraPoint } from "@gridra-ui/core";
import type { GridraNodePlacement } from "../GridraNode";
import type { GridraConnectionHandleKind } from "../GridraConnectionHandle";
import type { GridraSnapGuideOrientation } from "../GridraSnapGuide";

export interface GridraCanvasNode {
  id: GridraId;
  placement: GridraNodePlacement;
  label?: ReactNode;
}

export type GridraNodePlacements = Record<string, GridraNodePlacement>;

export interface GridraConnectionHandleAttributes
  extends HTMLAttributes<HTMLSpanElement> {
  "data-gridra-connection-kind": GridraConnectionHandleKind;
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

export interface GridraCanvasAreaProps<
  TNode extends GridraCanvasNode = GridraCanvasNode,
> extends HTMLAttributes<HTMLDivElement> {
  gridColumns?: number;
  gridRows?: number;
  nodes?: TNode[];
  connectionLineWidth?: number | string;
  nodeConnections?: GridraNodeConnection[];
  defaultNodeConnections?: GridraNodeConnection[];
  nodePlacements?: GridraNodePlacements;
  defaultNodePlacements?: GridraNodePlacements;
  selectedId?: GridraId | null;
  defaultSelectedId?: GridraId | null;
  selectedIds?: GridraId[];
  defaultSelectedIds?: GridraId[];
  selectionMode?: GridraSelectionMode;
  selectionModifierKeys?: GridraSelectionModifierKeys;
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
  ) => void;
  onSelectionIdsChange?: (
    selectedIds: GridraId[],
    previousSelectedIds: GridraId[],
  ) => void;
  renderNode?: (node: TNode, state: GridraCanvasRenderNodeState) => ReactNode;
}

export type GridraSelectionMode = "replace" | "additive" | "toggle";

export interface GridraSelectionModifierKeys {
  additive?: "Shift";
  toggle?: "Meta" | "Control";
}

export interface GridraNodeConnection {
  sourceId: GridraId;
  targetId: GridraId;
}

export interface GridraConnectionSegment {
  connection: GridraNodeConnection;
  path: string;
}

export interface NodeDragState {
  id: GridraId;
  origin: GridraPoint;
  pointerId: number;
  startPlacement: GridraNodePlacement;
}

export interface NodeResizeState {
  id: GridraId;
  origin: GridraPoint;
  pointerId: number;
  startPlacement: GridraNodePlacement;
}

export interface NodeConnectionState {
  originKind: GridraConnectionHandleKind;
  pointerId: number;
  sourceId: GridraId;
}

export interface NodeSnapGuide {
  end?: number;
  orientation: GridraSnapGuideOrientation;
  position: number;
  start?: number;
}
