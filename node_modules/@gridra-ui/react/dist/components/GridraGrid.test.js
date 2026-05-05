import { jsx as _jsx } from "react/jsx-runtime";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraGrid } from "./GridraGrid";
afterEach(() => {
    cleanup();
});
describe("GridraGrid", () => {
    it("supports uncontrolled selection", () => {
        render(_jsx(GridraGrid, { items: [{ id: "a", label: "Alpha" }] }));
        const item = screen.getByRole("button", { name: "Alpha" });
        fireEvent.click(item);
        expect(item.getAttribute("aria-selected")).toBe("true");
    });
    it("reports controlled selection changes", () => {
        const changes = [];
        render(_jsx(GridraGrid, { items: [{ id: "a", label: "Alpha" }], onSelectionChange: (selectedId) => changes.push(selectedId), selectedId: null }));
        fireEvent.click(screen.getByRole("button", { name: "Alpha" }));
        expect(changes).toEqual(["a"]);
    });
});
//# sourceMappingURL=GridraGrid.test.js.map