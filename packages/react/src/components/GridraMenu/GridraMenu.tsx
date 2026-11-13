import {
  useGridraMenu,
  type GridraMenuCommandItem,
  type GridraMenuItem,
  type GridraMenuItemState,
  type GridraMenuOrientation,
} from "@gridra-ui/headless";
import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";

export type {
  GridraMenuCommandItem,
  GridraMenuItem,
  GridraMenuItemState,
  GridraMenuOrientation,
  GridraMenuSeparatorItem,
} from "@gridra-ui/headless";

export type GridraMenuSize = "sm" | "md" | "lg";

export interface GridraMenuProps extends HTMLAttributes<HTMLElement> {
  items: GridraMenuItem[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveIdChange?: (
    nextId: string | undefined,
    previousId: string | undefined,
  ) => void;
  onAction?: (id: string) => void;
  renderItem?: (
    item: GridraMenuCommandItem,
    state: GridraMenuItemState,
  ) => ReactNode;
  orientation?: GridraMenuOrientation;
  size?: GridraMenuSize;
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
  const { safeActiveId, getRootProps, getItemProps, isCommand } = useGridraMenu(
    {
      items,
      activeId,
      defaultActiveId,
      onActiveIdChange,
      onAction,
      orientation,
    },
  );
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
                type="button"
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
