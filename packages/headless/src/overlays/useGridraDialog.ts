import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent,
  type Ref,
  type RefObject,
  type ButtonHTMLAttributes,
} from "react";
import { useControllableValue } from "../useControllableValue";
import { composeHandlers } from "../internal/composeHandlers";
import { mergeRefs } from "../internal/mergeRefs";
import { FOCUSABLE_SELECTOR, trapTabFocus } from "../internal/focus";

export interface UseGridraDialogOptions {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  closeOnEscape?: boolean;
  closeOnBackdropPointerDown?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
  hasDescription?: boolean;
  /** dialog要素のid。省略時は自動生成し、triggerのaria-controlsも同じidを指す。 */
  id?: string;
}

/** モーダルの開閉、初期フォーカス、循環と復帰を管理する。 */
export function useGridraDialog({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnEscape = true,
  closeOnBackdropPointerDown = true,
  initialFocusRef,
  hasDescription = false,
  id,
}: UseGridraDialogOptions = {}) {
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

    // initialFocusRefを優先し、なければdialog内の最初の操作可能要素、それもなければdialog自体へfocusを移す。
    const dialog = dialogRef.current;
    const initialFocusTarget =
      initialFocusRef?.current ??
      dialog?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR) ??
      dialog;
    initialFocusTarget?.focus();

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

      // Tabはdialog内で循環させ、背後のページへfocusが抜けないようにする。
      const dialog = dialogRef.current;
      if (dialog) {
        trapTabFocus(dialog, event);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentOpen, closeOnEscape, setCurrentOpen]);

  const handleBackdropPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!closeOnBackdropPointerDown) {
      return;
    }

    // dialog内のpointerdownはbubbleしてくるため、backdrop自体を押した時だけ閉じる。
    if (event.target === event.currentTarget) {
      close();
    }
  };

  const generatedDialogId = useId();
  const dialogId = id ?? generatedDialogId;

  const getTriggerProps = <T extends HTMLElement = HTMLButtonElement>(
    props: HTMLAttributes<T> & { ref?: Ref<T> } = {},
  ) => ({
    ...props,
    "aria-controls": currentOpen ? dialogId : undefined,
    "aria-expanded": currentOpen,
    "aria-haspopup": "dialog" as const,
    onClick: composeHandlers(props.onClick, toggleOpen),
    ref: mergeRefs(props.ref, (element: T | null) => {
      triggerRef.current = element;
    }),
  });

  const getDialogProps = (
    props: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> } = {},
  ) => ({
    ...props,
    // triggerのaria-controlsと食い違わないよう、通常はoptionsのidで指定する。
    // 直接渡されたidも利用者の指定として上書きしない。
    id: props.id ?? dialogId,
    role: "dialog" as const,
    "aria-modal": true as const,
    "aria-labelledby": titleId,
    "aria-describedby": hasDescription ? descriptionId : undefined,
    tabIndex: props.tabIndex ?? -1,
    ref: mergeRefs(props.ref, (element: HTMLDivElement | null) => {
      dialogRef.current = element;
    }),
  });

  const getBackdropProps = (props: HTMLAttributes<HTMLDivElement> = {}) => ({
    ...props,
    onPointerDown: composeHandlers(
      props.onPointerDown,
      handleBackdropPointerDown,
    ),
  });

  const getCloseProps = (
    props: ButtonHTMLAttributes<HTMLButtonElement> = {},
  ) => ({
    ...props,
    type: "button" as const,
    onClick: composeHandlers(props.onClick, close),
  });

  return {
    currentOpen,
    portalMounted,
    triggerRef,
    dialogRef,
    titleId,
    descriptionId,
    close,
    getTriggerProps,
    getDialogProps,
    getBackdropProps,
    getCloseProps,
  };
}
