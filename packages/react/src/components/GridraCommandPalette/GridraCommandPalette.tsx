import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useControllableValue } from "../../hooks/useControllableValue";
import { getGridraThemeClassName, getPortalTarget } from "../../internal/theme";
import { cx } from "../../internal/classNames";

export type GridraCommandPaletteSize = "sm" | "md" | "lg";

// Focus trap用: Tabキーで移動できる要素を取得するためのセレクタ
const FOCUSABLE_SELECTOR =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

// コマンドの意味を表すための識別子役割のためにstring型を用いている
export interface GridraCommandPaletteCommandItem {
  id: string;
  label: ReactNode;
  description?: ReactNode;
  group?: string;
  keywords?: string[];
  disabled?: boolean;
  destructive?: boolean;
}

// separatorにも安定したkeyを与えたい場合にidを指定できる
export type GridraCommandPaletteSeparatorItem = {
  type: "separator";
  id?: string;
};

export type GridraCommandPaletteItem =
  | GridraCommandPaletteCommandItem
  | GridraCommandPaletteSeparatorItem;

// HTML属性とぶつかるので、onChangeとtitleは除外する
export interface GridraCommandPaletteProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "title"
> {
  items: GridraCommandPaletteItem[];
  onAction?: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
  placeholder?: string;
  title?: ReactNode;
  emptyLabel?: ReactNode;
  size?: GridraCommandPaletteSize;
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (next: string, previous: string) => void;
  closeOnAction?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
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
  // 大文字小文字を区別せず、コマンドのlabel、description、group、keywordsに対して部分一致するかどうかで判定する
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

function clampIndex(index: number, itemCount: number) {
  return itemCount === 0 ? 0 : Math.max(0, Math.min(index, itemCount - 1));
}

export function GridraCommandPalette({
  className,
  closeOnAction = true,
  closeOnEscape = true,
  defaultOpen = false,
  defaultQuery = "",
  emptyLabel = "No commands found.",
  items,
  onAction,
  onOpenChange,
  onQueryChange,
  open,
  placeholder = "Search commands...",
  query,
  showCloseButton = true,
  size = "md",
  style,
  title = "Command Palette",
  ...props
}: GridraCommandPaletteProps) {
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
  // portal内でテーマクラスを適用するための状態。ダイアログが開かれるたびに更新する必要がある
  const [portalThemeClassName, setPortalThemeClassName] = useState<
    string | undefined
  >(() => getGridraThemeClassName());
  const titleId = useId();
  const inputId = useId();

  // SSR対策: クライアントでマウントされた後にPortalを表示する
  useEffect(() => {
    setPortalMounted(true);
  }, []);

  const commandItems = useMemo(() => items.filter(isCommand), [items]);

  // 3段階でフィルタリングする
  // 1. クエリにマッチするアイテムだけを残す
  const filteredCommands = useMemo(() => {
    if (!currentQuery) {
      return commandItems;
    }
    return commandItems.filter((item) => itemMatchesQuery(item, currentQuery));
  }, [commandItems, currentQuery]);
  // 2. フィルタリングされたアイテムの中から、disabledでないアイテムだけを残す
  const enabledFiltered = useMemo(
    () => filteredCommands.filter((item) => !item.disabled),
    [filteredCommands],
  );
  // 3. enabledなアイテムのidだけの配列を作る
  const enabledIds = useMemo(
    () => enabledFiltered.map((item) => item.id),
    [enabledFiltered],
  );

  const safeActiveIndex = clampIndex(activeIndex, enabledIds.length);

  // isQueryControlledがtrueの場合は、クエリは外部で管理されているため、コマンドパレット内部でクエリをリセットしないようにする
  const close = () => {
    setCurrentOpen(false);
    if (!isQueryControlled) {
      setCurrentQuery("");
    }
  };

  // 押したアイテムを有効なコマンドとして処理するための関数
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

    // コマンドパレットが閉じられたときに、前回フォーカスされていた要素にフォーカスを戻す
    return () => {
      const prev = previousFocusRef.current;
      if (prev && typeof prev.focus === "function") {
        prev.focus();
      }
      previousFocusRef.current = null;
      itemRefs.current.clear();
    };
  }, [currentOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [currentQuery]);

  // Portalはテーマ配下から外れるため、開くタイミングで現在のテーマクラスをbackdropへコピーする
  useLayoutEffect(() => {
    if (!currentOpen) {
      return;
    }
    setPortalThemeClassName(getGridraThemeClassName());
  }, [currentOpen]);

  const handleBackdropPointerDown = (event: React.PointerEvent) => {
    // もともとの要素(target)とモーダル(currentTarget)を比較している
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

      const focusable =
        dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
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

  const dialogClassName = cx(
    "gridra-command-palette",
    `gridra-command-palette--${size}`,
    className,
  );

  const backdropClassName = cx(
    "gridra-root",
    portalThemeClassName,
    "gridra-command-palette__backdrop",
  );
  const portalTarget = getPortalTarget();

  // reactのrenderでmap()するために配列に変換して返す
  // 表示時にgroupごとにmapできるよう、filteredCommandsをgroup単位にまとめる
  // 例: [["File", [item1, item2]], ["Edit", [item3]], ["", [item4]]]]
  const groups = useMemo(() => {
    const map = new Map<string, GridraCommandPaletteCommandItem[]>();
    for (const item of filteredCommands) {
      const key = item.group ?? "";
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [filteredCommands]);

  const hasGrouping = groups.some(([key]) => key !== "");

  return currentOpen && portalMounted && portalTarget
    ? createPortal(
        <div
          className={backdropClassName}
          onPointerDown={handleBackdropPointerDown}
        >
          <div
            {...props}
            aria-labelledby={titleId}
            aria-modal="true"
            className={dialogClassName}
            onKeyDown={handleKeyDown}
            ref={dialogRef}
            role="dialog"
            style={style}
          >
            <header className="gridra-command-palette__header">
              <h2 className="gridra-command-palette__title" id={titleId}>
                {title}
              </h2>
              {showCloseButton ? (
                <button
                  aria-label="Close"
                  className="gridra-command-palette__close"
                  onClick={close}
                  type="button"
                >
                  <span aria-hidden="true">×</span>
                </button>
              ) : null}
            </header>
            <div className="gridra-command-palette__search">
              <input
                autoComplete="off"
                className="gridra-command-palette__input"
                id={inputId}
                onChange={handleSearchChange}
                placeholder={placeholder}
                ref={inputRef}
                type="text"
                value={currentQuery}
              />
            </div>
            <div className="gridra-command-palette__list" ref={listRef}>
              {filteredCommands.length === 0 ? (
                <div className="gridra-command-palette__empty">
                  {emptyLabel}
                </div>
              ) : hasGrouping ? (
                groups.map(([group, groupItems]) => (
                  <div
                    className="gridra-command-palette__group"
                    key={group || "__ungrouped"}
                  >
                    {group ? (
                      <div className="gridra-command-palette__group-label">
                        {group}
                      </div>
                    ) : null}
                    {groupItems.map((item) => {
                      const isActive = enabledIds[safeActiveIndex] === item.id;
                      return (
                        <button
                          className={cx(
                            "gridra-command-palette__item",
                            item.disabled
                              ? "gridra-command-palette__item--disabled"
                              : null,
                            item.destructive
                              ? "gridra-command-palette__item--destructive"
                              : null,
                            isActive
                              ? "gridra-command-palette__item--active"
                              : null,
                          )}
                          disabled={item.disabled}
                          key={item.id}
                          onClick={() => activateItem(item.id)}
                          onMouseEnter={() => {
                            if (!item.disabled) {
                              const idx = enabledIds.indexOf(item.id);
                              if (idx !== -1) {
                                setActiveIndex(idx);
                              }
                            }
                          }}
                          ref={(el) => {
                            if (el) {
                              itemRefs.current.set(item.id, el);
                            } else {
                              itemRefs.current.delete(item.id);
                            }
                          }}
                          tabIndex={isActive ? 0 : -1}
                          type="button"
                        >
                          <span className="gridra-command-palette__item-label">
                            {item.label}
                          </span>
                          {item.description ? (
                            <span className="gridra-command-palette__item-desc">
                              {item.description}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                ))
              ) : (
                filteredCommands.map((item) => {
                  const isActive = enabledIds[safeActiveIndex] === item.id;
                  return (
                    <button
                      className={cx(
                        "gridra-command-palette__item",
                        item.disabled
                          ? "gridra-command-palette__item--disabled"
                          : null,
                        item.destructive
                          ? "gridra-command-palette__item--destructive"
                          : null,
                        isActive
                          ? "gridra-command-palette__item--active"
                          : null,
                      )}
                      disabled={item.disabled}
                      key={item.id}
                      onClick={() => activateItem(item.id)}
                      onMouseEnter={() => {
                        if (!item.disabled) {
                          const idx = enabledIds.indexOf(item.id);
                          if (idx !== -1) {
                            setActiveIndex(idx);
                          }
                        }
                      }}
                      ref={(el) => {
                        if (el) {
                          itemRefs.current.set(item.id, el);
                        } else {
                          itemRefs.current.delete(item.id);
                        }
                      }}
                      tabIndex={isActive ? 0 : -1}
                      type="button"
                    >
                      <span className="gridra-command-palette__item-label">
                        {item.label}
                      </span>
                      {item.description ? (
                        <span className="gridra-command-palette__item-desc">
                          {item.description}
                        </span>
                      ) : null}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>,
        portalTarget,
      )
    : null;
}
