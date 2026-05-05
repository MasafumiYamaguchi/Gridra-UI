import type { HTMLAttributes, ReactNode } from "react";
import type { GridraId, GridraPoint } from "@gridra-ui/core";
import { GridraNode } from "./GridraNode";
import { useControllableValue } from "./useControllableValue";

export interface GridraCanvasNode {
  id: GridraId;
  position: GridraPoint;
  label?: ReactNode;
}

export interface GridraCanvasAreaProps<TNode extends GridraCanvasNode = GridraCanvasNode>
  extends HTMLAttributes<HTMLDivElement> {
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
  nodes = [],
  onSelectionChange,
  renderNode,
  selectedId,
  ...props
}: GridraCanvasAreaProps<TNode>) {
  const [currentSelectedId, setSelectedId] = useControllableValue(
    selectedId,
    defaultSelectedId,
    onSelectionChange
  );
  const canvasClassName = ["gridra-canvas-area", className].filter(Boolean).join(" ");

  return (
    <div className={canvasClassName} {...props}>
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
            position={node.position}
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
