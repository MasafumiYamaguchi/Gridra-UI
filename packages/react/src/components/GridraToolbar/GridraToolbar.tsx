import { Fragment, type HTMLAttributes, type ReactNode } from "react";
import { GridraButton, type GridraButtonProps } from "../GridraButton";

export interface GridraToolbarAction {
  id: string;
  label: ReactNode;
  pressed?: boolean;
  disabled?: boolean;
}

export interface GridraToolbarProps extends HTMLAttributes<HTMLDivElement> {
  actions?: GridraToolbarAction[];
  onAction?: (id: string) => void;
  renderAction?: (action: GridraToolbarAction, context: { key: string }) => ReactNode;
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
      {actions.map((action) => (
        <Fragment key={action.id}>
          {renderAction ? (
            renderAction(action, { key: action.id })
          ) : (
            <GridraToolbarButton
              aria-pressed={action.pressed}
              disabled={action.disabled}
              onClick={() => onAction?.(action.id)}
            >
              {action.label}
            </GridraToolbarButton>
          )}
        </Fragment>
      ))}
      {children}
    </div>
  );
}

export function GridraToolbarButton({
  className,
  ...props
}: GridraButtonProps) {
  const buttonClassName = ["gridra-toolbar__button", className].filter(Boolean).join(" ");

  return <GridraButton className={buttonClassName} {...props} />;
}
