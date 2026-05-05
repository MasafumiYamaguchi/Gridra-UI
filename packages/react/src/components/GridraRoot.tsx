import type { HTMLAttributes, ReactNode } from "react";

export interface GridraRootProps extends HTMLAttributes<HTMLDivElement> {
  panel?: ReactNode;
  panelPosition?: "left" | "right";
}

export function GridraRoot({
  children,
  className,
  panel,
  panelPosition = "left",
  ...props
}: GridraRootProps) {
  const rootClassName = ["gridra-root", className].filter(Boolean).join(" ");
  const shellClassName = [
    "gridra-root__shell",
    panel ? `gridra-root__shell--${panelPosition}` : null
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName} {...props}>
      <div className={shellClassName}>
        {panel && panelPosition === "left" ? panel : null}
        <main className="gridra-main">{children}</main>
        {panel && panelPosition === "right" ? panel : null}
      </div>
    </div>
  );
}
