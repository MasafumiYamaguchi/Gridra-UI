import { describe, expect, it } from "vitest";
import {
  createRect,
  formatCssLength,
  getConnectionPath,
  getConnectionPoint,
  getConnectionRect,
  getNodeRect,
  normalizeGridCount,
  normalizeGridLine,
  normalizeGridPlacement,
  normalizeGridSpan,
  placementsEqual,
  rectsIntersect,
} from "./geometry";

describe("canvas geometry helpers", () => {
  it("normalizes grid counts, lines, spans, and placements", () => {
    expect(normalizeGridCount(4.8)).toBe(4);
    expect(normalizeGridCount(Number.NaN)).toBe(1);
    expect(normalizeGridLine(8, 5)).toBe(5);
    expect(normalizeGridLine(-2)).toBe(1);
    expect(normalizeGridSpan(4, 5, 3)).toBe(3);
    expect(normalizeGridSpan(Number.POSITIVE_INFINITY)).toBe(1);
    expect(normalizeGridPlacement({ column: 4.7, row: -2, columnSpan: 10, rowSpan: 0 }, 5, 3)).toEqual({
      column: 4,
      row: 1,
      columnSpan: 2,
      rowSpan: 1,
    });
  });

  it("creates rectangles from either drag direction", () => {
    expect(createRect({ x: 30, y: 40 }, { x: 10, y: 15 })).toEqual({
      x: 10,
      y: 15,
      width: 20,
      height: 25,
    });
  });

  it("computes node and connection rectangles from canvas metrics", () => {
    const canvas = createCanvas();

    expect(getNodeRect({ column: 2, row: 2, columnSpan: 2, rowSpan: 1 }, canvas, 4, 2)).toEqual({
      x: 112.5,
      y: 110,
      width: 175,
      height: 80,
    });
    expect(getConnectionRect(
      { column: 1, row: 1, columnSpan: 1, rowSpan: 1 },
      { column: 3, row: 2, columnSpan: 1, rowSpan: 1 },
      canvas,
      4,
      2,
    )).toEqual({
      x: 102.5,
      y: 50,
      width: 102.5,
      height: 100,
    });
  });

  it("computes normalized connection points and paths", () => {
    expect(getConnectionPoint({ column: 4, row: 1, columnSpan: 3, rowSpan: 2 }, "output", 5, 4)).toEqual({
      x: 5,
      y: 1,
    });
    expect(getConnectionPoint({ column: Number.NaN, row: 10 }, "input", 5, 4)).toEqual({
      x: 0,
      y: 3.5,
    });
    expect(getConnectionPath({ column: 1, row: 1 }, { column: 3, row: 2 }, 4, 4)).toBe(
      "M 1 0.5 C 1.5 0.5 1.5 1.5 2 1.5"
    );
  });

  it("treats touching rectangles as intersecting and compares normalized spans", () => {
    expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 10, width: 5, height: 5 })).toBe(true);
    expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 11, y: 0, width: 5, height: 5 })).toBe(false);
    expect(placementsEqual({ column: 1, row: 1 }, { column: 1, row: 1, columnSpan: 1, rowSpan: 1 })).toBe(true);
    expect(placementsEqual({ column: 1, row: 1, columnSpan: 2 }, { column: 1, row: 1, columnSpan: 1 })).toBe(false);
  });

  it("formats numeric css lengths defensively", () => {
    expect(formatCssLength(12)).toBe("12px");
    expect(formatCssLength(-3)).toBe("0px");
    expect(formatCssLength(Number.NaN)).toBe("0px");
    expect(formatCssLength("2rem")).toBe("2rem");
  });
});

function createCanvas() {
  const canvas = document.createElement("div");
  canvas.style.paddingLeft = "20px";
  canvas.style.paddingRight = "20px";
  canvas.style.paddingTop = "10px";
  canvas.style.paddingBottom = "10px";
  canvas.style.columnGap = "10px";
  canvas.style.rowGap = "20px";
  Object.defineProperty(canvas, "clientWidth", { configurable: true, value: 400 });
  Object.defineProperty(canvas, "clientHeight", { configurable: true, value: 200 });
  canvas.getBoundingClientRect = () => ({
    bottom: 200,
    height: 200,
    left: 0,
    right: 400,
    top: 0,
    width: 400,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  return canvas;
}
