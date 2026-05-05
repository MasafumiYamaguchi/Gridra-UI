import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { GridraId, GridraPoint } from "@gridra-ui/core";

export interface GridraNodeProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "id" | "onSelect"> {
  id: GridraId;
  position: GridraPoint;
  selected?: boolean;
  children?: ReactNode;
  onSelect?: (id: GridraId) => void;
}

export function GridraNode({
  children,
  className,
  id,
  onClick,
  onSelect,
  position,
  selected = false,
  type = "button",
  ...props
}: GridraNodeProps) {
  const nodeClassName = ["gridra-node", className].filter(Boolean).join(" ");

  return (
    <button
      aria-selected={selected}
      className={nodeClassName}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          onSelect?.(id);
        }
      }}
      style={{ left: position.x, top: position.y }}
      type={type}
      {...props}
    >
      {children ?? id}
    </button>
  );
}
