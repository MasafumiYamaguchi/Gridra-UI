import { jsx as _jsx } from "react/jsx-runtime";
import { useControllableValue } from "./useControllableValue";
export function GridraGrid({ className, columns = "repeat(auto-fill, minmax(160px, 1fr))", defaultSelectedId = null, emptyState = "No items", items, onSelectionChange, renderItem, selectedId }) {
    const [currentSelectedId, setSelectedId] = useControllableValue(selectedId, defaultSelectedId, onSelectionChange);
    const gridTemplateColumns = typeof columns === "number" ? `repeat(${columns}, minmax(0, 1fr))` : columns;
    const gridClassName = ["gridra-grid", className].filter(Boolean).join(" ");
    if (items.length === 0) {
        return _jsx("div", { className: "gridra-grid__empty", children: emptyState });
    }
    return (_jsx("div", { className: gridClassName, style: { gridTemplateColumns }, children: items.map((item) => {
            const selected = item.id === currentSelectedId;
            return (_jsx("button", { "aria-selected": selected, className: "gridra-grid__item", onClick: () => setSelectedId(selected ? null : item.id), type: "button", children: renderItem ? renderItem(item, { selected }) : item.label ?? item.id }, item.id));
        }) }));
}
//# sourceMappingURL=GridraGrid.js.map