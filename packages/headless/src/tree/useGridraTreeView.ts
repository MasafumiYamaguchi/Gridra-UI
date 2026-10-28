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
  type Ref,
} from "react";
import { useControllableValue } from "../useControllableValue";
import { composeHandlers } from "../internal/composeHandlers";
import { mergeRefs } from "../internal/mergeRefs";

export interface GridraTreeItem {
  id: string;
  label: ReactNode;
  children?: GridraTreeItem[];
  disabled?: boolean;
}

interface FlatItem {
  item: GridraTreeItem;
  depth: number;
  hasChildren: boolean;
  key: string;
}

function buildIdMap(items: GridraTreeItem[]): {
  validMap: Map<string, GridraTreeItem>;
} {
  // 入れ子全体を走査し、展開idの妥当性を一定時間で確認できるMapを作る。
  const validMap = new Map<string, GridraTreeItem>();

  const walk = (list: GridraTreeItem[]) => {
    for (const item of list) {
      // idが重複した場合は、先に現れた項目を正規の参照先として残す。
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
  // 展開中の枝だけを再帰的に追加し、現在画面に見える行の順序へ変換する。
  const result: FlatItem[] = [];
  for (const [index, item] of items.entries()) {
    // React keyは同一idがあっても階層と位置で区別できるようパス化する。
    const key = parentKey
      ? `${parentKey}/${item.id}-${index}`
      : `${item.id}-${index}`;
    const hasChildren = (item.children?.length ?? 0) > 0;
    result.push({ item, depth, hasChildren, key });
    if (hasChildren && expandedIds.has(item.id) && item.children) {
      result.push(...flattenItems(item.children, expandedIds, depth + 1, key));
    }
  }

  return result;
}

export interface UseGridraTreeViewOptions {
  items: GridraTreeItem[];
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedIdsChange?: (next: string[], previous: string[]) => void;
  onItemClick?: (id: string) => void;
}

/** ツリーの展開・可視行・フォーカス操作を描画から独立させる。 */
export function useGridraTreeView({
  items,
  expandedIds: expandedIdsProp,
  defaultExpandedIds,
  onExpandedIdsChange,
  onItemClick,
}: UseGridraTreeViewOptions) {
  // treeitem内の関連要素に衝突しないidを付けるための基点。
  const baseId = useId();
  // roving tabIndexで移動先の行を直接focusするため、idとDOMを対応付ける。
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const { validMap } = useMemo(() => buildIdMap(items), [items]);

  const sanitizeIds = useCallback(
    // 存在しないidやdisabled項目は展開状態として受け入れない。
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
    (next, previous) =>
      onExpandedIdsChange?.(sanitizeIds(next), sanitizeIds(previous)),
  );

  // 描画と判定を効率化するため、有効な展開idだけをSetへ変換する。
  const expandedSet = useMemo(
    () => new Set(sanitizeIds(rawExpandedIds)),
    [rawExpandedIds, sanitizeIds],
  );

  // キーボード移動は、展開状態から生成した可視行だけを対象にする。
  const flatItems = useMemo(
    () => flattenItems(items, expandedSet),
    [items, expandedSet],
  );

  const enabledFlatIds = useMemo(
    () => flatItems.filter((f) => !f.item.disabled).map((f) => f.item.id),
    [flatItems],
  );

  const [focusedId, setFocusedId] = useState<string | null>(null);

  useEffect(() => {
    // 折りたたみでフォーカス行が消えた場合は、最初の有効な可視行へ戻す。
    if (focusedId && !flatItems.some((f) => f.item.id === focusedId)) {
      setFocusedId(enabledFlatIds[0] ?? null);
    }
  }, [focusedId, flatItems, enabledFlatIds]);

  const focusRow = useCallback((id: string) => {
    setFocusedId(id);
    rowRefs.current.get(id)?.focus();
  }, []);

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
      // 平坦化された直前方向をたどり、depthが1つ浅い最寄りの親を探す。
      const idx = flatItems.findIndex((f) => f.item.id === currentId);
      if (idx <= 0) return null;

      const currentDepth = flatItems[idx].depth;
      for (let i = idx - 1; i >= 0; i--) {
        if (
          flatItems[i].depth === currentDepth - 1 &&
          flatItems[i].hasChildren
        ) {
          return flatItems[i].item.id;
        }
      }

      return null;
    },
    [flatItems],
  );

  const toggleExpand = useCallback(
    (id: string) => {
      const item = validMap.get(id);
      if (!item || item.disabled || !item.children?.length) return;

      // controlled/uncontrolledの違いはhookへ委ね、次のid配列だけを組み立てる。
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

      // 上下は可視行間、左右は展開・折りたたみ・親子移動として扱う。
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
    [
      expandedSet,
      toggleExpand,
      moveFocusVertical,
      enabledFlatIds,
      focusRow,
      findParentId,
    ],
  );

  const getRowProps = (
    item: GridraTreeItem,
    hasChildren = Boolean(item.children?.length),
    props: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> } = {},
  ): HTMLAttributes<HTMLDivElement> & {
    ref?: (element: HTMLDivElement | null) => void;
  } => {
    const isDisabled = Boolean(item.disabled);
    const isFocused = focusedId === item.id;

    return {
      ...props,
      "ref": mergeRefs<HTMLDivElement>(props.ref, (el) => {
        // アンマウント時にはMapから削除し、古いDOM参照を残さない。
        if (el) rowRefs.current.set(item.id, el);
        else rowRefs.current.delete(item.id);
      }),
      "tabIndex": isFocused ? 0 : -1,
      "onClick": composeHandlers(props.onClick, () => {
        if (!isDisabled) {
          onItemClick?.(item.id);
        }

        if (!isDisabled && hasChildren) toggleExpand(item.id);
      }),
      "onKeyDown": composeHandlers(props.onKeyDown, (e) => {
        if (!isDisabled) handleRowKeyDown(e, item, hasChildren);
      }),
    };
  };

  return {
    baseId,
    flatItems,
    focusedId,
    expandedSet,
    toggleExpand,
    getRowProps,
  };
}
