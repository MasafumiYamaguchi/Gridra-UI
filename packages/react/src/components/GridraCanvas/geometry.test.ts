import { describe, expect, it } from "vitest";
import {
  createRect,
  getConnectionPath,
  getConnectionPoint,
  getConnectionRect,
  getNodeRect,
  getGridMetrics,
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
    const metrics = getGridMetrics(createCanvas(), 4, 2);

    expect(getNodeRect({ column: 2, row: 2, columnSpan: 2, rowSpan: 1 }, metrics)).toEqual({
      x: 112.5,
      y: 110,
      width: 175,
      height: 80,
    });
    expect(getConnectionRect(
      getNodeRect({ column: 1, row: 1 }, metrics),
      getNodeRect({ column: 3, row: 2 }, metrics),
    )).toEqual({
      x: 102.5,
      y: 50,
      width: 102.5,
      height: 100,
    });
  });

  it("computes pixel endpoints and connection paths from the same rectangles", () => {
    const rect = { x: 10, y: 20, width: 30, height: 40 };
    expect(getConnectionPoint(rect, "output")).toEqual({ x: 40, y: 40 });
    expect(getConnectionPoint(rect, "input")).toEqual({ x: 10, y: 40 });
    expect(getConnectionPath({ x: 102.5, y: 50 }, { x: 205, y: 150 })).toBe(
      "M 102.5 50 C 153.75 50 153.75 150 205 150"
    );
  });

  it("treats touching rectangles as intersecting and compares normalized spans", () => {
    expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 10, y: 10, width: 5, height: 5 })).toBe(true);
    expect(rectsIntersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 11, y: 0, width: 5, height: 5 })).toBe(false);
    expect(placementsEqual({ column: 1, row: 1 }, { column: 1, row: 1, columnSpan: 1, rowSpan: 1 })).toBe(true);
    expect(placementsEqual({ column: 1, row: 1, columnSpan: 2 }, { column: 1, row: 1, columnSpan: 1 })).toBe(false);
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
