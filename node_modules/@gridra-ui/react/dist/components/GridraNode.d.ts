import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { GridraId, GridraPoint } from "@gridra-ui/core";
export interface GridraNodeProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "id" | "onSelect"> {
    id: GridraId;
    position: GridraPoint;
    selected?: boolean;
    children?: ReactNode;
    onSelect?: (id: GridraId) => void;
}
export declare function GridraNode({ children, className, id, onClick, onSelect, position, selected, type, ...props }: GridraNodeProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GridraNode.d.ts.map