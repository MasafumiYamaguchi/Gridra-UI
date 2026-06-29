import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";

export type GridraDescriptionListDensity = "compact" | "normal";

export interface GridraDescriptionListItem {
  description: ReactNode;
  key?: string;
  term: ReactNode;
}

export interface GridraDescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  density?: GridraDescriptionListDensity;
  items?: GridraDescriptionListItem[];
}

export function GridraDescriptionList({
  children,
  className,
  density = "normal",
  items,
  ...props
}: GridraDescriptionListProps) {
  // items指定時は一貫したdt/dd構造を生成し、children指定時は利用者が細かいマークアップを制御できる。
  const rootClassName = cx(
    "gridra-description-list",
    `gridra-description-list--${density}`,
    className,
  );

  return (
    <dl className={rootClassName} {...props}>
      {items
        ? items.map((item, index) => (
            <div
              className="gridra-description-list__item"
              key={item.key ?? index}
            >
              <dt className="gridra-description-list__term">{item.term}</dt>
              <dd className="gridra-description-list__description">
                {item.description}
              </dd>
            </div>
          ))
        : children}
    </dl>
  );
}
