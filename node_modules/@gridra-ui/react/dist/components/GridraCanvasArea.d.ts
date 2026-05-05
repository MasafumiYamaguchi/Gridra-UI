import type { HTMLAttributes, ReactNode } from "react";
import type { GridraId } from "@gridra-ui/core";
import { type GridraNodePlacement } from "./GridraNode";
export interface GridraCanvasNode {
    id: GridraId;
    placement: GridraNodePlacement;
    label?: ReactNode;
}
export interface GridraCanvasAreaProps<TNode extends GridraCanvasNode = GridraCanvasNode> extends HTMLAttributes<HTMLDivElement> {
    gridColumns?: number;
    gridRows?: number;
    nodes?: TNode[];
    selectedId?: GridraId | null;
    defaultSelectedId?: GridraId | null;
    onSelectionChange?: (selectedId: GridraId | null, previousSelectedId: GridraId | null) => void;
    renderNode?: (node: TNode, state: {
        selected: boolean;
    }) => ReactNode;
}
export declare function GridraCanvasArea<TNode extends GridraCanvasNode = GridraCanvasNode>({ children, className, defaultSelectedId, gridColumns, gridRows, nodes, onSelectionChange, renderNode, selectedId, style, ...props }: GridraCanvasAreaProps<TNode>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GridraCanvasArea.d.ts.map