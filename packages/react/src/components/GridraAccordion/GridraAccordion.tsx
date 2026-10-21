import type { HTMLAttributes, ReactNode } from "react";
import {
  useGridraAccordion,
  type UseGridraAccordionOptions,
} from "@gridra-ui/headless";
import { cx } from "../../internal/classNames";

export type {
  GridraAccordionType,
  GridraAccordionValue,
} from "@gridra-ui/headless";

export type GridraAccordionSize = "sm" | "md" | "lg";

export type GridraAccordionVariant = "default" | "divided";

export interface GridraAccordionItem {
  id: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface GridraAccordionProps
  extends
    Omit<HTMLAttributes<HTMLDivElement>, "defaultValue">,
    UseGridraAccordionOptions<GridraAccordionItem> {
  items: GridraAccordionItem[];
  size?: GridraAccordionSize;
  variant?: GridraAccordionVariant;
}

/** 振る舞いはheadlessに委譲し、Gridraの見出し・アイコン・余白を描画する。 */
export function GridraAccordion({
  className,
  collapsible,
  defaultValue,
  items,
  onValueChange,
  size = "md",
  type = "single",
  value,
  variant = "default",
  ...props
}: GridraAccordionProps) {
  const accordion = useGridraAccordion({
    items,
    type,
    value,
    defaultValue,
    onValueChange,
    collapsible,
  });

  return (
    <div
      {...props}
      className={cx(
        "gridra-accordion",
        `gridra-accordion--${variant}`,
        `gridra-accordion--${size}`,
        className,
      )}
    >
      {accordion.items.map((item) => {
        const isOpen = accordion.isExpanded(item.id);

        return (
          <div
            key={item.id}
            className={cx(
              "gridra-accordion__item",
              item.disabled && "gridra-accordion__item--disabled",
              isOpen && "gridra-accordion__item--expanded",
            )}
          >
            <button
              {...accordion.getTriggerProps(item.id, {
                className: "gridra-accordion__header",
              })}
              data-accordion-id={item.id}
            >
              <span className="gridra-accordion__title">{item.title}</span>
              <span aria-hidden="true" className="gridra-accordion__icon" />
            </button>
            {isOpen ? (
              <div
                {...accordion.getPanelProps(item.id, {
                  className: "gridra-accordion__panel",
                })}
              >
                <div className="gridra-accordion__panel-content">
                  {item.content}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
