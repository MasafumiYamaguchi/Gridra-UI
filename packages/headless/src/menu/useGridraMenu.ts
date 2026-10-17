import { useMemo,useRef,type ReactNode,type KeyboardEvent,type HTMLAttributes,type Ref } from "react";
import { useControllableValue } from "../useControllableValue";
import { composeHandlers } from "../internal/composeHandlers";
import { mergeRefs } from "../internal/mergeRefs";
import {clampIndex} from "@gridra-ui/core";
export type GridraMenuOrientation="vertical"|"horizontal";
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


export interface UseGridraMenuOptions {items:GridraMenuItem[];activeId?:string;defaultActiveId?:string;onActiveIdChange?:(next:string|undefined,previous:string|undefined)=>void;onAction?:(id:string)=>void;orientation?:GridraMenuOrientation}
function isCommand(item: GridraMenuItem): item is GridraMenuCommandItem {
  return !("type" in item) || item.type !== "separator";
}

// activeIdが有効なidかどうかを判定する
function normalizeActiveId(
  requestedId: string | undefined,
  commandItems: GridraMenuCommandItem[],
): string | undefined {
  if (requestedId == null) return undefined;
  const item = commandItems.find((c) => c.id === requestedId);
  if (!item || item.disabled) return undefined;
  return requestedId;
}


/** ナビゲーション項目の選択とフォーカスを管理する。 */
export function useGridraMenu({items,activeId,defaultActiveId,onActiveIdChange,onAction,orientation="vertical"}:UseGridraMenuOptions){
  // itemをidで参照するため、itemのidをキーにしたMapを保持する
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());

  const commandItems = useMemo(() => items.filter(isCommand), [items]);

  const enabledItems = useMemo(
    () => commandItems.filter((c) => !c.disabled),
    [commandItems],
  );

  const enabledIds = useMemo(
    () => enabledItems.map((c) => c.id),
    [enabledItems],
  );

  // 初期値が存在しないitemやdisabled itemを指している場合は未選択として扱う。
  const safeDefaultActiveId = useMemo(
    () => normalizeActiveId(defaultActiveId, commandItems),
    [defaultActiveId, commandItems],
  );

  // controlledなactiveIdも、有効なcommand itemだけを選択状態として受け入れる。
  const safeActiveIdProp = useMemo(
    () => normalizeActiveId(activeId, commandItems),
    [activeId, commandItems],
  );

  const [currentActiveId, setActiveId] = useControllableValue(
    activeId,
    safeDefaultActiveId,
    (next, previous) => onActiveIdChange?.(next, normalizeActiveId(previous, commandItems)),
  );

  // items変更で現在のactiveIdが無効になる場合があるため、描画直前にも正規化する。
  const safeActiveId = useMemo(
    () => normalizeActiveId(currentActiveId, commandItems),
    [currentActiveId, commandItems],
  );

  const activeIndex = useMemo(
    () => (safeActiveId ? enabledIds.indexOf(safeActiveId) : -1),
    [safeActiveId, enabledIds],
  );

  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  const focusedIndexRef = useRef(safeActiveIndex);

  // 外部からactiveIdが変更された場合、focusedIndexも更新する。
  focusedIndexRef.current = safeActiveIndex;

  const handleActivate = (id: string) => {
    const item = commandItems.find((c) => c.id === id);
    if (!item || item.disabled) return;
    if (id !== safeActiveId) setActiveId(id);
    onAction?.(id);
  };

  const focusItemById = (id: string) => {
    const el = itemRefs.current.get(id);
    el?.focus();
  };

  // 処理された安全なindexをもとに、対応するidを取得してfocusする
  const navigateByIndex = (index: number) => {
    const clamped = clampIndex(index, enabledIds.length);
    const id = enabledIds[clamped];
    if (id) focusItemById(id);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (enabledIds.length === 0) return;

    const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
    const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";

    const currentIndex = focusedIndexRef.current;

    switch (event.key) {
      case nextKey: {
        event.preventDefault();
        const next = (currentIndex + 1) % enabledIds.length;
        focusedIndexRef.current = next;
        navigateByIndex(next);
        break;
      }
      case prevKey: {
        event.preventDefault();
        const prev =
          (currentIndex - 1 + enabledIds.length) % enabledIds.length;
        focusedIndexRef.current = prev;
        navigateByIndex(prev);
        break;
      }
      case "Home": {
        event.preventDefault();
        focusedIndexRef.current = 0;
        navigateByIndex(0);
        break;
      }
      case "End": {
        event.preventDefault();
        focusedIndexRef.current = enabledIds.length - 1;
        navigateByIndex(enabledIds.length - 1);
        break;
      }
    }
  };


  const getRootProps = (props:HTMLAttributes<HTMLElement>={}) => ({...props,onKeyDown:composeHandlers(props.onKeyDown,handleKeyDown)});
  const getItemProps = <TElement extends HTMLElement = HTMLButtonElement>(id:string,props:HTMLAttributes<TElement>&{ref?:Ref<TElement>}={}) => {
    const item=commandItems.find(item=>item.id===id);
    const disabled=!item || Boolean(item.disabled);
    return {...props, "aria-current":id===safeActiveId?"page" as const:undefined,"aria-disabled":disabled||undefined,
      tabIndex:id===safeActiveId?0:-1, disabled,
      onClick:composeHandlers(props.onClick,()=>{if(!item?.href)handleActivate(id);}),
      ref:mergeRefs(props.ref,(element:TElement|null)=>{if(element)itemRefs.current.set(id,element);else itemRefs.current.delete(id);})};
  };

return {items,safeActiveId,handleActivate,getRootProps,getItemProps,isCommand};
}
