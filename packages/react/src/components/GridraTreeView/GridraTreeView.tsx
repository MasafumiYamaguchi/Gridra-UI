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
import { useControllableValue } from "../../hooks/useControllableValue";

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

interface FlatItem {
  item: GridraTreeItem;
  depth: number;
  hasChildren: boolean;
  key: string;
}

function buildIdMap(items: GridraTreeItem[]): { validMap: Map<string, GridraTreeItem> } {
  const validMap = new Map<string, GridraTreeItem>();
  const walk = (list: GridraTreeItem[]) => {
    for (const item of list) {
      if (!validMap.has(item.id)) {
        validMap.set(item.id, item);
      }
      if (item.children) walk(item.children);
    }
  };
  walk(items);
  return { validMap };
}

function flattenItems(
  items: GridraTreeItem[],
  expandedIds: Set<string>,
  depth: number = 0,
  parentKey: string = "",
): FlatItem[] {
  const result: FlatItem[] = [];
  for (const [index, item] of items.entries()) {
    const key = parentKey ? `${parentKey}/${item.id}-${index}` : `${item.id}-${index}`;
    const hasChildren = (item.children?.length ?? 0) > 0;
    result.push({ item, depth, hasChildren, key });
    if (hasChildren && expandedIds.has(item.id) && item.children) {
      result.push(...flattenItems(item.children, expandedIds, depth + 1, key));
    }
  }
  return result;
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
  const baseId = useId();
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const { validMap } = useMemo(() => buildIdMap(items), [items]);

  const sanitizeIds = useCallback(
    (ids: string[]): string[] =>
      ids.filter((id) => {
        const resolved = validMap.get(id);
        return resolved && !resolved.disabled;
      }),
    [validMap],
  );

  const [rawExpandedIds, setRawExpandedIds] = useControllableValue<string[]>(
    expandedIdsProp,
    defaultExpandedIds ?? [],
    onExpandedIdsChange,
  );

  const expandedSet = useMemo(() => new Set(sanitizeIds(rawExpandedIds)), [rawExpandedIds, sanitizeIds]);

  const flatItems = useMemo(() => flattenItems(items, expandedSet), [items, expandedSet]);

  const enabledFlatIds = useMemo(
    () => flatItems.filter((f) => !f.item.disabled).map((f) => f.item.id),
    [flatItems],
  );

  const [focusedId, setFocusedId] = useState<string | null>(null);

  useEffect(() => {
    if (focusedId && !flatItems.some((f) => f.item.id === focusedId)) {
      setFocusedId(enabledFlatIds[0] ?? null);
    }
  }, [focusedId, flatItems, enabledFlatIds]);

  const focusRow = useCallback(
    (id: string) => {
      setFocusedId(id);
      rowRefs.current.get(id)?.focus();
    },
    [],
  );

  const moveFocusVertical = useCallback(
    (currentId: string, direction: -1 | 1) => {
      const idx = enabledFlatIds.indexOf(currentId);
      if (idx < 0) return;
      const nextIdx = idx + direction;
      if (nextIdx >= 0 && nextIdx < enabledFlatIds.length) {
        focusRow(enabledFlatIds[nextIdx]);
      }
    },
    [enabledFlatIds, focusRow],
  );

  const findParentId = useCallback(
    (currentId: string): string | null => {
      const idx = flatItems.findIndex((f) => f.item.id === currentId);
      if (idx <= 0) return null;
      const currentDepth = flatItems[idx].depth;
      for (let i = idx - 1; i >= 0; i--) {
        if (flatItems[i].depth === currentDepth - 1 && flatItems[i].hasChildren) {
          return flatItems[i].item.id;
        }
      }
      return null;
    },
    [flatItems],
  );

  const toggleExpand = useCallback(
    (id: string) => {
      if (expandedSet.has(id)) {
        setRawExpandedIds(rawExpandedIds.filter((e) => e !== id));
      } else {
        setRawExpandedIds([...rawExpandedIds, id]);
      }
    },
    [expandedSet, rawExpandedIds, setRawExpandedIds],
  );

  const handleRowKeyDown = useCallback(
    (event: KeyboardEvent, item: GridraTreeItem, hasChildren: boolean) => {
      const { id } = item;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          moveFocusVertical(id, 1);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveFocusVertical(id, -1);
          break;
        case "ArrowRight":
          event.preventDefault();
          if (hasChildren) {
            if (!expandedSet.has(id)) {
              toggleExpand(id);
            } else {
              const idx = enabledFlatIds.indexOf(id);
              if (idx >= 0 && idx + 1 < enabledFlatIds.length) {
                focusRow(enabledFlatIds[idx + 1]);
              }
            }
          }
          break;
        case "ArrowLeft":
          event.preventDefault();
          if (hasChildren && expandedSet.has(id)) {
            toggleExpand(id);
          } else {
            const parentId = findParentId(id);
            if (parentId) {
              focusRow(parentId);
            }
          }
          break;
        case "Home":
          event.preventDefault();
          if (enabledFlatIds.length > 0) {
            focusRow(enabledFlatIds[0]);
          }
          break;
        case "End":
          event.preventDefault();
          if (enabledFlatIds.length > 0) {
            focusRow(enabledFlatIds[enabledFlatIds.length - 1]);
          }
          break;
      }
    },
    [expandedSet, toggleExpand, moveFocusVertical, enabledFlatIds, focusRow, findParentId],
  );

  if (items.length === 0) {
    return (
      <div {...props} className={["gridra-tree-view", className].filter(Boolean).join(" ")}>
        {emptyState != null ? (
          <div className="gridra-tree-view__empty">{emptyState}</div>
        ) : null}
      </div>
    );
  }

  const rootClassName = ["gridra-tree-view", `gridra-tree-view--${size}`, className].filter(Boolean).join(" ");

  return (
    <div {...props} className={rootClassName}>
      <ul className="gridra-tree-view__list" role="tree">
        {flatItems.map(({ item, depth, hasChildren, key }) => {
          const isDisabled = item.disabled ?? false;
          const isExpanded = !isDisabled && hasChildren && expandedSet.has(item.id);
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
              className={["gridra-tree-view__item", isDisabled ? "gridra-tree-view__item--disabled" : null].filter(Boolean).join(" ")}
              role="treeitem"
            >
              <div
                className={["gridra-tree-view__row", isFocused ? "gridra-tree-view__row--focused" : null].filter(Boolean).join(" ")}
                ref={(el) => {
                  if (el) rowRefs.current.set(item.id, el);
                  else rowRefs.current.delete(item.id);
                }}
                tabIndex={isFocused ? 0 : -1}
                onClick={() => {
                  if (!isDisabled) {
                    onItemClick?.(item.id);
                  }
                  if (!isDisabled && hasChildren) toggleExpand(item.id);
                }}
                onKeyDown={(e) => {
                  if (!isDisabled) handleRowKeyDown(e, item, hasChildren);
                }}
              >
                <span className="gridra-tree-view__indent" style={{ width: depth * 16 }} />
                {hasChildren ? (
                  <span
                    aria-hidden="true"
                    className={["gridra-tree-view__chevron", isExpanded ? "gridra-tree-view__chevron--expanded" : null].filter(Boolean).join(" ")}
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
