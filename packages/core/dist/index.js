export const emptySelection = {
    selectedId: null
};
export function selectGridraItem(state, selectedId) {
    if (state.selectedId === selectedId) {
        return state;
    }
    return { selectedId };
}
export function toggleGridraSelection(state, selectedId) {
    return {
        selectedId: state.selectedId === selectedId ? null : selectedId
    };
}
export function movePoint(point, delta) {
    return {
        x: point.x + delta.x,
        y: point.y + delta.y
    };
}
export function rectContainsPoint(rect, point) {
    return (point.x >= rect.x &&
        point.y >= rect.y &&
        point.x <= rect.x + rect.width &&
        point.y <= rect.y + rect.height);
}
//# sourceMappingURL=index.js.map