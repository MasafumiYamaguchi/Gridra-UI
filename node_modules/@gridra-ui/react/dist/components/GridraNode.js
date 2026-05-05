import { jsx as _jsx } from "react/jsx-runtime";
export function GridraNode({ children, className, id, onClick, onSelect, position, selected = false, type = "button", ...props }) {
    const nodeClassName = ["gridra-node", className].filter(Boolean).join(" ");
    return (_jsx("button", { "aria-selected": selected, className: nodeClassName, onClick: (event) => {
            onClick?.(event);
            if (!event.defaultPrevented) {
                onSelect?.(id);
            }
        }, style: { left: position.x, top: position.y }, type: type, ...props, children: children ?? id }));
}
//# sourceMappingURL=GridraNode.js.map