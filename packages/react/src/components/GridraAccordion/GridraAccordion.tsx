import {
  useCallback,
  useId,
  useMemo,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { useControllableValue } from "../../hooks/useControllableValue";
import { cx } from "../../internal/classNames";

export type GridraAccordionType = "single" | "multiple";
export type GridraAccordionSize = "sm" | "md" | "lg";
export type GridraAccordionVariant = "default" | "divided";
export type GridraAccordionValue = string | string[];

export interface GridraAccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface GridraAccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: GridraAccordionItem[];
  type?: GridraAccordionType;
  value?: GridraAccordionValue;
  defaultValue?: GridraAccordionValue;
  onValueChange?: (nextValue: GridraAccordionValue, previousValue: GridraAccordionValue) => void;
  collapsible?: boolean;
  size?: GridraAccordionSize;
  variant?: GridraAccordionVariant;
}

function normalizeToSingle(value: GridraAccordionValue): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}
function normalizeToMultiple(value: GridraAccordionValue): string[] {
  if (typeof value === "string") return value ? [value] : [];
  return Array.isArray(value) ? value : [];
}

// アイテムのIDをキー、アイテム自体を値とするマップを返す。重複するIDがある場合は最初のものが優先される
function buildValidMap(items: GridraAccordionItem[]) {
  const seen = new Map<string, GridraAccordionItem>();
  for (const item of items) {
    if (!seen.has(item.id)) {
      seen.set(item.id, item);
    }
  }
  return seen;
}

