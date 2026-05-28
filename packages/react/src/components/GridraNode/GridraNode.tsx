import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import type { GridraId } from "@gridra-ui/core";
import { normalizeGridLine, normalizeGridSpan } from "../../internal/numeric";

// グリッド内のノードの配置を表すコンポーネントに必要なプロパティを定義するインターフェース
export interface GridraNodePlacement {
  column: number;
  row: number;
  columnSpan?: number;
  rowSpan?: number;
}

// ノードに渡るpropsを定義するインターフェース
export interface GridraNodeProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "id" | "onSelect"> {
  id: GridraId;
  placement: GridraNodePlacement;
  connectionHandles?: ReactNode;
  dragHandle?: ReactNode;
  resizeHandle?: ReactNode;
  selected?: boolean;
  children?: ReactNode;
  onSelect?: (id: GridraId) => void;
}

export function GridraNode({
  children,
  className,
  connectionHandles,
  dragHandle,
  id,
  onClick,
  onSelect,
  placement,
  resizeHandle,
  selected = false,
  style,
  type = "button",
  ...props
}: GridraNodeProps) {
  const nodeClassName = ["gridra-node", className].filter(Boolean).join(" "); // クラス名を結合して、必要なスタイルを適用する
  const nodeStyle = {
    ...style,
    gridColumn: `${normalizeGridLine(placement.column)} / span ${normalizeGridSpan(placement.columnSpan)}`,
    gridRow: `${normalizeGridLine(placement.row)} / span ${normalizeGridSpan(placement.rowSpan)}`
  } as CSSProperties; // ノードのスタイルを定義する。グリッドの行と列の位置とスパンを計算して適用する

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
      style={nodeStyle}
      type={type}
      {...props}
    >
      {dragHandle}
      <div className="gridra-node__label">{children ?? id}</div>
      {connectionHandles}
      {resizeHandle}
    </button>
  );
}

