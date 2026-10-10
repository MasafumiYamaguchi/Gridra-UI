import { describe, expect, it } from "vitest";
import { computeDragPlacement, computeResizePlacement } from "./interactionUtils";
import type { GridMetrics } from "./geometry";

const metrics: GridMetrics = {
  width: 600, height: 400, columns: 12, rows: 6,
  cellWidth: 50, cellHeight: 400 / 6, columnStep: 50, rowStep: 400 / 6,
  paddingLeft: 0, paddingTop: 0, columnGap: 0, rowGap: 0,
};

describe("placement calculations from metric snapshots", () => {
  it("moves by rounded cell deltas", () => {
    expect(computeDragPlacement({ metrics, currentPoint: { x: 350, y: 250 }, origin: { x: 300, y: 200 },
      startPlacement: { column: 3, row: 2 } })).toEqual({ column: 4, row: 3, columnSpan: 1, rowSpan: 1 });
  });
  it("clamps movement to grid starts", () => {
    expect(computeDragPlacement({ metrics, currentPoint: { x: -500, y: -500 }, origin: { x: 300, y: 200 },
      startPlacement: { column: 3, row: 2 } })).toEqual({ column: 1, row: 1, columnSpan: 1, rowSpan: 1 });
  });
  it("preserves spans when moved against the far boundary", () => {
    expect(computeDragPlacement({ metrics, currentPoint: { x: 2000, y: 2000 }, origin: { x: 0, y: 0 },
      startPlacement: { column: 3, row: 2, columnSpan: 3, rowSpan: 2 } }))
      .toEqual({ column: 10, row: 5, columnSpan: 3, rowSpan: 2 });
  });
  it("resizes spans by rounded cell deltas", () => {
    expect(computeResizePlacement({ metrics, currentPoint: { x: 400, y: 300 }, origin: { x: 350, y: 250 },
      startPlacement: { column: 3, row: 2, columnSpan: 2, rowSpan: 1 } }))
      .toEqual({ column: 3, row: 2, columnSpan: 3, rowSpan: 2 });
  });
  it("preserves the start and clamps resize spans to the remaining cells", () => {
    expect(computeResizePlacement({ metrics, currentPoint: { x: 2000, y: 2000 }, origin: { x: 0, y: 0 },
      startPlacement: { column: 11, row: 5 } })).toEqual({ column: 11, row: 5, columnSpan: 2, rowSpan: 2 });
  });
});
