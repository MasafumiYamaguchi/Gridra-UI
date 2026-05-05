import { jsx as _jsx } from "react/jsx-runtime";
export function GridraNode({ children, className, id, onClick, onSelect, placement, selected = false, style, type = "button", ...props }) {
    const nodeClassName = ["gridra-node", className].filter(Boolean).join(" ");
    const nodeStyle = {
        ...style,
        gridColumn: `${normalizeGridLine(placement.column)} / span ${normalizeGridSpan(placement.columnSpan)}`,
        gridRow: `${normalizeGridLine(placement.row)} / span ${normalizeGridSpan(placement.rowSpan)}`
    };
    return (_jsx("button", { "aria-selected": selected, className: nodeClassName, onClick: (event) => {
            onClick?.(event);
            if (!event.defaultPrevented) {
                onSelect?.(id);
            }
        }, style: nodeStyle, type: type, ...props, children: children ?? id }));
}
function normalizeGridLine(value) {
    if (!Number.isFinite(value)) {
        return 1;
    }
    return Math.max(1, Math.floor(value));
}
function normalizeGridSpan(value = 1) {
    if (!Number.isFinite(value)) {
        return 1;
    }
    return Math.max(1, Math.floor(value));
}
//# sourceMappingURL=GridraNode.js.map