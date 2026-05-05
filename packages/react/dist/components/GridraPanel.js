import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function GridraPanel({ children, className, heading, header, position = "left", ...props }) {
    const panelClassName = ["gridra-panel", `gridra-panel--${position}`, className]
        .filter(Boolean)
        .join(" ");
    return (_jsxs("aside", { className: panelClassName, ...props, children: [(heading || header) && (_jsxs("div", { className: "gridra-panel__header", children: [heading && _jsx("h2", { className: "gridra-panel__title", children: heading }), header] })), _jsx("div", { className: "gridra-panel__body", children: children })] }));
}
//# sourceMappingURL=GridraPanel.js.map