import { useGridraCommandPalette } from "@gridra-ui/headless";
import type { GridraThemeName } from "../../theme";
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
import { useControllableValue } from "@gridra-ui/headless";
import { cx } from "../../internal/classNames";
import { getFocusableElements } from "@gridra-ui/headless";
import { clampIndex } from "@gridra-ui/core";
import { getPortalTarget } from "../../internal/theme";
import { useGridraPortalTheme } from "../../internal/portalTheme";

export type GridraCommandPaletteSize = "sm" | "md" | "lg";

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

// HTML属性とぶつかるonChange/titleは、検索queryと見出しの意味に合わせて独自propsとして定義する。
export interface GridraCommandPaletteProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onChange" | "title"
> {
  theme?: GridraThemeName;
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
  theme,
  ...props
}: GridraCommandPaletteProps) {
  const {
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
    getInputProps,
    getItemProps,
    getDialogProps,
  } = useGridraCommandPalette({
    items,
    onAction,
    open,
    defaultOpen,
    onOpenChange,
    query,
    defaultQuery,
    onQueryChange,
    closeOnAction,
    closeOnEscape,
  });
  const portalTheme = useGridraPortalTheme(
    undefined,
    theme,
    currentOpen && portalMounted,
  );
  const dialogClassName = cx(
    "gridra-command-palette",
    `gridra-command-palette--${size}`,
    className,
  );

  const backdropClassName = cx(
    "gridra-portal-root",
    portalTheme.className,
    "gridra-command-palette__backdrop",
  );
  const portalTarget = getPortalTarget();

  // グループ表示は描画構造だけの責務。検索・disabled判定済みのfilteredCommandsを並べ替えずにまとめる。
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
          style={portalTheme.style}
          onPointerDown={handleBackdropPointerDown}
        >
          <div
            {...getDialogProps(props)}
            className={dialogClassName}
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
                {...getInputProps({ placeholder })}
                className="gridra-command-palette__input"
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
                          {...getItemProps(item.id)}
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

                          key={item.id}
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
                      {...getItemProps(item.id)}
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

                      key={item.id}
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
