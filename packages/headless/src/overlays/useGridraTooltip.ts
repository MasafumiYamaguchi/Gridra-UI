import {useEffect,useId,useRef,useState,type HTMLAttributes,type Ref} from "react";
import {useControllableValue} from "../useControllableValue";
import {composeHandlers} from "../internal/composeHandlers";
import {mergeRefs} from "../internal/mergeRefs";
import {useFloatingPosition} from "../internal/useFloatingPosition";
export interface UseGridraTooltipOptions{open?:boolean;defaultOpen?:boolean;onOpenChange?:(next:boolean,previous:boolean)=>void;showDelay?:number;disabled?:boolean;placement?:"top"|"right"|"bottom"|"left";offset?:number}
/** 遅延表示とhover/focusの意味属性を提供する。 */
export function useGridraTooltip({open,defaultOpen=false,onOpenChange,showDelay=120,disabled=false,placement="top",offset=0}:UseGridraTooltipOptions={}){
  // childrenはTooltipを表示するきっかけとなるアンカー要素として扱う。
  const anchorRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const [currentOpen, setCurrentOpen] = useControllableValue(open, defaultOpen, onOpenChange);
  const [portalMounted, setPortalMounted] = useState(false);
  const tooltipId = useId();

  useEffect(() => {
    // documentが使えるクライアント側でのみPortalを許可する。
    setPortalMounted(true);
    return () => {
      // 表示待ちのまま破棄された場合に、遅延コールバックがstateを更新しないようにする。
      if (openTimerRef.current !== null) {
        window.clearTimeout(openTimerRef.current);
      }
    };
  }, []);

  // アンカーとTooltipの実寸から、画面内に収まる座標と向きを求める。
  const { coords, resolvedPlacement } = useFloatingPosition({
    anchorRef,
    disabled,
    floatingRef: tooltipRef,
    offset,
    open: currentOpen,
    placement,
  });

  const openWithDelay = () => {
    if (disabled) {
      return;
    }
    if (openTimerRef.current !== null) {
      // hoverとfocusが連続しても、表示タイマーを重複させない。
      window.clearTimeout(openTimerRef.current);
    }
    openTimerRef.current = window.setTimeout(() => {
      setCurrentOpen(true);
      openTimerRef.current = null;
    }, Math.max(0, showDelay));
  };

  const closeImmediately = () => {
    // 表示前に離れた場合は待機タイマーも取り消す。
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    setCurrentOpen(false);
  };


const getTriggerProps=<T extends HTMLElement=HTMLButtonElement>(props:HTMLAttributes<T>&{ref?:Ref<T>}={})=>({...props,"aria-describedby":!disabled&&currentOpen?[props["aria-describedby"],tooltipId].filter(Boolean).join(" "):props["aria-describedby"],onMouseEnter:composeHandlers(props.onMouseEnter,openWithDelay),onMouseLeave:composeHandlers(props.onMouseLeave,closeImmediately),onFocus:composeHandlers(props.onFocus,openWithDelay),onBlur:composeHandlers(props.onBlur,closeImmediately),ref:mergeRefs(props.ref,(element:T|null)=>{anchorRef.current=element;})});
const getContentProps=(props:HTMLAttributes<HTMLDivElement>&{ref?:Ref<HTMLDivElement>}={})=>({...props,id:tooltipId,role:"tooltip" as const,ref:mergeRefs(props.ref,(element:HTMLDivElement|null)=>{tooltipRef.current=element;}),style:{...props.style,position:"fixed" as const,top:coords.top,left:coords.left}});
return {currentOpen,portalMounted,anchorRef,tooltipRef,tooltipId,coords,resolvedPlacement,getTriggerProps,getContentProps,close:closeImmediately};
}
