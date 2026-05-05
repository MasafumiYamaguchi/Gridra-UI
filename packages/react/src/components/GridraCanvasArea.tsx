import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import type { GridraId } from "@gridra-ui/core";
import { GridraNode, type GridraNodePlacement } from "./GridraNode";
import { useControllableValue } from "./useControllableValue";

export interface GridraCanvasNode {
  id: GridraId;
  placement: GridraNodePlacement;
  label?: ReactNode;
}

export interface GridraCanvasAreaProps<TNode extends GridraCanvasNode = GridraCanvasNode>
  extends HTMLAttributes<HTMLDivElement> {
  gridColumns?: number;
  gridRows?: number;
  nodes?: TNode[];
  selectedId?: GridraId | null;
  defaultSelectedId?: GridraId | null;
  onSelectionChange?: (selectedId: GridraId | null, previousSelectedId: GridraId | null) => void;
  renderNode?: (node: TNode, state: { selected: boolean }) => ReactNode;
}

export function GridraCanvasArea<TNode extends GridraCanvasNode = GridraCanvasNode>({
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
  const [currentSelectedId, setSelectedId] = useControllableValue(
    selectedId,
    defaultSelectedId,
    onSelectionChange
  );
  const canvasClassName = ["gridra-canvas-area", className].filter(Boolean).join(" ");
  const canvasStyle = {
    ...style,
    ...(gridColumns
      ? { "--gridra-grid-columns": normalizeGridCount(gridColumns).toString() }
      : null),
    ...(gridRows
      ? { "--gridra-grid-rows": normalizeGridCount(gridRows).toString() }
      : null)
  } as CSSProperties;

  return (
    <div className={canvasClassName} style={canvasStyle} {...props}>
      {nodes.map((node) => {
        const selected = node.id === currentSelectedId;

        if (renderNode) {
          return renderNode(node, { selected });
        }

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
      {children}
    </div>
  );
}

function normalizeGridCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }

  return Math.max(1, Math.floor(value));
}
