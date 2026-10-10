import { describe, expect, it, vi } from "vitest";
import { computeOverlay } from "./overlayUtils";
import type { GridMetrics } from "./geometry";
import type { GridraCanvasState } from "./types";

const metrics: GridMetrics = { width: 400, height: 200, columns: 4, rows: 2,
  cellWidth: 82.5, cellHeight: 80, columnStep: 92.5, rowStep: 100,
  columnGap: 10, rowGap: 20, paddingLeft: 20, paddingTop: 10 };
const state: GridraCanvasState = { nodes: [
  { id: "a", placement: { column: 1, row: 1 } }, { id: "b", placement: { column: 3, row: 2 } },
], connections: [{ sourceId: "a", targetId: "b" }, { sourceId: "a", targetId: "missing" }],
  selectedIds: [], selectedConnections: [{ sourceId: "a", targetId: "b" }] };

describe("overlay geometry without DOM access", () => {
  it("uses shared pixel endpoints and ignores absent nodes", () => {
    const spy = vi.spyOn(window, "getComputedStyle");
    try {
      const overlay = computeOverlay(state, null, metrics);
      expect(overlay.width).toBe(400); expect(overlay.segments).toHaveLength(1);
      expect(overlay.segments[0].path).toBe("M 102.5 50 C 153.75 50 153.75 150 205 150");
      expect(overlay.segments[0].selected).toBe(true);
      expect(spy).not.toHaveBeenCalled();
    } finally { spy.mockRestore(); }
  });
  it("builds an input-origin preview in output-to-input direction", () => {
    const overlay = computeOverlay(state, { type: "connect", id: "b", kind: "input", pointerId: 1,
      origin: { x: 205, y: 150 }, point: { x: 102.5, y: 50 } }, metrics);
    expect(overlay.previewPath).toBe(overlay.segments[0].path);
  });
  it.each(["drag", "resize"] as const)("anchors %s guides to the correct rectangle edge", (type) => {
    const overlay = computeOverlay(state, { type, id: "a", placement: { column: 1, row: 1 }, pointerId: 1,
      origin: { x: 0, y: 0 }, point: { x: 1, y: 1 } }, metrics);
    expect(overlay.snapGuides[0].position).toBe(type === "drag" ? 20 : 102.5);
    expect(overlay.snapGuides[1].position).toBe(type === "drag" ? 10 : 90);
  });
  it("omits geometry before the container is measured", () => {
    expect(computeOverlay(state, null, null)).toEqual({ width: 0, height: 0, segments: [], snapGuides: [] });
  });
});
