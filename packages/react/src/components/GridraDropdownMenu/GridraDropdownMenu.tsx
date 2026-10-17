import {useGridraDropdownMenu} from "@gridra-ui/headless";
import type {Ref} from "react";
import {
  cloneElement,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useControllableValue } from "@gridra-ui/headless";
import { cx } from "../../internal/classNames";
import { composeHandlers } from "@gridra-ui/headless";
import { mergeRefs } from "@gridra-ui/headless";
import { clampIndex } from "@gridra-ui/core";
import { getPortalTarget } from "../../internal/theme";
import { useGridraPortalTheme } from "../../internal/portalTheme";
import { useFloatingPosition } from "@gridra-ui/headless";

export type GridraDropdownMenuPlacement = "top" | "right" | "bottom" | "left";
export type GridraDropdownMenuSize = "sm" | "md" | "lg";

export type GridraDropdownMenuCommandItem = {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
};

export type GridraDropdownMenuSeparatorItem = {
  type: "separator";
  id?: string;
};

export type GridraDropdownMenuItem =
  | GridraDropdownMenuCommandItem
  | GridraDropdownMenuSeparatorItem;

// HTML属性とぶつかるonChange/childrenは、menu状態とtrigger要素の意味に合わせて独自propsとして定義する。
export interface GridraDropdownMenuProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "children" | "onChange"
> {
  children: ReactElement<Record<string, unknown>>;
  items: GridraDropdownMenuItem[];
  onAction?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  placement?: GridraDropdownMenuPlacement;
  size?: GridraDropdownMenuSize;
  minWidth?: number | string;
  maxWidth?: number | string;
  disabled?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePointerDown?: boolean;
  closeOnAction?: boolean;
}

const MENU_OFFSET = 4;

export function GridraDropdownMenu({
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
  placement = "bottom",
  size = "md",
  style,
  ...props
}: GridraDropdownMenuProps) {
  const {currentOpen,portalMounted,triggerRef,menuRef,menuId,coords,resolvedPlacement,enabledIds,safeActiveIndex,handleMenuKeyDown,isCommand,getTriggerProps,getItemProps}=useGridraDropdownMenu({items,onAction,open,defaultOpen,onOpenChange,disabled,placement,offset:MENU_OFFSET,closeOnEscape,closeOnOutsidePointerDown,closeOnAction});
  const triggerElement=children;
  const triggerProps=getTriggerProps<HTMLElement>(isValidElement(children)?{...children.props,ref:(children.props.ref as Ref<HTMLElement>|undefined)??(children as ReactElement&{ref?:Ref<HTMLElement>}).ref}:{});
  const portalTheme = useGridraPortalTheme(triggerRef, undefined, currentOpen && !disabled && portalMounted);
  const menuClassName = cx(
    "gridra-portal-root",
    portalTheme.className,
    "gridra-dropdown-menu",
    `gridra-dropdown-menu--${resolvedPlacement}`,
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
      {cloneElement(triggerElement, triggerProps)}
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
                    {...getItemProps(item.id)} className={cx(
                      "gridra-dropdown-menu__item",
                      item.disabled
                        ? "gridra-dropdown-menu__item--disabled"
                        : null,
                      item.destructive
                        ? "gridra-dropdown-menu__item--destructive"
                        : null,
                      isActive ? "gridra-dropdown-menu__item--active" : null,
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
