import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";

export type GridraAlertTone = "info" | "success" | "warning" | "danger";

export interface GridraAlertProps extends HTMLAttributes<HTMLDivElement> {
  action?: ReactNode;
  heading?: ReactNode;
  icon?: ReactNode;
  tone?: GridraAlertTone;
}

export function GridraAlert({
  action,
  children,
  className,
  heading,
  icon,
  role,
  tone = "info",
  ...props
}: GridraAlertProps) {

  const alertClassName = cx(
    "gridra-alert",
    `gridra-alert--${tone}`,
    icon ? "gridra-alert--with-icon" : null,
    action ? "gridra-alert--with-action" : null,
    className,
  );

  return (
    <div className={alertClassName} role={role ?? getDefaultRole(tone)} {...props}>
      {icon ? (
        <div className="gridra-alert__icon" aria-hidden="true">
          {icon}
        </div>
      ) : null}
      <div className="gridra-alert__content">
        {heading ? <div className="gridra-alert__heading">{heading}</div> : null}
        {children ? <div className="gridra-alert__body">{children}</div> : null}
      </div>
      {action ? <div className="gridra-alert__action">{action}</div> : null}
    </div>
  );
}

function getDefaultRole(tone: GridraAlertTone): "status" | "alert" {
  return tone === "warning" || tone === "danger" ? "alert" : "status";
}
