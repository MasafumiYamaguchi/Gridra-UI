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
    expect(overlay.snapGuides[0].end).toBe(190);
    expect(overlay.snapGuides[1].end).toBe(380);
    const vertical = overlay.gridLines!.filter((line) => line.orientation === "vertical");
    const horizontal = overlay.gridLines!.filter((line) => line.orientation === "horizontal");
    expect(vertical.map((line) => line.position)).toEqual([20, 102.5, 112.5, 195, 205, 287.5, 297.5, 380]);
    expect(horizontal.map((line) => line.position)).toEqual([10, 90, 110, 190]);
    expect(vertical.every((line) => line.start === 10 && line.end === 190)).toBe(true);
    expect(horizontal.every((line) => line.start === 20 && line.end === 380)).toBe(true);
  });
  it("does not duplicate shared cell boundaries without gaps", () => {
    const overlay = computeOverlay(state, { type: "drag", id: "a", placement: { column: 1, row: 1 }, pointerId: 1,
      origin: { x: 0, y: 0 }, point: { x: 1, y: 1 } }, { ...metrics,
      columnGap: 0, rowGap: 0, cellWidth: 90, columnStep: 90, cellHeight: 90, rowStep: 90 });
    expect(overlay.gridLines!.filter((line) => line.orientation === "vertical").map((line) => line.position))
      .toEqual([20, 110, 200, 290, 380]);
    expect(overlay.gridLines!.filter((line) => line.orientation === "horizontal").map((line) => line.position))
      .toEqual([10, 100, 190]);
  });
  it("hides the grid outside moving and resizing operations", () => {
    expect(computeOverlay(state, null, metrics).gridLines).toEqual([]);
    const range = { type: "range" as const, pointerId: 1, origin: { x: 0, y: 0 }, point: { x: 1, y: 1 } };
    expect(computeOverlay(state, range, metrics).gridLines).toEqual([]);
    expect(computeOverlay(state, { ...range, type: "connect", id: "a", kind: "output" }, metrics).gridLines).toEqual([]);
    expect(computeOverlay(state, { ...range, type: "drag", id: "missing", placement: { column: 1, row: 1 } }, metrics).gridLines).toEqual([]);
  });
  it("omits geometry before the container is measured", () => {
    expect(computeOverlay(state, null, null)).toEqual({ width: 0, height: 0, segments: [], snapGuides: [], gridLines: [] });
  });
});
