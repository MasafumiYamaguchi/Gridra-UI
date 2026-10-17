import {useCallback,useEffect,useId,useRef,useState,type HTMLAttributes,type Ref} from "react";
import {useControllableValue} from "../useControllableValue";
import {composeHandlers} from "../internal/composeHandlers";
import {mergeRefs} from "../internal/mergeRefs";
import {useDocumentEvent} from "../internal/useDocumentEvent";
import {useFloatingPosition} from "../internal/useFloatingPosition";
export interface UseGridraPopoverOptions {open?:boolean;defaultOpen?:boolean;onOpenChange?:(next:boolean,previous:boolean)=>void;disabled?:boolean;closeOnEscape?:boolean;closeOnOutsidePointerDown?:boolean;placement?:"top"|"right"|"bottom"|"left";offset?:number}
/** 開閉、外側クリック、Escape、構造上の配置を管理する。 */
export function useGridraPopover({open,defaultOpen=false,onOpenChange,disabled=false,closeOnEscape=true,closeOnOutsidePointerDown=true,placement="bottom",offset=0}:UseGridraPopoverOptions={}){
  // childrenは表示内容ではなく、クリックで開閉するアンカー要素として扱う。
  const anchorRef = useRef<HTMLElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [currentOpen, setCurrentOpen] = useControllableValue(open, defaultOpen, onOpenChange);
  const [portalMounted, setPortalMounted] = useState(false);
  const popoverId = useId();

  useEffect(() => {
    // documentが存在するクライアント側でのみPortalを描画する。
    setPortalMounted(true);
  }, []);

  // アンカーとPopoverの実寸から、はみ出しを考慮した座標・向きを求める。
  const { coords, resolvedPlacement } = useFloatingPosition({
    anchorRef,
    disabled,
    floatingRef: popoverRef,
    offset,
    open: currentOpen,
    placement,
  });

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape && currentOpen) {
        event.preventDefault();
        setCurrentOpen(false);
      }
    },
    [closeOnEscape, currentOpen, setCurrentOpen],
  );

  useDocumentEvent("keydown", handleEscape, currentOpen);

  const handleOutsidePointerDown = useCallback(
    (event: PointerEvent) => {
      if (!closeOnOutsidePointerDown || !currentOpen) {
        return;
      }
      const target = event.target as Node | null;
      // アンカーまたはPopover内部の操作では閉じない。
      if (
        target &&
        !popoverRef.current?.contains(target) &&
        !anchorRef.current?.contains(target)
      ) {
        setCurrentOpen(false);
      }
    },
    [closeOnOutsidePointerDown, currentOpen, setCurrentOpen],
  );

  useDocumentEvent("pointerdown", handleOutsidePointerDown, currentOpen, true);

  const toggleOpen = () => {
    if (disabled) {
      return;
    }
    setCurrentOpen(!currentOpen);
  };


const getTriggerProps=<T extends HTMLElement=HTMLButtonElement>(props:HTMLAttributes<T>&{ref?:Ref<T>}={})=>({...props,"aria-controls":!disabled&&currentOpen?popoverId:undefined,"aria-expanded":!disabled?currentOpen:undefined,onClick:composeHandlers(props.onClick,toggleOpen),ref:mergeRefs(props.ref,(element:T|null)=>{anchorRef.current=element;})});
const getContentProps=(props:HTMLAttributes<HTMLDivElement>&{ref?:Ref<HTMLDivElement>}={})=>({...props,id:popoverId,ref:mergeRefs(props.ref,(element:HTMLDivElement|null)=>{popoverRef.current=element;}),style:{...props.style,position:"fixed" as const,top:coords.top,left:coords.left}});
return {currentOpen,portalMounted,anchorRef,popoverRef,popoverId,coords,resolvedPlacement,getTriggerProps,getContentProps,close:()=>setCurrentOpen(false)};
}
