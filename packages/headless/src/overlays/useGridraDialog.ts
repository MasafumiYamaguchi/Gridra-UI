import {useEffect,useId,useRef,useState,type HTMLAttributes,type Ref,type RefObject,type ButtonHTMLAttributes} from "react";
import {useControllableValue} from "../useControllableValue";
import {composeHandlers} from "../internal/composeHandlers";
import {mergeRefs} from "../internal/mergeRefs";
import {FOCUSABLE_SELECTOR,getFocusableElements} from "../internal/focus";
export interface UseGridraDialogOptions{open?:boolean;defaultOpen?:boolean;onOpenChange?:(next:boolean,previous:boolean)=>void;closeOnEscape?:boolean;closeOnBackdropPointerDown?:boolean;initialFocusRef?:RefObject<HTMLElement|null>;hasDescription?:boolean}
/** モーダルの開閉、初期フォーカス、循環と復帰を管理する。 */
export function useGridraDialog({open,defaultOpen=false,onOpenChange,closeOnEscape=true,closeOnBackdropPointerDown=true,initialFocusRef,hasDescription=false}:UseGridraDialogOptions={}){
  const triggerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );
  const [portalMounted, setPortalMounted] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  // Portal先のdocument.bodyはクライアントでしか存在しないため、mount後にだけ描画する。
  useEffect(() => {
    setPortalMounted(true);
  }, []);

  const close = () => {
    setCurrentOpen(false);
  };

  const openDialog = () => {
    setCurrentOpen(true);
  };

  const toggleOpen = () => {
    if (currentOpen) {
      close();
    } else {
      openDialog();
    }
  };

  useEffect(() => {
    if (!currentOpen) {
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // initialFocusRefを優先し、なければdialog内の最初の操作可能要素へfocusを移す。
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else {
      const dialog = dialogRef.current;
      if (dialog) {
        const focusable = dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable) {
          focusable.focus();
        } else {
          dialog.focus();
        }
      }
    }

    return () => {
      // 閉じた後は開く前のfocus、なければtriggerへ戻して操作の文脈を保つ。
      const prev = previousFocusRef.current;
      if (prev && typeof prev.focus === "function") {
        prev.focus();
      } else {
        triggerRef.current?.focus();
      }
      previousFocusRef.current = null;
    };
  }, [currentOpen, initialFocusRef]);

  useEffect(() => {
    if (!currentOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && closeOnEscape) {
        event.preventDefault();
        setCurrentOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      // Tabはdialog内で循環させ、背後のページへfocusが抜けないようにする。
      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      const focusable = getFocusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (
          document.activeElement === first ||
          !dialog.contains(document.activeElement)
        ) {
          event.preventDefault();
          last.focus();
        }
      } else {
        if (
          document.activeElement === last ||
          !dialog.contains(document.activeElement)
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentOpen, closeOnEscape, setCurrentOpen]);

  const handleBackdropPointerDown = (event: React.PointerEvent) => {
    if (!closeOnBackdropPointerDown) {
      return;
    }
    if (event.target === event.currentTarget) {
      close();
    }
  };


const dialogId=useId();
const getTriggerProps=<T extends HTMLElement=HTMLButtonElement>(props:HTMLAttributes<T>&{ref?:Ref<T>}={})=>({...props,"aria-controls":currentOpen?dialogId:undefined,"aria-expanded":currentOpen,"aria-haspopup":"dialog" as const,onClick:composeHandlers(props.onClick,toggleOpen),ref:mergeRefs(props.ref,(element:T|null)=>{triggerRef.current=element;})});
const getDialogProps=(props:HTMLAttributes<HTMLDivElement>&{ref?:Ref<HTMLDivElement>}={})=>({...props,id:dialogId,role:"dialog" as const,"aria-modal":true as const,"aria-labelledby":titleId,"aria-describedby":hasDescription?descriptionId:undefined,tabIndex:props.tabIndex??-1,ref:mergeRefs(props.ref,(element:HTMLDivElement|null)=>{dialogRef.current=element;})});
const getBackdropProps=(props:HTMLAttributes<HTMLDivElement>={})=>({...props,onPointerDown:composeHandlers(props.onPointerDown,handleBackdropPointerDown)});
const getCloseProps=(props:ButtonHTMLAttributes<HTMLButtonElement>={})=>({...props,type:"button" as const,onClick:composeHandlers(props.onClick,close)});
return {currentOpen,portalMounted,triggerRef,dialogRef,titleId,descriptionId,close,handleBackdropPointerDown,getTriggerProps,getDialogProps,getBackdropProps,getCloseProps};
}
