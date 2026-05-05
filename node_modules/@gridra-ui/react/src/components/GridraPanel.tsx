import type { HTMLAttributes, ReactNode } from "react";

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
    .join(" ");

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
