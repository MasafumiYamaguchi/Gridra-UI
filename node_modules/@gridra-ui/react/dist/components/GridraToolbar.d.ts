import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
export interface GridraToolbarAction {
    id: string;
    label: ReactNode;
    pressed?: boolean;
    disabled?: boolean;
}
export interface GridraToolbarProps extends HTMLAttributes<HTMLDivElement> {
    actions?: GridraToolbarAction[];
    onAction?: (id: string) => void;
    renderAction?: (action: GridraToolbarAction) => ReactNode;
}
export declare function GridraToolbar({ actions, children, className, onAction, renderAction, ...props }: GridraToolbarProps): import("react/jsx-runtime").JSX.Element;
export declare function GridraToolbarButton({ className, type, ...props }: ButtonHTMLAttributes<HTMLButtonElement>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GridraToolbar.d.ts.map