import {useCallback,useEffect,useId,useRef,useState,type HTMLAttributes,type Ref,type FocusEvent as ReactFocusEvent} from "react";
import {useControllableValue} from "../useControllableValue";
import {composeHandlers} from "../internal/composeHandlers";
import {mergeRefs} from "../internal/mergeRefs";
import {useDocumentEvent} from "../internal/useDocumentEvent";
import {useFloatingPosition} from "../internal/useFloatingPosition";
export interface UseGridraHoverCardOptions{open?:boolean;defaultOpen?:boolean;onOpenChange?:(next:boolean,previous:boolean)=>void;showDelay?:number;hideDelay?:number;disabled?:boolean;closeOnEscape?:boolean;placement?:"top"|"right"|"bottom"|"left";offset?:number}
/** hover/focusの移動、遅延開閉と配置を管理する。 */
export function useGridraHoverCard({open,defaultOpen=false,onOpenChange,showDelay=120,hideDelay=120,disabled=false,closeOnEscape=true,placement="bottom",offset=0}:UseGridraHoverCardOptions={}){
  const anchorRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  // show/hideの遅延処理をまたいでtimerIDを保持する。
  // 再レンダリングしても値を失わず、不要なタイマーを確実にクリアできるようにするため。
  const showTimerRef = useRef<number | null>(null);
  const hideTimerRef = useRef<number | null>(null);
  // open が渡された場合は controlled、未指定の場合は defaultOpen を初期値にした uncontrolled として扱う。
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );
  const [portalMounted, setPortalMounted] = useState(false);
  const cardId = useId();

  // hover/focus の出入りが短時間に連続しても古い show/hide 処理が残らないよう、両方のタイマーを解除する。
  const clearTimers = useCallback(() => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  // Portal の描画先は document に依存するため、クライアントでマウントされた後にだけ参照する。
  // SSR 時や初回レンダリング時に document へアクセスしないようにする。
  useEffect(() => {
    setPortalMounted(true);
    return clearTimers;
  }, [clearTimers]);

  // anchor と card の位置・サイズから表示座標を計算する。
  const { coords, resolvedPlacement } = useFloatingPosition({
    anchorRef,
    disabled,
    floatingRef: cardRef,
    offset,
    open: currentOpen,
    placement,
  });

  // 表示開始はhover/focus共通の入口にし、delay中に状態がぶつからないようtimerを一本化する。
  const startShow = useCallback(() => {
    if (disabled) {
      return;
    }
    clearTimers();
    showTimerRef.current = window.setTimeout(
      () => {
        setCurrentOpen(true);
        showTimerRef.current = null;
      },
      Math.max(0, showDelay),
    );
  }, [disabled, clearTimers, showDelay, setCurrentOpen]);

  // 非表示もmouse/focusの両方から呼ばれるため、即閉じせずhideDelayで操作の揺れを吸収する。
  const startHide = useCallback(() => {
    clearTimers();
    hideTimerRef.current = window.setTimeout(
      () => {
        setCurrentOpen(false);
        hideTimerRef.current = null;
      },
      Math.max(0, hideDelay),
    );
  }, [clearTimers, hideDelay, setCurrentOpen]);

  // Escapeなど明示的な閉じ操作ではdelayを待たず、残っているtimerも同時に破棄する。
  const closeImmediately = useCallback(() => {
    clearTimers();
    setCurrentOpen(false);
  }, [clearTimers, setCurrentOpen]);

  // card内へ入った時はhideだけを止め、すでに予約されたshowはclearTimers側で管理する。
  const cancelHide = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const handleEscape = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape && currentOpen) {
        event.preventDefault();
        closeImmediately();
      }
    },
    [closeOnEscape, currentOpen, closeImmediately],
  );

  // document listenerの登録/解除は共通hookへ寄せ、HoverCard本体は閉じる条件だけを持つ。
  useDocumentEvent("keydown", handleEscape, currentOpen);

  // focus が anchor と card の間を移動しただけの場合は HoverCard を閉じない。
  // relatedTarget が DOM Node でない場合もあるため、contains の前に型を確認する。
  const isWithinHoverCard = useCallback((target: EventTarget | null) => {
    if (!(target instanceof Node)) {
      return false;
    }
    return (
      anchorRef.current?.contains(target) === true ||
      cardRef.current?.contains(target) === true
    );
  }, []);

  // anchor から card 内へ focus が移った場合は、操作継続中として閉じない。
  const handleAnchorBlur = useCallback(
    (event: ReactFocusEvent<HTMLElement>) => {
      if (isWithinHoverCard(event.relatedTarget)) {
        cancelHide();
        return;
      }
      startHide();
    },
    [cancelHide, isWithinHoverCard, startHide],
  );

  const handleCardBlur = useCallback(
    (event: ReactFocusEvent<HTMLDivElement>) => {
      if (isWithinHoverCard(event.relatedTarget)) {
        cancelHide();
        return;
      }
      startHide();
    },
    [cancelHide, isWithinHoverCard, startHide],
  );


const getTriggerProps=<T extends HTMLElement=HTMLButtonElement>(props:HTMLAttributes<T>&{ref?:Ref<T>}={})=>({...props,"aria-controls":!disabled&&currentOpen?cardId:undefined,"aria-expanded":!disabled?currentOpen:undefined,"aria-haspopup":"dialog" as const,onBlur:composeHandlers(props.onBlur,handleAnchorBlur),onFocus:composeHandlers(props.onFocus,startShow),onMouseEnter:composeHandlers(props.onMouseEnter,startShow),onMouseLeave:composeHandlers(props.onMouseLeave,startHide),ref:mergeRefs(props.ref,(element:T|null)=>{anchorRef.current=element;})});
const getContentProps=(props:HTMLAttributes<HTMLDivElement>&{ref?:Ref<HTMLDivElement>}={})=>({...props,id:cardId,role:"dialog" as const,onFocus:composeHandlers(props.onFocus,cancelHide),onBlur:composeHandlers(props.onBlur,handleCardBlur),onMouseEnter:composeHandlers(props.onMouseEnter,cancelHide),onMouseLeave:composeHandlers(props.onMouseLeave,startHide),ref:mergeRefs(props.ref,(element:HTMLDivElement|null)=>{cardRef.current=element;}),style:{...props.style,position:"fixed" as const,top:coords.top,left:coords.left}});
return {currentOpen,portalMounted,anchorRef,cardRef,cardId,coords,resolvedPlacement,handleCardBlur,cancelHide,startHide,getTriggerProps,getContentProps,close:closeImmediately};
}
