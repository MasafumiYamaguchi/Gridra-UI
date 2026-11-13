import {
  DEFAULT_SIDEBAR_MAX_WIDTH,
  DEFAULT_SIDEBAR_MIN_WIDTH,
  DEFAULT_SIDEBAR_OPEN_WIDTH,
  useGridraSidebar,
} from "@gridra-ui/headless";
import type { CSSProperties, HTMLAttributes } from "react";
import { useMemo } from "react";
import { formatCssLength, formatCssLengthWithMin } from "@gridra-ui/core";

import { GridraSidebarToggle } from "./GridraSidebarToggle";

export type GridraSidebarSide = "left" | "right";

export interface GridraSidebarProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "onChange"
> {
  side?: GridraSidebarSide;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  width?: number | string;
  collapsedWidth?: number | string;
  resizable?: boolean;
  minWidth?: number;
  maxWidth?: number;
  toggleSize?: number | string;
}

const DEFAULT_TOGGLE_SIZE = 20;

export function GridraSidebar({
  children,
  className,
  collapsedWidth = 0,
  defaultOpen = true,
  maxWidth = DEFAULT_SIDEBAR_MAX_WIDTH,
  minWidth = DEFAULT_SIDEBAR_MIN_WIDTH,
  onKeyDown,
  onOpenChange,
  open,
  resizable = false,
  side = "left",
  style,
  toggleSize = DEFAULT_TOGGLE_SIZE,
  width = DEFAULT_SIDEBAR_OPEN_WIDTH,
  ...props
}: GridraSidebarProps) {
  const {
    contentId,
    currentOpen,
    setCurrentOpen,
    openWidth,
    getSeparatorProps,
  } = useGridraSidebar({
    side,
    open,
    defaultOpen,
    onOpenChange,
    width,
    resizable,
    minWidth,
    maxWidth,
    onKeyDown,
  });
  const collapsedLength = formatCssLength(collapsedWidth);
  const baseOpenLength = formatCssLength(width);
  // 手動リサイズ時だけpx値を使い、通常時は利用側のCSS長を保つ。
  const activeOpenWidth = resizable ? `${openWidth}px` : baseOpenLength;
  const sidebarWidth = currentOpen ? activeOpenWidth : collapsedLength;

  const sidebarClassName = [
    "gridra-sidebar",
    `gridra-sidebar--${side}`,
    currentOpen ? "gridra-sidebar--open" : "gridra-sidebar--closed",
    resizable ? "gridra-sidebar--resizable" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const sidebarStyle = useMemo(
    () =>
      ({
        ...style,
        "--gridra-sidebar-width": sidebarWidth,
        "--gridra-sidebar-toggle-size": formatCssLengthWithMin(
          toggleSize,
          DEFAULT_TOGGLE_SIZE,
        ),
      }) as CSSProperties,
    [sidebarWidth, style, toggleSize],
  );

  return (
    <aside
      aria-expanded={currentOpen}
      className={sidebarClassName}
      style={sidebarStyle}
      {...props}
    >
      <GridraSidebarToggle
        aria-controls={contentId}
        className="gridra-sidebar__toggle"
        open={currentOpen}
        onOpenChange={setCurrentOpen}
      />
      <div id={contentId} className="gridra-sidebar__content">
        {children}
      </div>
      {resizable ? (
        <div
          {...getSeparatorProps()}

          className="gridra-sidebar__separator"
        />
      ) : null}
    </aside>
  );
}
