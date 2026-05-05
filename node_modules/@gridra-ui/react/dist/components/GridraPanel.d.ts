import type { HTMLAttributes, ReactNode } from "react";
export interface GridraPanelProps extends HTMLAttributes<HTMLElement> {
    heading?: ReactNode;
    position?: "left" | "right";
    header?: ReactNode;
}
export declare function GridraPanel({ children, className, heading, header, position, ...props }: GridraPanelProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GridraPanel.d.ts.map