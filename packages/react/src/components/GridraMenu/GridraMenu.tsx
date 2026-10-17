import { useGridraMenu } from "@gridra-ui/headless";
import {
  useMemo,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useControllableValue } from "@gridra-ui/headless";
import { cx } from "../../internal/classNames";
import { clampIndex } from "@gridra-ui/core";

export type GridraMenuOrientation = "vertical" | "horizontal";
export type GridraMenuSize = "sm" | "md" | "lg";

export interface GridraMenuCommandItem {
  id: string;
  label: ReactNode;
  href?: string;
  disabled?: boolean;
  destructive?: boolean;
}

// separatorは操作対象ではないため、idなしでも描画できる。
export interface GridraMenuSeparatorItem {
  type: "separator";
  id?: string;
}

export type GridraMenuItem = GridraMenuCommandItem | GridraMenuSeparatorItem;

export interface GridraMenuItemState {
  active: boolean;
  disabled: boolean;
  destructive: boolean;
  hasHref: boolean;
  orientation: GridraMenuOrientation;
}

export interface GridraMenuProps extends HTMLAttributes<HTMLElement> {
  items: GridraMenuItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (nextId: string | undefined, previousId: string | undefined) => void;
  onAction?: (id: string) => void;
  renderItem?: (item: GridraMenuCommandItem, state: GridraMenuItemState) => ReactNode;
  orientation?: GridraMenuOrientation;
  size?: GridraMenuSize;
}

function isCommand(item: GridraMenuItem): item is GridraMenuCommandItem {
  return !("type" in item) || item.type !== "separator";
}

export function GridraMenu({
  activeId,
  "aria-label": ariaLabel = "Menu",
  className,
  defaultActiveId,
  items,
  onAction,
  onActiveIdChange,
  orientation = "vertical",
  renderItem,
  size = "md",
  ...props
}: GridraMenuProps) {
  const {safeActiveId,getRootProps,getItemProps} = useGridraMenu({items,activeId,defaultActiveId,onActiveIdChange,onAction,orientation});
  const rootClassName = cx(
    "gridra-menu",
    `gridra-menu--${orientation}`,
    `gridra-menu--${size}`,
    className,
  );

  if (items.length === 0) {
    return (
      <nav aria-label={ariaLabel} className={rootClassName} {...props}>
        <ul className="gridra-menu__list" />
      </nav>
    );
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={rootClassName}
      {...getRootProps(props)}
    >
      <ul className="gridra-menu__list" role="list">
        {items.map((item, index) => {
          if (!isCommand(item)) {
            return (
              <li
                className="gridra-menu__separator"
                key={item.id ?? `sep-${index}`}
                role="separator"
              />
            );
          }

          const isActive = item.id === safeActiveId;
          const tagClassName = cx(
            "gridra-menu__item",
            item.disabled ? "gridra-menu__item--disabled" : null,
            item.destructive ? "gridra-menu__item--destructive" : null,
            isActive ? "gridra-menu__item--active" : null,
          );

          const state: GridraMenuItemState = {
            active: isActive,
            disabled: !!item.disabled,
            destructive: !!item.destructive,
            hasHref: !!item.href,
            orientation,
          };

          const content = renderItem ? (
            renderItem(item, state)
          ) : (
            <span className="gridra-menu__item-label">{item.label}</span>
          );
          
          if (item.href && !item.disabled) {
            return (
              <li className="gridra-menu__list-item" key={item.id}>
                <a
                  className={tagClassName}
                  href={item.href}
                  {...getItemProps<HTMLAnchorElement>(item.id)}
                  tabIndex={isActive ? 0 : -1}
                  {...(isActive ? { "aria-current": "page" as const } : {})}
                >
                  {content}
                </a>
              </li>
            );
          }

          return (
            <li className="gridra-menu__list-item" key={item.id}>
              <button
                className={tagClassName}
                {...getItemProps(item.id)}
                tabIndex={isActive ? 0 : -1}
                type="button"
                {...(isActive ? { "aria-current": "page" as const } : {})}
              >
                {content}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
