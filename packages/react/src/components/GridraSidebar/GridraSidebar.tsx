import { useGridraSidebar } from "@gridra-ui/headless";
import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useControllableValue } from "@gridra-ui/headless";
import {
  clampNumber,
  formatCssLength,
  formatCssLengthWithMin,
  resolveCssLengthToPx,
} from "@gridra-ui/core";

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

const DEFAULT_OPEN_WIDTH = 280;

const DEFAULT_MIN_WIDTH = 180;

const DEFAULT_MAX_WIDTH = 480;

const DEFAULT_TOGGLE_SIZE = 20;

const KEYBOARD_STEP = 8;

export function GridraSidebar({
  children,
  className,
  collapsedWidth = 0,
  defaultOpen = true,
  maxWidth = DEFAULT_MAX_WIDTH,
  minWidth = DEFAULT_MIN_WIDTH,
  onKeyDown,
  onOpenChange,
  open,
  resizable = false,
  side = "left",
  style,
  toggleSize = DEFAULT_TOGGLE_SIZE,
  width = DEFAULT_OPEN_WIDTH,
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
