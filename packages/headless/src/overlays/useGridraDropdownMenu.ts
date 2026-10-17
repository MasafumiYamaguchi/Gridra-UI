import {useEffect,useId,useMemo,useRef,useState,type ReactNode,type HTMLAttributes,type ButtonHTMLAttributes,type KeyboardEvent,type Ref} from "react";
import {useControllableValue} from "../useControllableValue";
import {composeHandlers} from "../internal/composeHandlers";
import {mergeRefs} from "../internal/mergeRefs";
import {useFloatingPosition} from "../internal/useFloatingPosition";
import {clampIndex} from "@gridra-ui/core";
export type GridraDropdownMenuCommandItem = {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  destructive?: boolean;
};

export type GridraDropdownMenuSeparatorItem = {
  type: "separator";
  id?: string;
};

export type GridraDropdownMenuItem =
  | GridraDropdownMenuCommandItem
  | GridraDropdownMenuSeparatorItem;


export interface UseGridraDropdownMenuOptions {items:GridraDropdownMenuItem[];onAction?:(id:string)=>void;open?:boolean;defaultOpen?:boolean;onOpenChange?:(next:boolean,previous:boolean)=>void;disabled?:boolean;placement?:"top"|"right"|"bottom"|"left";offset?:number;closeOnEscape?:boolean;closeOnOutsidePointerDown?:boolean;closeOnAction?:boolean}
function isCommand(
  item: GridraDropdownMenuItem,
): item is GridraDropdownMenuCommandItem {
  return !("type" in item) || item.type !== "separator";
}


/** メニューの開閉・項目操作とキーボードフォーカスを共有する。 */
export function useGridraDropdownMenu({items,onAction,open,defaultOpen=false,onOpenChange,disabled=false,placement="bottom",offset=0,closeOnEscape=true,closeOnOutsidePointerDown=true,closeOnAction=true}:UseGridraDropdownMenuOptions){
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [portalMounted, setPortalMounted] = useState(false);
  const menuId = useId();

  // document.bodyへPortalするため、SSR/初回renderではmenuを出さない。
  useEffect(() => {
    setPortalMounted(true);
  }, []);

  // separatorを描画対象に残しつつ、実行・focus対象はcommand itemだけに限定する。
  const commandItems = useMemo(() => items.filter(isCommand), [items]);
  const enabledItems = useMemo(
    () => commandItems.filter((item) => !item.disabled),
    [commandItems],
  );
  const enabledIds = useMemo(
    () => enabledItems.map((item) => item.id),
    [enabledItems],
  );

  const safeActiveIndex = clampIndex(activeIndex, enabledIds.length);

  // 開くたびにactiveIndexを先頭へ戻し、前回hoverしていたitemへ誤ってfocusしないようにする。
  const openMenu = () => {
    if (disabled) {
      return;
    }
    setCurrentOpen(true);
    setActiveIndex(0);
  };

  const close = () => {
    setCurrentOpen(false);
    triggerRef.current?.focus();
  };

  const toggleOpen = () => {
    if (currentOpen) {
      close();
    } else {
      openMenu();
    }
  };

  const activateItem = (id: string) => {
    if (disabled) {
      return;
    }
    const item = commandItems.find((c) => c.id === id);
    if (!item || item.disabled) {
      return;
    }
    onAction?.(id);
    if (closeOnAction) {
      close();
    }
  };

  // anchor基準の位置計算は共通hookに寄せ、DropdownMenu本体は開閉・focus・actionに集中する。
  const { coords, resolvedPlacement } = useFloatingPosition({
    alignment: "start",
    anchorRef: triggerRef,
    disabled,
    floatingRef: menuRef,
    offset,
    open: currentOpen,
    placement,
  });

  useEffect(() => {
    if (!currentOpen) {
      return;
    }

    if (enabledIds.length === 0) {
      return;
    }
    const firstId = enabledIds[0];
    const el = itemRefs.current.get(firstId);
    el?.focus();

  }, [currentOpen, JSON.stringify(enabledIds)]);

  const focusItemByIndex = (index: number) => {
    if (enabledIds.length === 0) {
      return;
    }
    const clamped = clampIndex(index, enabledIds.length);
    setActiveIndex(clamped);
    const id = enabledIds[clamped];
    const el = itemRefs.current.get(id);
    el?.focus();
  };

  useEffect(() => {
    if (!currentOpen) {
      return;
    }

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        close();
      }
    };

    const handleOutsidePointerDown = (event: PointerEvent) => {
      if (!closeOnOutsidePointerDown) {
        return;
      }
      const target = event.target as Node | null;
      if (
        target &&
        !menuRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        close();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("pointerdown", handleOutsidePointerDown, true);
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener(
        "pointerdown",
        handleOutsidePointerDown,
        true,
      );
    };
  }, [closeOnEscape, closeOnOutsidePointerDown, currentOpen, setCurrentOpen]);

  const handleMenuKeyDown = (event: KeyboardEvent) => {
    if (enabledIds.length === 0) {
      return;
    }

    let handled = true;

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const nextIndex = (safeActiveIndex + 1) % enabledIds.length;
        focusItemByIndex(nextIndex);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prevIndex =
          (safeActiveIndex - 1 + enabledIds.length) % enabledIds.length;
        focusItemByIndex(prevIndex);
        break;
      }
      case "Home": {
        event.preventDefault();
        focusItemByIndex(0);
        break;
      }
      case "End": {
        event.preventDefault();
        focusItemByIndex(enabledIds.length - 1);
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        const activeId = enabledIds[safeActiveIndex];
        if (activeId) {
          activateItem(activeId);
        }
        break;
      }
      case "Tab": {
        close();
        break;
      }
      default:
        handled = false;
    }

    if (handled) {
      event.stopPropagation();
    }
  };

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
      case "Enter":
      case " ": {
        event.preventDefault();
        if (!currentOpen) {
          openMenu();
        }
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        if (!currentOpen) {
          openMenu();
          setActiveIndex(enabledIds.length > 0 ? enabledIds.length - 1 : 0);
        }
        break;
      }
      default:
        break;
    }
  };


