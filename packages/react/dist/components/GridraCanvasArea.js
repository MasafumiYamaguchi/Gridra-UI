import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GridraNode } from "./GridraNode";
import { useControllableValue } from "./useControllableValue";
export function GridraCanvasArea({ children, className, defaultSelectedId = null, gridColumns, gridRows, nodes = [], onSelectionChange, renderNode, selectedId, style, ...props }) {
    const [currentSelectedId, setSelectedId] = useControllableValue(selectedId, defaultSelectedId, onSelectionChange);
    const canvasClassName = ["gridra-canvas-area", className].filter(Boolean).join(" ");
    const canvasStyle = {
        ...style,
        ...(gridColumns
            ? { "--gridra-grid-columns": normalizeGridCount(gridColumns).toString() }
            : null),
        ...(gridRows
            ? { "--gridra-grid-rows": normalizeGridCount(gridRows).toString() }
            : null)
    };
    return (_jsxs("div", { className: canvasClassName, style: canvasStyle, ...props, children: [nodes.map((node) => {
                const selected = node.id === currentSelectedId;
                if (renderNode) {
                    return renderNode(node, { selected });
                }
                return (_jsx(GridraNode, { id: node.id, onSelect: (nextId) => setSelectedId(selected ? null : nextId), placement: node.placement, selected: selected, children: node.label ?? node.id }, node.id));
            }), children] }));
}
function normalizeGridCount(value) {
    if (!Number.isFinite(value)) {
        return 1;
    }
    return Math.max(1, Math.floor(value));
}
//# sourceMappingURL=GridraCanvasArea.js.map