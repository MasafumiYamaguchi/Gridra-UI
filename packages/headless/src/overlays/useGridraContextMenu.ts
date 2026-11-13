import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type Ref,
} from "react";
import { clampNumber } from "@gridra-ui/core";
import { useControllableValue } from "../useControllableValue";
import { composeHandlers } from "../internal/composeHandlers";
import { mergeRefs } from "../internal/mergeRefs";
import { useMenuDismiss, useMenuNavigation } from "../internal/useMenuNavigation";
import type { GridraDropdownMenuItem } from "../menu/menuItems";

export interface UseGridraContextMenuOptions {
  items: GridraDropdownMenuItem[];
  onAction?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  disabled?: boolean;
  closeOnEscape?: boolean;
  closeOnOutsidePointerDown?: boolean;
  closeOnAction?: boolean;
}

/** 右クリック・キーボード起動とメニュー内の操作を管理する。 */
export function useGridraContextMenu({
  items,
  onAction,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  closeOnEscape = true,
  closeOnOutsidePointerDown = true,
  closeOnAction = true,
}: UseGridraContextMenuOptions) {
  const targetRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pointerCoordsRef = useRef({ top: 0, left: 0 });
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );
  const [coords, setCoords] = useState({ top: -9999, left: -9999 });
  const [portalMounted, setPortalMounted] = useState(false);
  const menuId = useId();

  // document.bodyへPortalするため、クライアントでmountされた後だけmenuを出す。
  useEffect(() => {
    setPortalMounted(true);
  }, []);

  // Context menuを閉じた後はtriggerへfocusを戻し、キーボード操作の復帰先を失わないようにする。
  const close = () => {
    setCurrentOpen(false);
    targetRef.current?.focus();
  };

  const {
    enabledIds,
    safeActiveIndex,
    setActiveIndex,
    activateItem,
    handleMenuKeyDown,
    getItemProps,
  } = useMenuNavigation({
    items,
    open: currentOpen,
    disabled,
    onAction,
    closeOnAction,
    close,
  });

  useMenuDismiss({
    open: currentOpen,
    closeOnEscape,
    closeOnOutsidePointerDown,
    menuRef,
    triggerRef: targetRef,
    close,
  });

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

      setCoords((previous) =>
        previous.top === nextTop && previous.left === nextLeft
          ? previous
          : { top: nextTop, left: nextLeft },
      );
    };

    updatePosition();
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(updatePosition);
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

  const getTargetProps = <T extends HTMLElement = HTMLButtonElement>(
    props: HTMLAttributes<T> & { ref?: Ref<T> } = {},
  ) => ({
    ...props,
    "aria-controls": currentOpen && !disabled ? menuId : undefined,
    "aria-expanded": !disabled ? currentOpen : undefined,
    "aria-haspopup": "menu" as const,
    onContextMenu: composeHandlers(props.onContextMenu, handleContextMenu),
    onKeyDown: composeHandlers(props.onKeyDown, handleKeyDown),
    ref: mergeRefs(props.ref, (element: T | null) => {
      targetRef.current = element;
    }),
  });

  const getMenuProps = (
    props: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> } = {},
  ) => ({
    ...props,
    id: menuId,
    role: "menu" as const,
    onKeyDown: composeHandlers(props.onKeyDown, handleMenuKeyDown),
    ref: mergeRefs(props.ref, (element: HTMLDivElement | null) => {
      menuRef.current = element;
    }),
    style: {
      ...props.style,
      position: "fixed" as const,
      top: coords.top,
      left: coords.left,
    },
  });

  return {
    currentOpen,
    portalMounted,
    targetRef,
    menuId,
    coords,
    enabledIds,
    safeActiveIndex,
    getTargetProps,
    getMenuProps,
    getItemProps,
    activateItem,
    close,
    openAt,
  };
}
