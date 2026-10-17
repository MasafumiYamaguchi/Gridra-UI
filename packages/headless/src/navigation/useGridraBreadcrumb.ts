import {useEffect,useMemo,type ReactNode,type HTMLAttributes,type AnchorHTMLAttributes} from "react";
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


// Breadcrumbは表示順そのものが階層を表すため、parentIdがある場合だけ軽く整合性を検証する。
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


export interface UseGridraBreadcrumbOptions {items:GridraBreadcrumbItem[];maxItems?:number;onHierarchyInvalid?:(issues:GridraBreadcrumbHierarchyIssue[])=>void}
/** 階層データの検証と省略表示に使うモデルを返す。 */
export function useGridraBreadcrumb({items,maxItems,onHierarchyInvalid}:UseGridraBreadcrumbOptions){
  const issues = useMemo(() => validateHierarchy(items), [items]);

  // 表示は継続しつつ、呼び出し側がデータ不整合を検知できるように通知する。
  useEffect(() => {
    if (issues.length > 0 && onHierarchyInvalid) {
      onHierarchyInvalid(issues);
    }
  }, [issues, onHierarchyInvalid]);

  const effectiveMaxItems = maxItems != null && Number.isFinite(maxItems) ? Math.max(3, Math.floor(maxItems)) : undefined;

  // 省略表示でも現在地の文脈を失わないよう、先頭と末尾側のitemは必ず残す。
  const visibleItems = useMemo(() => {
    if (effectiveMaxItems == null || items.length <= effectiveMaxItems) {
      return items.map((item, i) => ({ type: "item" as const, item, index: i }));
    }

    const result: { type: "item" | "ellipsis"; item?: GridraBreadcrumbItem; index: number }[] = [];

    result.push({ type: "item", item: items[0], index: 0 });

    result.push({ type: "ellipsis", index: -1 }); // 省略を表すエントリを追加

    const tailCount = effectiveMaxItems - 2;
    const tailStart = items.length - tailCount;
    for (let i = tailStart; i < items.length; i++) {
      result.push({ type: "item", item: items[i], index: i });
    }

    return result;
  }, [items, effectiveMaxItems]);

  const hasInvalidHierarchy = issues.length > 0;


const getItemState=(item:GridraBreadcrumbItem)=>({canNavigate:Boolean(item.href)&&!item.current&&!item.disabled,currentProps:{"aria-current":item.current?"page":undefined} satisfies HTMLAttributes<HTMLElement>,linkProps:{href:item.href} satisfies AnchorHTMLAttributes<HTMLAnchorElement>});
return {visibleItems,issues,hasInvalidHierarchy,getItemState};
}
