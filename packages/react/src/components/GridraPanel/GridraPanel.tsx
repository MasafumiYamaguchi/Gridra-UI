import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";

// パネルのコンポーネントに必要なプロパティを定義するインターフェース
export interface GridraPanelProps extends HTMLAttributes<HTMLElement> {
  heading?: ReactNode;
  position?: "left" | "right";
  header?: ReactNode;
}

export function GridraPanel({
  children,
  className,
  heading,
  header,
  position = "left",
  ...props
}: GridraPanelProps) {
  return (
    <aside className={cx("gridra-panel", `gridra-panel--${position}`, className)} {...props}>
      {/* 見出しも追加ヘッダーもない場合は、空のヘッダー領域を作らない。 */}
      {(heading || header) && (
        <div className="gridra-panel__header">
          {heading && <h2 className="gridra-panel__title">{heading}</h2>}
          {header}
        </div>
      )}
      <div className="gridra-panel__body">{children}</div>
    </aside>
  );
}
