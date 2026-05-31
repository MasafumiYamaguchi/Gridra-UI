import { Fragment, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "../../internal/classNames";
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
  return (
    <div className={cx("gridra-toolbar", className)} role="toolbar" {...props}>
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
  return <GridraButton className={cx("gridra-toolbar__button", className)} {...props} />;
}
