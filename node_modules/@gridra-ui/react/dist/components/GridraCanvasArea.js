import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GridraNode } from "./GridraNode";
import { useControllableValue } from "./useControllableValue";
export function GridraCanvasArea({ children, className, defaultSelectedId = null, nodes = [], onSelectionChange, renderNode, selectedId, ...props }) {
    const [currentSelectedId, setSelectedId] = useControllableValue(selectedId, defaultSelectedId, onSelectionChange);
    const canvasClassName = ["gridra-canvas-area", className].filter(Boolean).join(" ");
    return (_jsxs("div", { className: canvasClassName, ...props, children: [nodes.map((node) => {
                const selected = node.id === currentSelectedId;
                if (renderNode) {
                    return renderNode(node, { selected });
                }
                return (_jsx(GridraNode, { id: node.id, onSelect: (nextId) => setSelectedId(selected ? null : nextId), position: node.position, selected: selected, children: node.label ?? node.id }, node.id));
            }), children] }));
}
//# sourceMappingURL=GridraCanvasArea.js.map