import { describe, expect, it } from "vitest";
import { computeDragPlacement, computeResizePlacement } from "./interactionUtils";
import type { PointerEvent } from "react";

function makeCanvas(): HTMLDivElement {
  const el = document.createElement("div");
  Object.defineProperty(el, "getBoundingClientRect", {
    value: () => ({ top: 0, left: 0, width: 600, height: 400 }),
    configurable: true,
  });
  return el;
}

function makePointerEvent(overrides: Partial<PointerEvent<HTMLDivElement>>): PointerEvent<HTMLDivElement> {
  return {
    clientX: 300,
    clientY: 200,
    ...overrides,
  } as PointerEvent<HTMLDivElement>;
}

const gridCols = 12;
const gridRows = 6;

describe("computeDragPlacement", () => {
  it("computes drag placement from origin delta", () => {
    const canvas = makeCanvas();
    const event = makePointerEvent({ clientX: 350, clientY: 250 });
    const origin = { x: 300, y: 200 };
    const startPlacement = { column: 3, row: 2 };

    const result = computeDragPlacement({
      canvas,
      event,
      gridColumns: gridCols,
      gridRows: gridRows,
      origin,
      startPlacement,
    });

    // Delta: (350-300)/50=1 column, (250-200)/66.7≈0 row
    expect(result.column).toBeGreaterThanOrEqual(3);
    expect(result.row).toBeGreaterThanOrEqual(1);
  });

  it("clamps to grid bounds", () => {
    const canvas = makeCanvas();
    const event = makePointerEvent({ clientX: -500, clientY: -500 });
    const origin = { x: 300, y: 200 };
    const startPlacement = { column: 3, row: 2 };

    const result = computeDragPlacement({
      canvas,
      event,
      gridColumns: gridCols,
      gridRows: gridRows,
      origin,
      startPlacement,
    });

    expect(result.column).toBeGreaterThanOrEqual(1);
    expect(result.row).toBeGreaterThanOrEqual(1);
    expect(result.column).toBeLessThanOrEqual(gridCols);
    expect(result.row).toBeLessThanOrEqual(gridRows);
  });
});

describe("computeResizePlacement", () => {
  it("computes resize placement from origin delta", () => {
    const canvas = makeCanvas();
    const event = makePointerEvent({ clientX: 400, clientY: 300 });
    const origin = { x: 350, y: 250 };
    const startPlacement = { column: 3, row: 2, columnSpan: 2, rowSpan: 1 };

    const result = computeResizePlacement({
      canvas,
      event,
      gridColumns: gridCols,
      gridRows: gridRows,
      origin,
      startPlacement,
    });

    // Delta: (400-350)/50=1 columnSpan increase, (300-250)/66.7≈1 rowSpan increase
    expect(result.columnSpan).toBeGreaterThanOrEqual(2);
    expect(result.rowSpan).toBeGreaterThanOrEqual(1);
  });
});
