import { describe, expect, it } from "vitest";
import { isFiniteNumber, isNumericString } from "./number";

describe("isNumericString", () => {
  it("accepts strings that parse to finite numbers", () => {
    expect(isNumericString("0")).toBe(true);
    expect(isNumericString("-1.5")).toBe(true);
    expect(isNumericString(" 42 ")).toBe(true);
  });

  it("rejects empty, non-numeric, and non-finite strings", () => {
    expect(isNumericString("")).toBe(false);
    expect(isNumericString("   ")).toBe(false);
    expect(isNumericString("abc")).toBe(false);
    expect(isNumericString("Infinity")).toBe(false);
  });
});

describe("isFiniteNumber", () => {
  it("accepts finite numbers only", () => {
    expect(isFiniteNumber(0)).toBe(true);
    expect(isFiniteNumber(-1.5)).toBe(true);
  });

  it("rejects NaN, Infinity, and non-number values", () => {
    expect(isFiniteNumber(Number.NaN)).toBe(false);
    expect(isFiniteNumber(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isFiniteNumber("1")).toBe(false);
    expect(isFiniteNumber(null)).toBe(false);
  });
});