const getTriggerProps=<T extends HTMLElement=HTMLButtonElement>(props:HTMLAttributes<T>&{ref?:Ref<T>}={})=>({...props,"aria-controls":!disabled&&currentOpen?menuId:undefined,"aria-expanded":!disabled?currentOpen:undefined,"aria-haspopup":"menu" as const,onClick:composeHandlers(props.onClick,toggleOpen),onKeyDown:composeHandlers(props.onKeyDown,handleTriggerKeyDown),ref:mergeRefs(props.ref,(element:T|null)=>{triggerRef.current=element;})});
const getMenuProps=(props:HTMLAttributes<HTMLDivElement>&{ref?:Ref<HTMLDivElement>}={})=>({...props,id:menuId,role:"menu" as const,onKeyDown:composeHandlers(props.onKeyDown,handleMenuKeyDown),ref:mergeRefs(props.ref,(element:HTMLDivElement|null)=>{menuRef.current=element;}),style:{...props.style,position:"fixed" as const,top:coords.top,left:coords.left}});
const getItemProps=(id:string,props:ButtonHTMLAttributes<HTMLButtonElement>&{ref?:Ref<HTMLButtonElement>}={}):ButtonHTMLAttributes<HTMLButtonElement>&{ref?:Ref<HTMLButtonElement>}=>{const item=commandItems.find(item=>item.id===id)??{id,label:null,disabled:true};const isActive=enabledIds[safeActiveIndex]===item.id;return {...props,"disabled": item.disabled,
"id": item.id,
"onClick": composeHandlers(props.onClick, () => activateItem(item.id)),
"onMouseEnter": composeHandlers(props.onMouseEnter, () => {
                      if (!item.disabled) {
                        const idx = enabledIds.indexOf(item.id);
                        if (idx !== -1) {
                          setActiveIndex(idx);
                        }
                      }
                    }),
"ref": mergeRefs<HTMLButtonElement>(props.ref,(el) => {
                      if (el) {
                        itemRefs.current.set(item.id, el);
                      } else {
                        itemRefs.current.delete(item.id);
                      }
                    }),
"role": "menuitem",
"tabIndex": isActive ? 0 : -1,
"type": "button"};};
return {currentOpen,portalMounted,triggerRef,menuRef,menuId,coords,resolvedPlacement,enabledIds,safeActiveIndex,handleMenuKeyDown,isCommand,getTriggerProps,getMenuProps,getItemProps,activateItem,close};
}
