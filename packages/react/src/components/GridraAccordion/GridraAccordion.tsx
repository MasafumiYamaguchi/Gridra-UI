import {
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

// 外部APIではsingle/multipleのどちらでも値を受け取れるため、内部処理の入口で扱いやすい形へ寄せる。
function normalizeToSingle(value: GridraAccordionValue): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value[0] ?? "";
  return "";
}
function normalizeToMultiple(value: GridraAccordionValue): string[] {
  if (typeof value === "string") return value ? [value] : [];
  return Array.isArray(value) ? value : [];
}

// 重複IDは最初のアイテムだけを有効扱いにし、開閉状態・focus移動・ARIAの参照先が分裂しないようにする。
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
  // キーボード操作で次のヘッダーへ直接focusするため、id単位でbutton要素を保持する。
  const headerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const validMap = useMemo(() => buildValidMap(items), [items]);

  // 開閉対象とキーボード移動対象を同じ定義にそろえ、disabled itemと重複IDの後続itemを除外する。
  const enabledIds = useMemo(
    () => items.filter((item) => !item.disabled && validMap.get(item.id) === item).map((item) => item.id),
    [items, validMap],
  );

  // defaultValueはitems/type変更で無効になり得るため、初期状態として安全なidだけに正規化する。
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

  // controlled valueも古いitemsを参照している可能性があるため、描画前に現在有効なidだけへ絞る。
  const resolvedValue = useMemo((): string[] => {
    if (type === "single") {
      const val = normalizeToSingle(rawValue);
      if (!val) return [];
      const resolved = validMap.get(val);
      if (resolved && !resolved.disabled) return [val];
      return [];
    }
    const arr = normalizeToMultiple(rawValue);
    return arr.filter((id) => {
      const resolved = validMap.get(id);
      return resolved && !resolved.disabled;
    });
  }, [type, rawValue, validMap]);

  // 描画ループでは各itemごとに開閉判定するため、Setにして存在チェックを安定させる。
  const openSet = useMemo(() => new Set(resolvedValue), [resolvedValue]);

  // singleでは常に1件だけを開く。collapsible=falseのときは開いているitemを再クリックしても閉じない。
  const toggleSingle = (id: string) => {
    if (openSet.has(id)) {
      if (collapsible) {
        setRawValue("");
      }
    } else {
      setRawValue(id);
    }
  };

  // multipleでは現在有効な開閉状態を基準に、対象idだけを追加/除外する。
  const toggleMultiple = (id: string) => {
    if (openSet.has(id)) {
      setRawValue(resolvedValue.filter((v) => v !== id));
    } else {
      setRawValue([...resolvedValue, id]);
    }
  };

  // UIイベント側はtype分岐を知らなくてよいよう、開閉ルールをここで集約する。
  const handleToggle = (id: string) => {
    if (type === "single") {
      toggleSingle(id);
    } else {
      toggleMultiple(id);
    }
  };

  // キーボード移動は開閉可否と同じenabledIdsを使い、操作できないitemへfocusしない。
  const handleHeaderKeyDown = (event: KeyboardEvent) => {
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

    if (handled && nextIndex >= 0 && nextIndex < enabledIds.length) {
      const nextId = enabledIds[nextIndex];
      headerRefs.current.get(nextId)?.focus();
    }
  };

  // 空配列でもroot classを返し、レイアウト上のプレースホルダーとして扱えるようにする。
  if (items.length === 0) {
    return (
      <div {...props} className={cx("gridra-accordion", `gridra-accordion--${variant}`, `gridra-accordion--${size}`, className)} />
    );
  }

  // 見た目の責務はvariant/size/classNameのclass合成に閉じ、開閉ロジックから分離する。
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
