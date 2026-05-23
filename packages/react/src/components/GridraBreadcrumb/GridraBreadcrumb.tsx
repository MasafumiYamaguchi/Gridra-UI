import { useEffect, useMemo, type HTMLAttributes, type ReactNode } from "react";

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

function validateHierarchy(items: GridraBreadcrumbItem[]): GridraBreadcrumbHierarchyIssue[] {
  const anyParentId = items.some((item) => item.parentId != null);
  if (!anyParentId) return [];

  const issues: GridraBreadcrumbHierarchyIssue[] = [];
  const idSet = new Set(items.map((item) => item.id));

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.parentId == null) continue;

    if (!idSet.has(item.parentId)) {
      issues.push({ itemId: item.id, index: i, reason: "missing-parent" });
    } else if (i === 0 || item.parentId !== items[i - 1].id) {
      issues.push({ itemId: item.id, index: i, reason: "broken-chain" });
    }
  }

  return issues;
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
  const issues = useMemo(() => validateHierarchy(items), [items]);

  useEffect(() => {
    if (issues.length > 0 && onHierarchyInvalid) {
      onHierarchyInvalid(issues);
    }
  }, [issues, onHierarchyInvalid]);

  const effectiveMaxItems = maxItems != null ? Math.max(3, maxItems) : undefined;

  const visibleItems = useMemo(() => {
    if (effectiveMaxItems == null || items.length <= effectiveMaxItems) {
      return items.map((item, i) => ({ type: "item" as const, item, index: i }));
    }

    const result: { type: "item" | "ellipsis"; item?: GridraBreadcrumbItem; index: number }[] = [];

    result.push({ type: "item", item: items[0], index: 0 });

    result.push({ type: "ellipsis", index: -1 });

    const tailCount = effectiveMaxItems - 2;
    const tailStart = items.length - tailCount;
    for (let i = tailStart; i < items.length; i++) {
      result.push({ type: "item", item: items[i], index: i });
    }

    return result;
  }, [items, effectiveMaxItems]);

  const hasInvalidHierarchy = issues.length > 0;

  const rootClassName = [
    "gridra-breadcrumb",
    `gridra-breadcrumb--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav
      {...props}
      aria-label={ariaLabel}
      className={rootClassName}
      {...(hasInvalidHierarchy ? { "data-gridra-invalid-hierarchy": "true" } : {})}
    >
      <ol className="gridra-breadcrumb__list">
        {visibleItems.map((entry, vi) => {
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
          const isLast = vi === visibleItems.length - 1;
          const isCurrent = item.current;
          const isDisabled = item.disabled;

          const itemClassName = [
            "gridra-breadcrumb__item",
            isDisabled ? "gridra-breadcrumb__item--disabled" : null,
          ]
            .filter(Boolean)
            .join(" ");

          const content = isCurrent || isDisabled || !item.href ? (
            <span
              {...(isCurrent ? { "aria-current": "page" as const } : {})}
              className={isCurrent ? "gridra-breadcrumb__current" : "gridra-breadcrumb__text"}
            >
              {item.label}
            </span>
          ) : (
            <a className="gridra-breadcrumb__link" href={item.href}>
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
