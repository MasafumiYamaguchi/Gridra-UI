import type { HTMLAttributes, ReactNode } from "react";

export type GridraCardPadding = "sm" | "md" | "lg";
export type GridraCardSurface = "surface" | "raised" | "input";

export interface GridraCardProps extends HTMLAttributes<HTMLDivElement> {
  actions?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  heading?: ReactNode;
  media?: ReactNode;
  padding?: GridraCardPadding;
  surface?: GridraCardSurface;
}

export function GridraCard({
  actions,
  children,
  className,
  description,
  footer,
  heading,
  media,
  padding = "md",
  surface = "surface",
  ...props
}: GridraCardProps) {
  const rootClassName = [
    "gridra-card",
    `gridra-card--${surface}`,
    `gridra-card--padding-${padding}`,
    media ? "gridra-card--with-media" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName} {...props}>
      {media ? <div className="gridra-card__media">{media}</div> : null}
      {heading || description || actions ? (
        <div className="gridra-card__header">
          <div className="gridra-card__heading-group">
            {heading ? <div className="gridra-card__heading">{heading}</div> : null}
            {description ? (
              <div className="gridra-card__description">{description}</div>
            ) : null}
          </div>
          {actions ? <div className="gridra-card__actions">{actions}</div> : null}
        </div>
      ) : null}
      {children !== undefined && children !== null ? (
        <div className="gridra-card__body">{children}</div>
      ) : null}
      {footer ? <div className="gridra-card__footer">{footer}</div> : null}
    </div>
  );
}
