import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type Dispatch,
  type KeyboardEvent,
  type Ref,
  type SetStateAction,
} from "react";
import { clampIndex } from "@gridra-ui/core";
import { composeHandlers } from "./composeHandlers";
import { mergeRefs } from "./mergeRefs";
import {
  isCommand,
  type GridraDropdownMenuCommandItem,
  type GridraDropdownMenuItem,
} from "../menu/menuItems";

export type MenuItemButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  ref?: Ref<HTMLButtonElement>;
};

export interface UseMenuNavigationOptions {
  items: readonly GridraDropdownMenuItem[];
  /** menuが開いている間だけ、先頭の有効itemへfocusを移す。 */
  open: boolean;
  /** trueの間はitemを実行しない。 */
  disabled?: boolean;
  onAction?: (id: string) => void;
  closeOnAction?: boolean;
  /**
   * item実行後とTabでmenuを閉じる時に呼ぶ。
   * 閉じた後のfocus復帰先はtrigger（ボタンや右クリック対象）ごとに違うため、呼び出し側が決める。
   */
  close: () => void;
}

export interface UseMenuNavigationResult {
  /** separatorを除いたitem。disabledなitemも含む。 */
  commandItems: GridraDropdownMenuCommandItem[];
  /** focusと実行の対象になる、disabledでないitemのid。 */
  enabledIds: string[];
  /** enabledIdsの範囲に丸めたactiveIndex。 */
  safeActiveIndex: number;
  /** 開く時に先頭・末尾を選ぶなど、trigger側の都合でactiveIndexを決める時に使う。 */
  setActiveIndex: Dispatch<SetStateAction<number>>;
  focusItemByIndex: (index: number) => void;
  activateItem: (id: string) => void;
  handleMenuKeyDown: (event: KeyboardEvent) => void;
  getItemProps: (id: string, props?: MenuItemButtonProps) => MenuItemButtonProps;
}

/**
 * DropdownMenuとContextMenuに共通する、menu内の項目導出・activeIndex・キー操作・item getterをまとめる。
 * 開閉状態、triggerの扱い、menuの位置、Escapeと外側pointerdownは呼び出し側が持つ。
 */
export function useMenuNavigation({
  items,
  open,
  disabled = false,
  onAction,
  closeOnAction = true,
  close,
}: UseMenuNavigationOptions): UseMenuNavigationResult {
  const itemRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [activeIndex, setActiveIndex] = useState(0);

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

  // itemsをinline配列で渡されるとenabledIdsは毎render新しい配列になる。
  // 参照で依存すると毎render先頭へfocusが戻るため、id列の内容が同じなら同じ値になる文字列を依存に使う。
  // 区切りのNUL文字はidに含まれない前提で、id同士の連結が別の列と衝突しないようにしている。
  const enabledIdsKey = useMemo(() => enabledIds.join("\u0000"), [enabledIds]);

  const safeActiveIndex = clampIndex(activeIndex, enabledIds.length);

  const focusItemByIndex = (index: number) => {
    if (enabledIds.length === 0) {
      return;
    }

    const clamped = clampIndex(index, enabledIds.length);
    setActiveIndex(clamped);
    itemRefs.current.get(enabledIds[clamped])?.focus();
  };

  const activateItem = (id: string) => {
    if (disabled) {
      return;
    }

    const item = commandItems.find((command) => command.id === id);
    if (!item || item.disabled) {
      return;
    }

    onAction?.(id);
    if (closeOnAction) {
      close();
    }
  };

  useEffect(() => {
    if (!open || enabledIds.length === 0) {
      return;
    }

    itemRefs.current.get(enabledIds[0])?.focus();
    // enabledIdsの変化はenabledIdsKeyで検知する（上のコメント参照）。
  }, [open, enabledIdsKey]);

  useEffect(() => {
    if (!open) {
      return;
    }

    // 閉じた時（とunmount時）に、残ったitem要素への参照を手放す。
    // enabledIdsの変化でも消すと、同じcommitで付け直したrefまで消えてfocus移動が効かなくなるため、開閉だけを契機にする。
    const refs = itemRefs.current;

    return () => {
      refs.clear();
    };
  }, [open]);

  const handleMenuKeyDown = (event: KeyboardEvent) => {
    if (enabledIds.length === 0) {
      return;
    }

    let handled = true;

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        focusItemByIndex((safeActiveIndex + 1) % enabledIds.length);
        break;
      }

      case "ArrowUp": {
        event.preventDefault();
        focusItemByIndex(
          (safeActiveIndex - 1 + enabledIds.length) % enabledIds.length,
        );
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

      // Tabはfocusの移動先をブラウザに任せ、menuだけを閉じる。
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

  const getItemProps = (
    id: string,
    props: MenuItemButtonProps = {},
  ): MenuItemButtonProps => {
    // 一覧にないidは操作できないitemとして扱い、getterの呼び出し側で例外にしない。
    const item = commandItems.find((command) => command.id === id) ?? {
      id,
      disabled: true,
    };
    const isActive = enabledIds[safeActiveIndex] === item.id;

    return {
      ...props,
      disabled: item.disabled,
      onClick: composeHandlers(props.onClick, () => activateItem(item.id)),
      onMouseEnter: composeHandlers(props.onMouseEnter, () => {
        if (item.disabled) {
          return;
        }

        const index = enabledIds.indexOf(item.id);
        if (index !== -1) {
          setActiveIndex(index);
        }
      }),
      ref: mergeRefs<HTMLButtonElement>(props.ref, (element) => {
        if (element) {
          itemRefs.current.set(item.id, element);
        } else {
          itemRefs.current.delete(item.id);
        }
      }),
      role: "menuitem",
      tabIndex: isActive ? 0 : -1,
      type: "button",
    };
  };

  return {
    commandItems,
    enabledIds,
    safeActiveIndex,
    setActiveIndex,
    focusItemByIndex,
    activateItem,
    handleMenuKeyDown,
    getItemProps,
  };
}
