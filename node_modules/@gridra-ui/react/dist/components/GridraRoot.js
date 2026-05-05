import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function GridraRoot({ children, className, panel, panelPosition = "left", ...props }) {
    const rootClassName = ["gridra-root", className].filter(Boolean).join(" ");
    const shellClassName = [
        "gridra-root__shell",
        panel ? `gridra-root__shell--${panelPosition}` : null
    ]
        .filter(Boolean)
        .join(" ");
    return (_jsx("div", { className: rootClassName, ...props, children: _jsxs("div", { className: shellClassName, children: [panel && panelPosition === "left" ? panel : null, _jsx("main", { className: "gridra-main", children: children }), panel && panelPosition === "right" ? panel : null] }) }));
}
//# sourceMappingURL=GridraRoot.js.map