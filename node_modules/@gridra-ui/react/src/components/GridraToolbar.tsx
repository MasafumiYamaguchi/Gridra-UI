import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export interface GridraToolbarAction {
  id: string;
  label: ReactNode;
  pressed?: boolean;
  disabled?: boolean;
}

export interface GridraToolbarProps extends HTMLAttributes<HTMLDivElement> {
  actions?: GridraToolbarAction[];
  onAction?: (id: string) => void;
  renderAction?: (action: GridraToolbarAction) => ReactNode;
}

export function GridraToolbar({
  actions = [],
  children,
  className,
  onAction,
  renderAction,
  ...props
}: GridraToolbarProps) {
  const toolbarClassName = ["gridra-toolbar", className].filter(Boolean).join(" ");

  return (
    <div className={toolbarClassName} role="toolbar" {...props}>
      {actions.map((action) =>
        renderAction ? (
          renderAction(action)
        ) : (
          <GridraToolbarButton
            key={action.id}
            aria-pressed={action.pressed}
            disabled={action.disabled}
            onClick={() => onAction?.(action.id)}
          >
            {action.label}
          </GridraToolbarButton>
        )
      )}
      {children}
    </div>
  );
}

export function GridraToolbarButton({
  className,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const buttonClassName = ["gridra-toolbar__button", className].filter(Boolean).join(" ");

  return <button className={buttonClassName} type={type} {...props} />;
}
