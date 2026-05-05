import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function GridraToolbar({ actions = [], children, className, onAction, renderAction, ...props }) {
    const toolbarClassName = ["gridra-toolbar", className].filter(Boolean).join(" ");
    return (_jsxs("div", { className: toolbarClassName, role: "toolbar", ...props, children: [actions.map((action) => renderAction ? (renderAction(action)) : (_jsx(GridraToolbarButton, { "aria-pressed": action.pressed, disabled: action.disabled, onClick: () => onAction?.(action.id), children: action.label }, action.id))), children] }));
}
export function GridraToolbarButton({ className, type = "button", ...props }) {
    const buttonClassName = ["gridra-toolbar__button", className].filter(Boolean).join(" ");
    return _jsx("button", { className: buttonClassName, type: type, ...props });
}
//# sourceMappingURL=GridraToolbar.js.map