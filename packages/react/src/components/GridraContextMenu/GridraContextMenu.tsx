import { useGridraContextMenu } from "@gridra-ui/headless";
import type { Ref } from "react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useControllableValue } from "@gridra-ui/headless";
import { cx } from "../../internal/classNames";
import { composeHandlers } from "@gridra-ui/headless";
import { mergeRefs } from "@gridra-ui/headless";
import { clampIndex, clampNumber } from "@gridra-ui/core";
import { getPortalTarget } from "../../internal/theme";
import { useGridraPortalTheme } from "../../internal/portalTheme";
import type {
  GridraDropdownMenuItem,
  GridraDropdownMenuSize,
} from "../GridraDropdownMenu/GridraDropdownMenu";

export type { GridraDropdownMenuItem };

export type GridraContextMenuSize = GridraDropdownMenuSize;

// HTML属性とぶつかるonChange/childrenは、menu状態とtrigger要素の意味に合わせて独自propsとして定義する。
export interface GridraContextMenuProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  children: ReactElement<Record<string, unknown>>;
  items: GridraDropdownMenuItem[];
  onAction?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  size?: GridraContextMenuSize;
  minWidth?: number | string;
  maxWidth?: number | string;
  disabled?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePointerDown?: boolean;
  closeOnAction?: boolean;
}

export function GridraContextMenu({
  children,
  className,
  closeOnAction = true,
  closeOnEscape = true,
  closeOnOutsidePointerDown = true,
  defaultOpen = false,
  disabled = false,
  items,
  maxWidth,
  minWidth,
  onAction,
  onOpenChange,
  open,
  size = "md",
  style,
  ...props
}: GridraContextMenuProps) {
  const {
    currentOpen,
    portalMounted,
    targetRef,
    menuRef,
    menuId,
    coords,
    enabledIds,
    safeActiveIndex,
    handleMenuKeyDown,
    isCommand,
    getTargetProps,
    getItemProps,
  } = useGridraContextMenu({
    items,
    onAction,
    open,
    defaultOpen,
    onOpenChange,
    disabled,
    closeOnEscape,
    closeOnOutsidePointerDown,
    closeOnAction,
  });
  const triggerElement = children;
  const targetProps = getTargetProps<HTMLElement>(
    isValidElement(children)
      ? {
          ...children.props,
          ref:
            (children.props.ref as Ref<HTMLElement> | undefined) ??
            (children as ReactElement & { ref?: Ref<HTMLElement> }).ref,
        }
      : {},
  );
  const portalTheme = useGridraPortalTheme(
    targetRef,
    undefined,
    currentOpen && !disabled && portalMounted,
  );
  const menuClassName = cx(
    "gridra-portal-root",
    portalTheme.className,
    "gridra-context-menu",
    "gridra-dropdown-menu",
    `gridra-dropdown-menu--${size}`,
    className,
  );

  const menuStyle = useMemo(
    () =>
      ({
        ...portalTheme.style,
        ...style,
        top: `${coords.top}px`,
        left: `${coords.left}px`,
        // min/max幅は任意値なのでCSS変数でtheme側へ渡し、classの種類を増やさない。
        "--gridra-dropdown-menu-min-width":
          minWidth === undefined
            ? undefined
            : typeof minWidth === "number"
              ? `${minWidth}px`
              : minWidth,
        "--gridra-dropdown-menu-max-width":
          maxWidth === undefined
            ? undefined
            : typeof maxWidth === "number"
              ? `${maxWidth}px`
              : maxWidth,
      }) as CSSProperties,
    [portalTheme.style, coords.top, coords.left, minWidth, maxWidth, style],
  );
  const portalTarget = getPortalTarget();

  if (!isValidElement(children)) {
    return null;
  }

  return (
    <>
      {cloneElement(triggerElement, targetProps)}
      {currentOpen && !disabled && portalMounted && portalTarget
        ? createPortal(
            <div
              {...props}
              className={menuClassName}
              id={menuId}
              onKeyDown={handleMenuKeyDown}
              ref={menuRef}
              role="menu"
              style={menuStyle}
            >
              {items.map((item, index) => {
                if (!isCommand(item)) {
                  return (
                    <div
                      className="gridra-dropdown-menu__separator"
                      key={item.id ?? `sep-${index}`}
                      role="separator"
                    />
                  );
                }

                const isActive = enabledIds[safeActiveIndex] === item.id;

                return (
                  <button
                    {...getItemProps(item.id)}
                    className={cx(
                      "gridra-dropdown-menu__item",
                      item.disabled && "gridra-dropdown-menu__item--disabled",
                      item.destructive &&
                        "gridra-dropdown-menu__item--destructive",
                      isActive && "gridra-dropdown-menu__item--active",
                    )}

                    key={item.id}
                  >
                    <span className="gridra-dropdown-menu__item-label">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>,
            portalTarget,
          )
        : null}
    </>
  );
}
