import {
  isCommand,
  useGridraDropdownMenu,
  type GridraDropdownMenuItem,
} from "@gridra-ui/headless";
import {
  cloneElement,
  isValidElement,
  useMemo,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from "react";
import { createPortal } from "react-dom";
import { cx } from "../../internal/classNames";
import { getPortalTarget } from "../../internal/theme";
import { useGridraPortalTheme } from "../../internal/portalTheme";

export type {
  GridraDropdownMenuCommandItem,
  GridraDropdownMenuItem,
  GridraDropdownMenuSeparatorItem,
} from "@gridra-ui/headless";

export type GridraDropdownMenuPlacement = "top" | "right" | "bottom" | "left";

export type GridraDropdownMenuSize = "sm" | "md" | "lg";

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
  const {
    currentOpen,
    portalMounted,
    triggerRef,
    resolvedPlacement,
    enabledIds,
    safeActiveIndex,
    getTriggerProps,
    getMenuProps,
    getItemProps,
  } = useGridraDropdownMenu({
    items,
    onAction,
    open,
    defaultOpen,
    onOpenChange,
    disabled,
    placement,
    offset: MENU_OFFSET,
    closeOnEscape,
    closeOnOutsidePointerDown,
    closeOnAction,
  });
  const triggerElement = children;
  const triggerProps = getTriggerProps<HTMLElement>(
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
    triggerRef,
    undefined,
    currentOpen && !disabled && portalMounted,
  );
  const menuClassName = cx(
    "gridra-portal-root",
    portalTheme.className,
    "gridra-dropdown-menu",
    `gridra-dropdown-menu--${resolvedPlacement}`,
    `gridra-dropdown-menu--${size}`,
    className,
  );

  // menuの位置（top/left）はgetMenuPropsが付けるため、ここではtheme・利用者style・幅の変数だけを組み立てる。
  const menuStyle = useMemo(
    () =>
      ({
        ...portalTheme.style,
        ...style,
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
    [portalTheme.style, minWidth, maxWidth, style],
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
              {...getMenuProps({
                ...props,
                className: menuClassName,
                style: menuStyle,
              })}
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