export function GridraAccordion({
  className,
  collapsible = false,
  defaultValue,
  items,
  onValueChange,
  size = "md",
  type = "single",
  value: valueProp,
  variant = "default",
  ...props
}: GridraAccordionProps) {
  const baseId = useId();
  const headerRefs = useRef<Map<string, HTMLButtonElement>>(new Map()); // ヘッダーボタンの参照を保持するためのMap

  const validMap = useMemo(() => buildValidMap(items), [items]);  // アイテムのIDを検証するためのマップを構築

  // 有効なアイテムのIDのみを抽出するための配列を作成
  const enabledIds = useMemo(
    () => items.filter((item) => !item.disabled && validMap.get(item.id) === item).map((item) => item.id),
    [items, validMap],
  );

  // defaultValueを現在のitems/typeに合わせて安全な値に変換する
  const sanitizedDefault = useMemo(() => {
    if (type === "single") {
      if (defaultValue !== undefined) { 
        const val = normalizeToSingle(defaultValue);
        if (val && validMap.has(val)) { 
          const resolved = validMap.get(val)!;
          if (!resolved.disabled) return val;
        }
        if (val && !validMap.has(val)) {  
          if (enabledIds.length > 0) return enabledIds[0];  
          return ""; 
        }
        return "";
      }
      if (enabledIds.length > 0) {
        return enabledIds[0]; 
      }
      return "";
    }

    if (defaultValue !== undefined) {
      const arr = normalizeToMultiple(defaultValue);
      return arr.filter((id) => {
        const resolved = validMap.get(id);
        return resolved && !resolved.disabled;
      });
    }
    return [];
  }, [type, defaultValue, validMap, enabledIds]);

  const [rawValue, setRawValue] = useControllableValue<GridraAccordionValue>(
    valueProp,
    sanitizedDefault,
    onValueChange,
  );

  // rawValueを正規化して、実際に開いているアイテムのIDの配列を作成する
  const resolvedValue = useMemo((): string[] => {
    if (type === "single") {  // typeが"single"の場合はrawValueを単一のIDとして処理する
      const val = normalizeToSingle(rawValue);
      if (!val) return [];
      const resolved = validMap.get(val);
      if (resolved && !resolved.disabled) return [val]; // rawValueが有効で、かつdisabledでない場合はそのIDを配列にして返す
      return [];
    }
    const arr = normalizeToMultiple(rawValue);  // typeが"multiple"の場合はrawValueを複数のIDの配列として処理する
    return arr.filter((id) => { // rawValueのIDが有効で、かつdisabledでない場合のみ返す
      const resolved = validMap.get(id);
      return resolved && !resolved.disabled;
    });
  }, [type, rawValue, validMap]);

  // resolvedValueをSetに変換して、開いているアイテムのIDの存在チェックを高速化する
  const openSet = useMemo(() => new Set(resolvedValue), [resolvedValue]);

  // 単一選択モードのトグル関数
  const toggleSingle = useCallback(
    (id: string) => {
      if (openSet.has(id)) {
        if (collapsible) {
          setRawValue("");  // idが存在していて、かつcollapsibleがtrueの場合は空文字をセットして全て閉じる
        }
      } else {
        setRawValue(id);  // idが存在していない場合はそのIDをセットして開く。単一選択モードなので、他のIDは自動的に閉じる
      }
    },
    [openSet, collapsible, setRawValue],
  );

  // 複数選択モードのトグル関数
  const toggleMultiple = useCallback(
    (id: string) => {
      if (openSet.has(id)) {
        setRawValue(resolvedValue.filter((v) => v !== id)); // idが存在している場合は、そのIDを除外した配列をセットして閉じる
      } else {
        setRawValue([...resolvedValue, id]);  // idが存在していない場合は、そのIDを追加した配列をセットして開く。複数選択モードなので、他のIDはそのまま維持される
      }
    },
    [openSet, resolvedValue, setRawValue],
  );

  // トグル関数
  const handleToggle = useCallback(
    (id: string) => {
      if (type === "single") {
        toggleSingle(id);
      } else {
        toggleMultiple(id);
      }
    },
    [type, toggleSingle, toggleMultiple],
  );

  // キーボード移動はenabledIdsだけを対象にし、disabled itemと重複idの後続itemを飛ばす。
  const handleHeaderKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const current = event.currentTarget as HTMLButtonElement;
      const currentIndex = enabledIds.indexOf(current.getAttribute("data-accordion-id") ?? "");

      let nextIndex = -1;
      let handled = false;

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          nextIndex = currentIndex + 1;
          handled = true;
          break;
        case "ArrowUp":
          event.preventDefault();
          nextIndex = currentIndex - 1;
          handled = true;
          break;
        case "Home":
          event.preventDefault();
          nextIndex = 0;
          handled = true;
          break;
        case "End":
          event.preventDefault();
          nextIndex = enabledIds.length - 1;
          handled = true;
          break;
      }

      // nextIndexが有効な範囲内であれば、対応するヘッダーボタンにフォーカスを移動する
      if (handled && nextIndex >= 0 && nextIndex < enabledIds.length) {
        const nextId = enabledIds[nextIndex];
        headerRefs.current.get(nextId)?.focus();
      }
    },
    [enabledIds],
  );

  // アイテムが空の場合は、基本的なクラス名だけを持つ空のコンテナを返す
  if (items.length === 0) {
    return (
      <div {...props} className={cx("gridra-accordion", `gridra-accordion--${variant}`, `gridra-accordion--${size}`, className)} />
    );
  }

  // ルート要素のクラス名を組み立てる。variant、size、classNameを条件に応じて追加する
  const rootClassName = cx(
    "gridra-accordion",
    `gridra-accordion--${variant}`,
    `gridra-accordion--${size}`,
    className,
  );

  return (
    <div {...props} className={rootClassName}>
      {items.map((item) => {
        const isDisabled = item.disabled ?? false;
        const isOpen = !isDisabled && openSet.has(item.id);
        const headerId = `${baseId}-header-${item.id}`;
        const panelId = `${baseId}-panel-${item.id}`;

        return (
          <div
            key={item.id}
            className={cx(
              "gridra-accordion__item",
              isDisabled ? "gridra-accordion__item--disabled" : null,
              isOpen ? "gridra-accordion__item--expanded" : null,
            )}
          >
            <button
              aria-controls={panelId}
              aria-disabled={isDisabled || undefined}
              aria-expanded={isOpen}
              className="gridra-accordion__header"
              data-accordion-id={item.id}
              disabled={isDisabled}
              id={headerId}
              onClick={() => {
                if (!isDisabled) handleToggle(item.id);
              }}
              onKeyDown={handleHeaderKeyDown}
              ref={(el) => {
                if (el) headerRefs.current.set(item.id, el);
                else headerRefs.current.delete(item.id);
              }}
              type="button"
            >
              <span className="gridra-accordion__title">{item.title}</span>
              <span aria-hidden="true" className="gridra-accordion__icon" />
            </button>
            {isOpen ? (
              <div
                aria-labelledby={headerId}
                className="gridra-accordion__panel"
                id={panelId}
                role="region"
              >
                <div className="gridra-accordion__panel-content">{item.content}</div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
