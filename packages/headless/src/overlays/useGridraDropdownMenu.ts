import {
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type Ref,
} from "react";
import { useControllableValue } from "../useControllableValue";
import { composeHandlers } from "../internal/composeHandlers";
import { mergeRefs } from "../internal/mergeRefs";
import { useFloatingPosition } from "../internal/useFloatingPosition";
import {
  useMenuDismiss,
  useMenuNavigation,
  type MenuItemButtonProps,
} from "../internal/useMenuNavigation";
import type { GridraDropdownMenuItem } from "../menu/menuItems";

export interface UseGridraDropdownMenuOptions {
  items: GridraDropdownMenuItem[];
  onAction?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  disabled?: boolean;
  placement?: "top" | "right" | "bottom" | "left";
  offset?: number;
  closeOnEscape?: boolean;
  closeOnOutsidePointerDown?: boolean;
  closeOnAction?: boolean;
}

/** メニューの開閉・項目操作とキーボードフォーカスを共有する。 */
export function useGridraDropdownMenu({
  items,
  onAction,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  placement = "bottom",
  offset = 0,
  closeOnEscape = true,
  closeOnOutsidePointerDown = true,
  closeOnAction = true,
}: UseGridraDropdownMenuOptions) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );
  const [portalMounted, setPortalMounted] = useState(false);
  const menuId = useId();

  // document.bodyへPortalするため、SSR/初回renderではmenuを出さない。
  useEffect(() => {
    setPortalMounted(true);
  }, []);

  const close = () => {
    setCurrentOpen(false);
    triggerRef.current?.focus();
  };

  const {
    enabledIds,
    safeActiveIndex,
    setActiveIndex,
    activateItem,
    handleMenuKeyDown,
    getItemProps: getNavigationItemProps,
  } = useMenuNavigation({
    items,
    open: currentOpen,
    disabled,
    onAction,
    closeOnAction,
    close,
  });

  // 開くたびにactiveIndexを先頭へ戻し、前回hoverしていたitemへ誤ってfocusしないようにする。
  const openMenu = () => {
    if (disabled) {
      return;
    }

    setCurrentOpen(true);
    setActiveIndex(0);
  };

  const toggleOpen = () => {
    if (currentOpen) {
      close();
    } else {
      openMenu();
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

  useMenuDismiss({
    open: currentOpen,
    closeOnEscape,
    closeOnOutsidePointerDown,
    menuRef,
    triggerRef,
    close,
  });

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

  const getTriggerProps = <T extends HTMLElement = HTMLButtonElement>(
    props: HTMLAttributes<T> & { ref?: Ref<T> } = {},
  ) => ({
    ...props,
    "aria-controls": !disabled && currentOpen ? menuId : undefined,
    "aria-expanded": !disabled ? currentOpen : undefined,
    "aria-haspopup": "menu" as const,
    onClick: composeHandlers(props.onClick, toggleOpen),
    onKeyDown: composeHandlers(props.onKeyDown, handleTriggerKeyDown),
    ref: mergeRefs(props.ref, (element: T | null) => {
      triggerRef.current = element;
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

  // DropdownMenuのitemは従来どおりitemのidをDOMのidにも使う。
  const getItemProps = (
    id: string,
    props: MenuItemButtonProps = {},
  ): MenuItemButtonProps => ({
    ...getNavigationItemProps(id, props),
    id,
  });

  return {
    currentOpen,
    portalMounted,
    triggerRef,
    menuId,
    coords,
    resolvedPlacement,
    enabledIds,
    safeActiveIndex,
    getTriggerProps,
    getMenuProps,
    getItemProps,
    activateItem,
    close,
  };
}
