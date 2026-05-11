import type { HTMLAttributes, ReactNode } from "react";

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
  const panelClassName = ["gridra-panel", `gridra-panel--${position}`, className]
    .filter(Boolean)
    .join(" "); // クラス名を結合して、必要なスタイルを適用する

  return (
    <aside className={panelClassName} {...props}>
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
