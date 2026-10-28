import { useGridraTreeView } from "@gridra-ui/headless";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useControllableValue } from "@gridra-ui/headless";

export type GridraTreeViewSize = "sm" | "md" | "lg";

export interface GridraTreeItem {
  id: string;
  label: ReactNode;
  children?: GridraTreeItem[];
  disabled?: boolean;
}

export interface GridraTreeViewProps extends HTMLAttributes<HTMLDivElement> {
  items: GridraTreeItem[];
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedIdsChange?: (nextIds: string[], previousIds: string[]) => void;
  onItemClick?: (id: string) => void;
  renderItem?: (
    item: GridraTreeItem,
    state: {
      depth: number;
      disabled: boolean;
      expanded: boolean;
      focused: boolean;
      hasChildren: boolean;
    },
  ) => ReactNode;
  size?: GridraTreeViewSize;
  emptyState?: ReactNode;
}

export function GridraTreeView({
  className,
  defaultExpandedIds,
  emptyState,
  expandedIds: expandedIdsProp,
  items,
  onExpandedIdsChange,
  onItemClick,
  renderItem,
  size = "md",
  ...props
}: GridraTreeViewProps) {
  const { baseId, flatItems, focusedId, expandedSet, getRowProps } =
    useGridraTreeView({
      items,
      expandedIds: expandedIdsProp,
      defaultExpandedIds,
      onExpandedIdsChange,
      onItemClick,
    });
  if (items.length === 0) {
    // 空の場合はtree roleを作らず、任意のemptyStateだけを表示する。
    return (
      <div
        {...props}
        className={["gridra-tree-view", className].filter(Boolean).join(" ")}
      >
        {emptyState != null ? (
          <div className="gridra-tree-view__empty">{emptyState}</div>
        ) : null}
      </div>
    );
  }

  const rootClassName = [
    "gridra-tree-view",
    `gridra-tree-view--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...props} className={rootClassName}>
      <ul className="gridra-tree-view__list" role="tree">
        {flatItems.map(({ item, depth, hasChildren, key }) => {
          // disabled項目は表示に残すが、フォーカス・クリック・展開の対象外にする。
          const isDisabled = item.disabled ?? false;
          const isExpanded =
            !isDisabled && hasChildren && expandedSet.has(item.id);
          const isFocused = focusedId === item.id;
          const groupId = `${baseId}-group-${key}`;
          const itemContent = renderItem ? (
            renderItem(item, {
              depth,
              disabled: isDisabled,
              expanded: isExpanded,
              focused: isFocused,
              hasChildren,
            })
          ) : (
            <span className="gridra-tree-view__label-text">{item.label}</span>
          );

          return (
            <li
              key={key}
              aria-expanded={hasChildren ? isExpanded : undefined}
              aria-level={depth + 1}
              className={[
                "gridra-tree-view__item",
                isDisabled ? "gridra-tree-view__item--disabled" : null,
              ]
                .filter(Boolean)
                .join(" ")}
              role="treeitem"
            >
              <div
                {...getRowProps(item, hasChildren)}
                className={[
                  "gridra-tree-view__row",
                  isFocused ? "gridra-tree-view__row--focused" : null,
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span
                  className="gridra-tree-view__indent"
                  style={{ width: depth * 16 }}
                />
                {hasChildren ? (
                  <span
                    aria-hidden="true"
                    className={[
                      "gridra-tree-view__chevron",
                      isExpanded ? "gridra-tree-view__chevron--expanded" : null,
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                ) : (
                  <span className="gridra-tree-view__chevron-spacer" />
                )}
                <span className="gridra-tree-view__label">{itemContent}</span>
              </div>
              {hasChildren && item.children && item.children.length > 0 ? (
                <ul
                  className="gridra-tree-view__group"
                  hidden={!isExpanded}
                  id={groupId}
                  role="group"
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
