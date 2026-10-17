import { forwardRef, type ButtonHTMLAttributes } from "react";
import { useControllableValue } from "@gridra-ui/headless";
import { cx } from "../../internal/classNames";

export interface GridraSidebarToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "aria-expanded"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
}

// Sidebar内蔵ボタンと、別の場所に置く開閉ボタンで同じ状態・表示を使う。
export const GridraSidebarToggle = forwardRef<HTMLButtonElement, GridraSidebarToggleProps>(
  function GridraSidebarToggle({ className, defaultOpen = false, disabled, onClick, onOpenChange, open, type = "button", ...props }, ref) {
    const [currentOpen, setCurrentOpen] = useControllableValue(open, defaultOpen, onOpenChange);
    return <button
      aria-label={currentOpen ? "Close sidebar" : "Open sidebar"}
      {...props}
      ref={ref}
      type={type}
      disabled={disabled}
      aria-expanded={currentOpen}
      className={cx("gridra-sidebar-toggle", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!disabled && !event.defaultPrevented) setCurrentOpen(!currentOpen);
      }}
    >
      <span aria-hidden="true" className="gridra-sidebar__toggle-line" />
      <span aria-hidden="true" className="gridra-sidebar__toggle-line" />
      <span aria-hidden="true" className="gridra-sidebar__toggle-line" />
    </button>;
  },
);
