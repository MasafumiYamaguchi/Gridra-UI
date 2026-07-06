import { describe, expect, it } from "vitest";
import { clampIndex, clampNumber, wrapIndex } from "./numeric";

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
});
