import { expect, it } from "vitest";
import { getGridraProgress } from "./getGridraProgress";

it("clamps values and computes fraction", () => {
  expect(getGridraProgress({ value: 120, max: 80 })).toMatchObject({
    percent: 100,
    clampedValue: 80,
  });
  expect(getGridraProgress({ value: -5, max: 0 })).toMatchObject({
    normalizedMax: 100,
    clampedValue: 0,
  });
});

it("omits determined aria values only when value is absent", () => {
  expect(getGridraProgress().rootProps["aria-valuenow"]).toBeUndefined();
  expect(getGridraProgress({ value: NaN }).rootProps["aria-valuenow"]).toBe(0);
});
