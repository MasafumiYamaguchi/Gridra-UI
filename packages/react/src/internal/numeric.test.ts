import { describe, expect, it } from "vitest";
import {
  clampIndex,
  clampNumber,
  formatCssLength,
  formatCssLengthWithMin,
  normalizeGridLine,
  normalizeGridSpan,
  parseCssPx,
  resolveCssLengthToPx,
  wrapIndex,
} from "./numeric";

describe("numeric utilities", () => {
  it("clamps numbers to a min and max range", () => {
    expect(clampNumber(-1, 0, 10)).toBe(0);
    expect(clampNumber(4, 0, 10)).toBe(4);
    expect(clampNumber(12, 0, 10)).toBe(10);
  });

  it("clamps non-finite numbers to the minimum", () => {
    expect(clampNumber(Number.NaN, 2, 10)).toBe(2);
    expect(clampNumber(Number.POSITIVE_INFINITY, 2, 10)).toBe(2);
  });

  it("clamps indexes to an item count", () => {
    expect(clampIndex(-1, 3)).toBe(0);
    expect(clampIndex(1, 3)).toBe(1);
    expect(clampIndex(4, 3)).toBe(2);
    expect(clampIndex(4, 0)).toBe(0);
  });

  it("wraps indexes around an item count", () => {
    expect(wrapIndex(-1, 3)).toBe(2);
    expect(wrapIndex(3, 3)).toBe(0);
    expect(wrapIndex(4, 3)).toBe(1);
    expect(wrapIndex(4, 0)).toBe(0);
  });

  it("normalizes grid lines and spans with optional bounds", () => {
    expect(normalizeGridLine(8, 5)).toBe(5);
    expect(normalizeGridLine(-2)).toBe(1);
    expect(normalizeGridSpan(4, 5, 3)).toBe(3);
    expect(normalizeGridSpan(Number.POSITIVE_INFINITY)).toBe(1);
  });

  it("formats and parses CSS lengths", () => {
    expect(formatCssLength(12)).toBe("12px");
    expect(formatCssLength(-3)).toBe("0px");
    expect(formatCssLength("2rem")).toBe("2rem");
    expect(formatCssLengthWithMin(4, 8)).toBe("8px");
    expect(parseCssPx("12.5px")).toBe(12.5);
    expect(resolveCssLengthToPx("bad", 20)).toBe(20);
  });
});
