import type { HTMLAttributes, ReactNode } from "react";
import type { GridraId, GridraRect } from "@gridra-ui/core";
import type { GridraNodePlacement } from "../GridraNode";
import type { GridraConnectionHandleKind } from "../GridraConnectionHandle";
import type { GridraSnapGuideOrientation } from "../GridraSnapGuide";

export interface GridraCanvasNode {
  id: GridraId;
  placement: GridraNodePlacement;
  label?: ReactNode;
}

export interface GridraNodeConnection {
  sourceId: GridraId;
  targetId: GridraId;
}

/** 保存する状態は利用側が管理し、ノード固有の追加フィールドも保持する。 */
export interface GridraCanvasState<TNode extends GridraCanvasNode = GridraCanvasNode> {
  nodes: TNode[];
  connections: GridraNodeConnection[];
  selectedIds: GridraId[];
  selectedConnections: GridraNodeConnection[];
}

export type GridraSelectionMode = "replace" | "additive" | "toggle";
export interface GridraSelectionModifierKeys {
  additive?: "Shift";
  toggle?: "Meta" | "Control";
}

export interface UseGridraCanvasOptions<TNode extends GridraCanvasNode = GridraCanvasNode> {
  state: GridraCanvasState<TNode>;
  onStateChange: (next: GridraCanvasState<TNode>, previous: GridraCanvasState<TNode>) => void;
  grid?: { columns?: number; rows?: number };
  interactions?: {
    dragging?: boolean;
    resizing?: boolean;
    connecting?: boolean;
    rangeSelection?: boolean;
    selectionMode?: GridraSelectionMode;
    selectionModifierKeys?: GridraSelectionModifierKeys;
  };
}

export interface GridraConnectionSegment {
  connection: GridraNodeConnection;
  path: string;
  selected?: boolean;
}
export interface GridraCanvasSnapGuide {
  end?: number;
  orientation: GridraSnapGuideOrientation;
  position: number;
  start?: number;
}
export type NodeSnapGuide = GridraCanvasSnapGuide;

/** paddingとgapを含むコンテナ内のピクセル座標で描画する。 */
export interface GridraCanvasOverlayProps extends HTMLAttributes<HTMLDivElement> {
  width: number;
  height: number;
  segments: GridraConnectionSegment[];
  previewPath?: string;
  selectionRect?: GridraRect;
  snapGuides: GridraCanvasSnapGuide[];
  onConnectionSelect?: (connection: GridraNodeConnection) => void;
}

export interface GridraConnectionHandleAttributes extends HTMLAttributes<HTMLElement> {
  "data-gridra-connection-kind": GridraConnectionHandleKind;
  "data-gridra-connection-node-id": GridraId;
}
