import {useEffect,useId,useLayoutEffect,useMemo,useRef,useState,type ReactNode,type HTMLAttributes,type ButtonHTMLAttributes,type KeyboardEvent,type MouseEvent as ReactMouseEvent,type Ref} from "react";
import {useControllableValue} from "../useControllableValue";
import {composeHandlers} from "../internal/composeHandlers";
import {mergeRefs} from "../internal/mergeRefs";
import {clampIndex,clampNumber} from "@gridra-ui/core";
import type {GridraDropdownMenuItem} from "./useGridraDropdownMenu";
export interface UseGridraContextMenuOptions {items:GridraDropdownMenuItem[];onAction?:(id:string)=>void;open?:boolean;defaultOpen?:boolean;onOpenChange?:(next:boolean,previous:boolean)=>void;disabled?:boolean;closeOnEscape?:boolean;closeOnOutsidePointerDown?:boolean;closeOnAction?:boolean}
function isCommand(
  item: GridraDropdownMenuItem,
): item is Extract<GridraDropdownMenuItem, { id: string; label: ReactNode }> {
  return !("type" in item) || item.type !== "separator";
}


/** 右クリック・キーボード起動とメニュー内の操作を管理する。 */
export function useGridraContextMenu({items,onAction,open,defaultOpen=false,onOpenChange,disabled=false,closeOnEscape=true,closeOnOutsidePointerDown=true,closeOnAction=true}:UseGridraContextMenuOptions){
  const targetRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const pointerCoordsRef = useRef({ top: 0, left: 0 });
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );
  const [coords, setCoords] = useState({ top: -9999, left: -9999 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [portalMounted, setPortalMounted] = useState(false);
  const menuId = useId();

  // document.bodyへPortalするため、クライアントでmountされた後だけmenuを出す。
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

  // Context menuを閉じた後はtriggerへfocusを戻し、キーボード操作の復帰先を失わないようにする。
  const close = () => {
    setCurrentOpen(false);
    targetRef.current?.focus();
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

    if (enabledIds.length === 0) {
      return;
    }
    const firstId = enabledIds[0];
    const el = itemRefs.current.get(firstId);
    el?.focus();

  }, [currentOpen, JSON.stringify(enabledIds)]);

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
        !targetRef.current?.contains(target)
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

  useLayoutEffect(() => {
    if (!currentOpen) {
      return;
    }

    const updatePosition = () => {
      const menu = menuRef.current;
      if (!menu) {
        return;
      }

      const menuRect = menu.getBoundingClientRect();
      const rawTop = pointerCoordsRef.current.top;
      const rawLeft = pointerCoordsRef.current.left;

      // 右クリック位置を起点にしつつ、menu全体がviewport内に残るように座標を丸める。
      const nextLeft = clampNumber(
        rawLeft,
        0,
        Math.max(0, window.innerWidth - menuRect.width),
      );
      const nextTop = clampNumber(
        rawTop,
        0,
        Math.max(0, window.innerHeight - menuRect.height),
      );

      setCoords(previous => previous.top === nextTop && previous.left === nextLeft ? previous : { top: nextTop, left: nextLeft });
    };

    updatePosition();
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(updatePosition);
    if (menuRef.current) observer?.observe(menuRef.current);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [currentOpen, items]);

  const openAt = (clientX: number, clientY: number) => {
    if (disabled) {
      return;
    }
    pointerCoordsRef.current = { top: clientY, left: clientX };
    setActiveIndex(0);
    setCurrentOpen(true);
  };

  const handleContextMenu = (event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    openAt(event.clientX, event.clientY);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (disabled) {
      return;
    }

    const isContextMenuKey = event.key === "ContextMenu";
    const isShiftF10 = event.key === "F10" && event.shiftKey;

    if (isContextMenuKey || isShiftF10) {
      event.preventDefault();
      const target = targetRef.current;
      if (target) {
        const rect = target.getBoundingClientRect();
        // キーボード起動ではポインタ座標がないため、triggerの左下をmenu起点にする。
        openAt(rect.left, rect.bottom);
      }
    }
  };

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


const getTargetProps=<T extends HTMLElement=HTMLButtonElement>(props:HTMLAttributes<T>&{ref?:Ref<T>}={})=>({...props,"aria-controls":currentOpen&&!disabled?menuId:undefined,"aria-expanded":!disabled?currentOpen:undefined,"aria-haspopup":"menu" as const,onContextMenu:composeHandlers(props.onContextMenu,handleContextMenu),onKeyDown:composeHandlers(props.onKeyDown,handleKeyDown),ref:mergeRefs(props.ref,(element:T|null)=>{targetRef.current=element;})});
const getMenuProps=(props:HTMLAttributes<HTMLDivElement>&{ref?:Ref<HTMLDivElement>}={})=>({...props,id:menuId,role:"menu" as const,onKeyDown:composeHandlers(props.onKeyDown,handleMenuKeyDown),ref:mergeRefs(props.ref,(element:HTMLDivElement|null)=>{menuRef.current=element;}),style:{...props.style,position:"fixed" as const,top:coords.top,left:coords.left}});
const getItemProps=(id:string,props:ButtonHTMLAttributes<HTMLButtonElement>&{ref?:Ref<HTMLButtonElement>}={}):ButtonHTMLAttributes<HTMLButtonElement>&{ref?:Ref<HTMLButtonElement>}=>{const item=commandItems.find(item=>item.id===id)??{id,label:null,disabled:true};const isActive=enabledIds[safeActiveIndex]===item.id;return {...props,"disabled": item.disabled,
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
return {currentOpen,portalMounted,targetRef,menuRef,menuId,coords,enabledIds,safeActiveIndex,handleMenuKeyDown,isCommand,getTargetProps,getMenuProps,getItemProps,activateItem,close,openAt};
}
