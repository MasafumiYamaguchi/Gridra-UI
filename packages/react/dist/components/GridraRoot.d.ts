import type { HTMLAttributes, ReactNode } from "react";
export interface GridraRootProps extends HTMLAttributes<HTMLDivElement> {
    panel?: ReactNode;
    panelPosition?: "left" | "right";
}
export declare function GridraRoot({ children, className, panel, panelPosition, ...props }: GridraRootProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=GridraRoot.d.ts.map