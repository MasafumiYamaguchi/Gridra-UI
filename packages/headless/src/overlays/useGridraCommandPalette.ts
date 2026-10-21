import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { useControllableValue } from "../useControllableValue";
import { getFocusableElements } from "../internal/focus";
import { composeHandlers } from "../internal/composeHandlers";
import { mergeRefs } from "../internal/mergeRefs";
import { clampIndex } from "@gridra-ui/core";

// idは選択状態・action通知・ref管理をつなぐ安定したコマンド識別子として使う。
export interface GridraCommandPaletteCommandItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  group?: string;
  keywords?: string[];
  disabled?: boolean;
  destructive?: boolean;
}

// separatorにも安定したkeyを与えたい場合があるため、任意idを許可する。
export type GridraCommandPaletteSeparatorItem = {
  type: "separator";
  id?: string;
};

export type GridraCommandPaletteItem =
  GridraCommandPaletteCommandItem | GridraCommandPaletteSeparatorItem;

export interface UseGridraCommandPaletteOptions {
  items: GridraCommandPaletteItem[];
  onAction?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (next: string, previous: string) => void;
  closeOnAction?: boolean;
  closeOnEscape?: boolean;
}

function isCommand(
  item: GridraCommandPaletteItem,
): item is GridraCommandPaletteCommandItem {
  return !("type" in item) || item.type !== "separator";
}

function itemMatchesQuery(
  item: GridraCommandPaletteCommandItem,
  query: string,
): boolean {
  if (!query) {
    return true;
  }

  // ReactNodeは完全なテキスト抽出をしない。検索対象は文字列として安全に読める範囲に限定する。
  const lower = query.toLowerCase();
  const fields = [
    getPlainSearchText(item.label),
    getPlainSearchText(item.description),
    item.group ?? "",
    ...(item.keywords ?? []),
  ];

  return fields.some((f) => f.toLowerCase().includes(lower));
}

function getPlainSearchText(value: ReactNode): string {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return "";
}

