import type { CSSProperties, HTMLAttributes } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useControllableValue } from "../../hooks/useControllableValue";

export type GridraSidebarSide = "left" | "right";

export interface GridraSidebarProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
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
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );
  const [resizedWidth, setResizedWidth] = useState(() =>
    resolveLengthToPx(width, DEFAULT_OPEN_WIDTH),
  );
  const dragStartXRef = useRef<number | null>(null);
  const dragStartWidthRef = useRef<number | null>(null);

  useEffect(() => {
    setResizedWidth(resolveLengthToPx(width, DEFAULT_OPEN_WIDTH));
  }, [width]);

  const collapsedLength = toCssLength(collapsedWidth);
  const baseOpenLength = toCssLength(width);
  const activeOpenWidth = resizable ? `${clampWidth(resizedWidth, minWidth, maxWidth)}px` : baseOpenLength;
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
        "--gridra-sidebar-toggle-size": toCssLengthWithMin(toggleSize, DEFAULT_TOGGLE_SIZE),
      }) as CSSProperties,
    [sidebarWidth, style, toggleSize],
  );

  const updateWidthFromClientX = (clientX: number) => {
    if (!resizable || dragStartXRef.current === null || dragStartWidthRef.current === null) {
      return;
    }
    if (!Number.isFinite(clientX) || !Number.isFinite(dragStartXRef.current)) {
      return;
    }
    const sign = side === "left" ? 1 : -1;
    const delta = (clientX - dragStartXRef.current) * sign;
    const nextWidth = clampWidth(dragStartWidthRef.current + delta, minWidth, maxWidth);
    setResizedWidth(nextWidth);
    if (!currentOpen) {
      setCurrentOpen(true);
    }
  };

  const toggleOpen = () => {
    setCurrentOpen(!currentOpen);
  };

  return (
    <aside
      aria-expanded={currentOpen}
      className={sidebarClassName}
      style={sidebarStyle}
      {...props}
    >
      <button
        aria-expanded={currentOpen}
        aria-label={currentOpen ? "Close sidebar" : "Open sidebar"}
        className="gridra-sidebar__toggle"
        onClick={() => toggleOpen()}
        type="button"
      >
        <span className="gridra-sidebar__toggle-line" />
        <span className="gridra-sidebar__toggle-line" />
        <span className="gridra-sidebar__toggle-line" />
      </button>
      <div className="gridra-sidebar__content">{children}</div>
      {resizable ? (
        <div
          aria-orientation="vertical"
          aria-valuemax={maxWidth}
          aria-valuemin={minWidth}
          aria-valuenow={Math.round(clampWidth(resizedWidth, minWidth, maxWidth))}
          className="gridra-sidebar__separator"
          onDoubleClick={(event) => {
            event.preventDefault();
            toggleOpen();
          }}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) {
              return;
            }

            if (event.key === "Enter" || event.key === " ") {
              toggleOpen();
              event.preventDefault();
              return;
            }

            if (!currentOpen) {
              return;
            }

            let delta = 0;
            if (event.key === "ArrowLeft") {
              delta = side === "left" ? -KEYBOARD_STEP : KEYBOARD_STEP;
            }
            if (event.key === "ArrowRight") {
              delta = side === "left" ? KEYBOARD_STEP : -KEYBOARD_STEP;
            }

            if (event.key === "Home") {
              setResizedWidth(clampWidth(minWidth, minWidth, maxWidth));
              event.preventDefault();
              return;
            }

            if (event.key === "End") {
              setResizedWidth(clampWidth(maxWidth, minWidth, maxWidth));
              event.preventDefault();
              return;
            }

            if (!delta) {
              return;
            }
            setResizedWidth((current) => clampWidth(current + delta, minWidth, maxWidth));
            event.preventDefault();
          }}
          onPointerCancel={() => {
            dragStartXRef.current = null;
            dragStartWidthRef.current = null;
          }}
          onPointerDown={(event) => {
            event.preventDefault();
            if (!Number.isFinite(event.clientX)) {
              return;
            }
            dragStartXRef.current = event.clientX;
            dragStartWidthRef.current = clampWidth(resizedWidth, minWidth, maxWidth);
            if (typeof event.currentTarget.setPointerCapture === "function") {
              event.currentTarget.setPointerCapture(event.pointerId);
            }
          }}
          onPointerMove={(event) => {
            updateWidthFromClientX(event.clientX);
          }}
          onPointerUp={() => {
            dragStartXRef.current = null;
            dragStartWidthRef.current = null;
          }}
          onMouseDown={(event) => {
            event.preventDefault();
            if (!Number.isFinite(event.clientX)) {
              return;
            }
            dragStartXRef.current = event.clientX;
            dragStartWidthRef.current = clampWidth(resizedWidth, minWidth, maxWidth);
          }}
          onMouseMove={(event) => {
            updateWidthFromClientX(event.clientX);
          }}
          onMouseUp={() => {
            dragStartXRef.current = null;
            dragStartWidthRef.current = null;
          }}
          role="separator"
          tabIndex={0}
        />
      ) : null}
    </aside>
  );
}

function toCssLength(value: number | string): string {
  return typeof value === "number" ? `${value}px` : value;
}

function toCssLengthWithMin(value: number | string, minValue: number): string {
  if (typeof value === "number") {
    return `${Math.max(minValue, value)}px`;
  }
  return value;
}

function resolveLengthToPx(value: number | string, fallback: number): number {
  if (typeof value === "number") {
    return value;
  }
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampWidth(value: number, minWidth: number, maxWidth: number): number {
  if (minWidth > maxWidth) {
    return minWidth;
  }
  return Math.min(maxWidth, Math.max(minWidth, value));
}
