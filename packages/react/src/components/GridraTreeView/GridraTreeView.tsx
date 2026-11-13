import { useGridraTreeView, type GridraTreeItem } from "@gridra-ui/headless";
import { useId, type HTMLAttributes, type ReactNode } from "react";

export type { GridraTreeItem } from "@gridra-ui/headless";

export type GridraTreeViewSize = "sm" | "md" | "lg";

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
  const { flatItems, isExpanded, isFocused, getRowProps } = useGridraTreeView({
    items,
    expandedIds: expandedIdsProp,
    defaultExpandedIds,
    onExpandedIdsChange,
    onItemClick,
  });
  // groupのidを他のtreeと衝突させないための基点。
  const baseId = useId();
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
          const expanded = !isDisabled && hasChildren && isExpanded(item.id);
          const focused = isFocused(item.id);
          const groupId = `${baseId}-group-${key}`;
          const itemContent = renderItem ? (
            renderItem(item, {
              depth,
              disabled: isDisabled,
              expanded,
              focused,
              hasChildren,
            })
          ) : (
            <span className="gridra-tree-view__label-text">{item.label}</span>
          );

          return (
            <li
              key={key}
              aria-expanded={hasChildren ? expanded : undefined}
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
                {...getRowProps(item)}
                className={[
                  "gridra-tree-view__row",
                  focused ? "gridra-tree-view__row--focused" : null,
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
                      expanded ? "gridra-tree-view__chevron--expanded" : null,
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
                  hidden={!expanded}
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