/** 検索・選択・モーダルのフォーカス制御を独自DOMでも利用できる。 */
export function useGridraCommandPalette({
  items,
  onAction,
  open,
  defaultOpen = false,
  onOpenChange,
  query,
  defaultQuery = "",
  onQueryChange,
  closeOnAction = true,
  closeOnEscape = true,
}: UseGridraCommandPaletteOptions) {
  const [currentOpen, setCurrentOpen] = useControllableValue(
    open,
    defaultOpen,
    onOpenChange,
  );
  const [currentQuery, setCurrentQuery] = useControllableValue(
    query,
    defaultQuery,
    onQueryChange,
  );
  // queryがcontrolledかどうかのフラグ
  const isQueryControlled = query !== undefined;
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [portalMounted, setPortalMounted] = useState(false);
  const titleId = useId();
  const inputId = useId();

  // document.bodyへPortalするため、SSR/初回renderでは描画先を参照しない。
  useEffect(() => {
    setPortalMounted(true);
  }, []);

  const commandItems = useMemo(() => items.filter(isCommand), [items]);

  // 表示対象、操作対象、focus対象を段階的に分けることでseparator/disabled itemを誤って実行しない。
  const filteredCommands = useMemo(() => {
    if (!currentQuery) {
      return commandItems;
    }

    return commandItems.filter((item) => itemMatchesQuery(item, currentQuery));
  }, [commandItems, currentQuery]);
  const enabledFiltered = useMemo(
    () => filteredCommands.filter((item) => !item.disabled),
    [filteredCommands],
  );
  const enabledIds = useMemo(
    () => enabledFiltered.map((item) => item.id),
    [enabledFiltered],
  );

  const safeActiveIndex = clampIndex(activeIndex, enabledIds.length);

  // queryがcontrolledの場合、閉じる時のリセット判断も呼び出し側の責務として残す。
  const close = () => {
    setCurrentOpen(false);
    if (!isQueryControlled) {
      setCurrentQuery("");
    }
  };

  // action実行前に現在のitemsから再解決し、disabled化されたコマンドを実行しない。
  const activateItem = (id: string) => {
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

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    setActiveIndex(0);

    inputRef.current?.focus();

    // Modalを閉じたあと、操作開始前のfocus位置へ戻してキーボード操作の文脈を保つ。
    return () => {
      const prev = previousFocusRef.current;
      if (prev && typeof prev.focus === "function") {
        prev.focus();
      }

      previousFocusRef.current = null;
    };
  }, [currentOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [currentQuery]);

  const handleBackdropPointerDown = (event: React.PointerEvent) => {
    // dialog内のクリックでは閉じず、backdrop自体を押した時だけ閉じる。
    if (event.target === event.currentTarget) {
      close();
    }
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

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [
    closeOnEscape,
    currentOpen,
    isQueryControlled,
    setCurrentOpen,
    setCurrentQuery,
  ]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentQuery(event.target.value);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      const dialog = dialogRef.current;
      if (!dialog) {
        return;
      }

      const focusable = getFocusableElements(dialog);
      if (focusable.length === 0) {
        event.preventDefault();
        event.stopPropagation();

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
      } else if (
        document.activeElement === last ||
        !dialog.contains(document.activeElement)
      ) {
        event.preventDefault();
        first.focus();
      }

      event.stopPropagation();

      return;
    }

    if (enabledIds.length === 0) {
      return;
    }

    let handled = true;

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        focusItemByIndex(safeActiveIndex + 1);
        break;
      }

      case "ArrowUp": {
        event.preventDefault();
        focusItemByIndex(safeActiveIndex - 1);
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

      case "Enter": {
        event.preventDefault();
        const activeId = enabledIds[safeActiveIndex];
        if (activeId) {
          activateItem(activeId);
        }

        break;
      }

      default:
        handled = false;
    }

    if (handled) {
      event.stopPropagation();
    }
  };

  const getItemProps = (
    id: string,
    props: ButtonHTMLAttributes<HTMLButtonElement> & {
      ref?: Ref<HTMLButtonElement>;
    } = {},
  ): ButtonHTMLAttributes<HTMLButtonElement> & {
    ref?: Ref<HTMLButtonElement>;
  } => {
    const item = filteredCommands.find((item) => item.id === id) ?? {
      id,
      label: null,
      disabled: true,
    };
    const isActive = enabledIds[safeActiveIndex] === id;

    return {
      ...props,
      "disabled": item.disabled,
      "onClick": composeHandlers(props.onClick, () => activateItem(item.id)),
      "onMouseEnter": composeHandlers(props.onMouseEnter, () => {
        if (!item.disabled) {
          const idx = enabledIds.indexOf(item.id);
          if (idx !== -1) {
            setActiveIndex(idx);
          }
        }
      }),
      "ref": mergeRefs(props.ref, (el) => {
        if (el) {
          itemRefs.current.set(item.id, el);
        } else {
          itemRefs.current.delete(item.id);
        }
      }),
      "tabIndex": isActive ? 0 : -1,
      "type": "button",
    };
  };

  const getInputProps = (
    props: InputHTMLAttributes<HTMLInputElement> & {
      ref?: Ref<HTMLInputElement>;
    } = {},
  ): InputHTMLAttributes<HTMLInputElement> & {
    ref?: Ref<HTMLInputElement>;
  } => {
    return {
      ...props,
      "autoComplete": "off",
      "id": inputId,
      "onChange": composeHandlers(props.onChange, handleSearchChange),
      "ref": mergeRefs(props.ref, (element: HTMLInputElement | null) => {
        inputRef.current = element;
      }),
      "type": "text",
      "value": currentQuery,
    };
  };

  const getDialogProps = (
    props: HTMLAttributes<HTMLDivElement> & { ref?: Ref<HTMLDivElement> } = {},
  ) => ({
    ...props,
    role: "dialog" as const,
    "aria-modal": true as const,
    "aria-labelledby": titleId,
    onKeyDown: composeHandlers(props.onKeyDown, handleKeyDown),
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

  return {
    currentOpen,
    currentQuery,
    portalMounted,
    dialogRef,
    inputRef,
    listRef,
    titleId,
    inputId,
    filteredCommands,
    enabledIds,
    safeActiveIndex,
    close,
    handleKeyDown,
    handleBackdropPointerDown,
    setOpen: setCurrentOpen,
    setQuery: setCurrentQuery,
    activateItem,
    getDialogProps,
    getBackdropProps,
    getItemProps,
    getInputProps,
  };
}
