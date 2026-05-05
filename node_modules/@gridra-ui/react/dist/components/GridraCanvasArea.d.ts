import type { HTMLAttributes, ReactNode } from "react";
import type { GridraId, GridraPoint } from "@gridra-ui/core";
export interface GridraCanvasNode {
    id: GridraId;
    position: GridraPoint;
    label?: ReactNode;
}
export interface GridraCanvasAreaProps<TNode extends GridraCanvasNode = GridraCanvasNode> extends HTMLAttributes<HTMLDivElement> {
    nodes?: TNode[];
    selectedId?: GridraId | null;
    defaultSelectedId?: GridraId | null;
    onSelectionChange?: (selectedId: GridraId | null, previousSelectedId: GridraId | null) => void;
    renderNode?: (node: TNode, state: {
        selected: boolean;
    }) => ReactNode;
}
export declare function GridraCanvasArea<TNode extends GridraCanvasNode = GridraCanvasNode>({ children, className, defaultSelectedId, nodes, onSelectionChange, renderNode, selectedId, ...props }: GridraCanvasAreaProps<TNode>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GridraCanvasArea.d.ts.map