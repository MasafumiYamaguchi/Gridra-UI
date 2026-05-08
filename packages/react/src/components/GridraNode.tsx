import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import type { GridraId } from "@gridra-ui/core";

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
  placement,
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
    <div>
      <p>{children ?? id}</p>
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
      </button>
    </div>
  );
}

// グリッドの行と列の位置とスパンを正規化する関数。値が有限でない場合や1未満の場合は1にする
function normalizeGridLine(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}

// グリッドの行と列の位置とスパンを正規化する関数。値が有限でない場合や1未満の場合は1にする
function normalizeGridSpan(value = 1): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}
