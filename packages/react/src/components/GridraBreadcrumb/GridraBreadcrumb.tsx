import {useGridraBreadcrumb} from "@gridra-ui/headless";
import { useEffect, useMemo, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../internal/classNames";

export type GridraBreadcrumbSize = "sm" | "md" | "lg";

export interface GridraBreadcrumbHierarchyIssue {
  itemId: string;
  index: number;
  reason: "missing-parent" | "broken-chain";
}

export interface GridraBreadcrumbItem {
  id: string;
  label: ReactNode;
  href?: string;
  current?: boolean;
  disabled?: boolean;
  parentId?: string;
}

export interface GridraBreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: GridraBreadcrumbItem[];
  size?: GridraBreadcrumbSize;
  separator?: ReactNode;
  maxItems?: number;
  onHierarchyInvalid?: (issues: GridraBreadcrumbHierarchyIssue[]) => void;
}

export function GridraBreadcrumb({
  "aria-label": ariaLabel = "Breadcrumb",
  className,
  items,
  maxItems,
  onHierarchyInvalid,
  separator = "/",
  size = "md",
  ...props
}: GridraBreadcrumbProps) {
  const {visibleItems,hasInvalidHierarchy,getItemState}=useGridraBreadcrumb({items,maxItems,onHierarchyInvalid});

  const rootClassName = cx(
    "gridra-breadcrumb",
    `gridra-breadcrumb--${size}`,
    className,
  );

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={rootClassName}
      {...(hasInvalidHierarchy ? { "data-gridra-invalid-hierarchy": "true" } : {})}
    >
      <ol className="gridra-breadcrumb__list">
        {visibleItems.map((entry, visibleIndex) => {
          if (entry.type === "ellipsis") {
            return (
              <li
                key="ellipsis"
                aria-hidden="true"
                className="gridra-breadcrumb__item gridra-breadcrumb__item--ellipsis"
              >
                <span className="gridra-breadcrumb__ellipsis">&hellip;</span>
                <span className="gridra-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              </li>
            );
          }

          const item = entry.item!;
          const isLast = visibleIndex === visibleItems.length - 1;
          const isCurrent = item.current;
          const itemState=getItemState(item);
          const isDisabled = item.disabled;

          const itemClassName = cx(
            "gridra-breadcrumb__item",
            isDisabled ? "gridra-breadcrumb__item--disabled" : null,
          );

          // current/disabled/hrefなしは遷移できない状態なので、リンクではなくテキストとして描画する。
          const content = !itemState.canNavigate ? (
            <span
              {...itemState.currentProps}
              className={isCurrent ? "gridra-breadcrumb__current" : "gridra-breadcrumb__text"}
            >
              {item.label}
            </span>
          ) : (
            <a className="gridra-breadcrumb__link" {...itemState.linkProps}>
              {item.label}
            </a>
          );

          return (
            <li key={item.id} className={itemClassName}>
              {content}
              {!isLast ? (
                <span className="gridra-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
