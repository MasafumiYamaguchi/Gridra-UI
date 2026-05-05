import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { GridraId } from "@gridra-ui/core";
export interface GridraNodePlacement {
    column: number;
    row: number;
    columnSpan?: number;
    rowSpan?: number;
}
export interface GridraNodeProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "id" | "onSelect"> {
    id: GridraId;
    placement: GridraNodePlacement;
    selected?: boolean;
    children?: ReactNode;
    onSelect?: (id: GridraId) => void;
}
export declare function GridraNode({ children, className, id, onClick, onSelect, placement, selected, style, type, ...props }: GridraNodeProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GridraNode.d.ts.map