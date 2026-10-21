import type { HTMLAttributes, ReactNode } from "react";
import { useGridraTabs, type UseGridraTabsOptions } from "@gridra-ui/headless";
import { cx } from "../../internal/classNames";

export type {
  GridraTabsOrientation,
  GridraTabsActivationMode,
} from "@gridra-ui/headless";
export type GridraTabsSize = "sm" | "md" | "lg";
export type GridraTabsVariant = "line" | "boxed";

export interface GridraTabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface GridraTabsProps
  extends HTMLAttributes<HTMLDivElement>, UseGridraTabsOptions<GridraTabItem> {
  items: GridraTabItem[];
  size?: GridraTabsSize;
  variant?: GridraTabsVariant;
}

/** 振る舞いはheadlessに委譲し、GridraのDOM構造と装飾を適用する。 */
export function GridraTabs({
  className,
  activationMode,
  defaultSelectedId,
  items,
  onSelectionChange,
  orientation = "horizontal",
  selectedId,
  size = "md",
  variant = "line",
  ...props
}: GridraTabsProps) {
  const tabs = useGridraTabs({
    items,
    selectedId,
    defaultSelectedId,
    onSelectionChange,
    orientation,
    activationMode,
  });

  return (
    <div
      {...props}
      className={cx(
        "gridra-tabs",
        `gridra-tabs--${orientation}`,
        `gridra-tabs--${variant}`,
        `gridra-tabs--${size}`,
        className,
      )}
    >
      <div {...tabs.getTabListProps({ className: "gridra-tabs__list" })}>
        {tabs.items.map((item) => (
          <button
            key={item.id}
            {...tabs.getTabProps(item.id, {
              className: cx(
                "gridra-tabs__tab",
                item.disabled && "gridra-tabs__tab--disabled",
                item.id === tabs.selectedId && "gridra-tabs__tab--selected",
              ),
            })}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tabs.selectedItem ? (
        <div
          {...tabs.getPanelProps(tabs.selectedItem.id, {
            className: "gridra-tabs__panel",
          })}
        >
          {tabs.selectedItem.content}
        </div>
      ) : null}
    </div>
  );
}
