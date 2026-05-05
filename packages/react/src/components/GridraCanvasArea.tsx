// 実際にグリッド上に描画される土台のコンポーネント

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { GridraId } from "@gridra-ui/core";
import { GridraNode, type GridraNodePlacement } from "./GridraNode";
import { useControllableValue } from "./useControllableValue";

// キャンバス上に配置されるノード（要素）のインタフェース
export interface GridraCanvasNode {
  id: GridraId;
  placement: GridraNodePlacement;
  label?: ReactNode;
}

// Canvasに渡すpropsをまとめたインタフェース
export interface GridraCanvasAreaProps<
  TNode extends GridraCanvasNode = GridraCanvasNode,
> extends HTMLAttributes<HTMLDivElement> {
  gridColumns?: number;
  gridRows?: number;
  nodes?: TNode[]; // Canvas上に配置されるノードのリスト
  selectedId?: GridraId | null; // 選択されているノードのID（外部から制御する場合）
  defaultSelectedId?: GridraId | null; // 選択されているノードのIDの初期値（内部で制御する場合）
  onSelectionChange?: (
    selectedId: GridraId | null,
    previousSelectedId: GridraId | null,
  ) => void; // ノードの選択が変更されたときに呼び出されるコールバック関数
  renderNode?: (node: TNode, state: { selected: boolean }) => ReactNode; // ノードの描画をカスタマイズするための関数
}

// ここがコンポーネントの根幹
export function GridraCanvasArea<
  TNode extends GridraCanvasNode = GridraCanvasNode,
>({
  children,
  className,
  defaultSelectedId = null,
  gridColumns,
  gridRows,
  nodes = [],
  onSelectionChange,
  renderNode,
  selectedId,
  style,
  ...props
}: GridraCanvasAreaProps<TNode>) {
  // 選択しているnodeを持っている
  const [currentSelectedId, setSelectedId] = useControllableValue(
    selectedId,
    defaultSelectedId,
    onSelectionChange,
  );
  // クラス名と結合して、スタイルを定義
  const canvasClassName = ["gridra-canvas-area", className]
    .filter(Boolean)
    .join(" ");
  // グリッドの列数と行数をCSS変数としてスタイルに追加
  const canvasStyle = {
    ...style,
    ...(gridColumns
      ? { "--gridra-grid-columns": normalizeGridCount(gridColumns).toString() } // base.cssの129行目でこの変数を使用している
      : null),
    ...(gridRows
      ? { "--gridra-grid-rows": normalizeGridCount(gridRows).toString() } // base.cssの130行目でこの変数を使用している
      : null),
  } as CSSProperties;

  return (
    <div className={canvasClassName} style={canvasStyle} {...props}>
      {nodes.map((node) => {
        const selected = node.id === currentSelectedId;

        // renderNodeが渡されている場合はそれを使ってノードを描画し、そうでない場合はデフォルトのGridraNodeコンポーネントを使用する
        if (renderNode) {
          return renderNode(node, { selected });
        }

        // デフォルトの描画方法
        return (
          <GridraNode
            id={node.id}
            key={node.id}
            onSelect={(nextId) => setSelectedId(selected ? null : nextId)}
            placement={node.placement}
            selected={selected}
          >
            {node.label ?? node.id}
          </GridraNode>
        );
      })}
      {children} // Canvas内に子要素があればそれも描画する
    </div>
  );
}

// グリッドの列数と行数を正規化する関数。無限大やNaNなどの非有限な値を1に変換し、1未満の値を切り捨てて1にする。
function normalizeGridCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}
