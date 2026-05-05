import { describe, expect, it } from "vitest";
import {
  emptySelection,
  movePoint,
  rectContainsPoint,
  selectGridraItem,
  toggleGridraSelection
} from "./index";

describe("selection helpers", () => {
  it("selects an item without mutating the previous state", () => {
    const next = selectGridraItem(emptySelection, "node-1");

    expect(next).toEqual({ selectedId: "node-1" });
    expect(emptySelection).toEqual({ selectedId: null });
  });

  it("toggles the selected item", () => {
    const selected = toggleGridraSelection(emptySelection, "node-1");
    const cleared = toggleGridraSelection(selected, "node-1");

    expect(selected.selectedId).toBe("node-1");
    expect(cleared.selectedId).toBeNull();
  });
});

describe("geometry helpers", () => {
  it("moves a point by a delta", () => {
    expect(movePoint({ x: 4, y: 8 }, { x: -1, y: 3 })).toEqual({ x: 3, y: 11 });
  });

  it("detects whether a point is inside a rect", () => {
    expect(rectContainsPoint({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5 })).toBe(true);
    expect(rectContainsPoint({ x: 0, y: 0, width: 10, height: 10 }, { x: 12, y: 5 })).toBe(false);
  });
});
