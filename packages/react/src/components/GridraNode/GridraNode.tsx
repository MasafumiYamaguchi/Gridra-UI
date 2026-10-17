import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../internal/classNames";

export type { GridraNodePlacement } from "@gridra-ui/headless";

/** 見た目を担当するbutton。配置と操作は通常のDOM propsとして受け取る。 */
export interface GridraNodeProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  connectionHandles?: ReactNode;
  dragHandle?: ReactNode;
  resizeHandle?: ReactNode;
}

export const GridraNode = forwardRef<HTMLButtonElement, GridraNodeProps>(
  function GridraNode({ children, className, connectionHandles, dragHandle, resizeHandle,
    type = "button", ...props }, ref) {
    return (
      <button {...props} ref={ref} type={type} className={cx("gridra-node", className)}>
        {dragHandle}
        <div className="gridra-node__label">{children}</div>
        {connectionHandles}
        {resizeHandle}
      </button>
    );
  },
);
