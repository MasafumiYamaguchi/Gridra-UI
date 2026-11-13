import { expect, it } from "vitest";
import { getGridraButtonProps } from "./getGridraButtonProps";

it("locks loading buttons even when disabled is false", () => {
  expect(
    getGridraButtonProps({ loading: true, disabled: false }),
  ).toMatchObject({
    disabled: true,
    "aria-busy": true,
    type: "button",
  });
});

it("exposes pressed state", () => {
  expect(getGridraButtonProps({ pressed: true })).toMatchObject({
    "aria-pressed": true,
  });
});

it("preserves native attributes and explicit aria overrides", () => {
  expect(
    getGridraButtonProps({ type: "submit", id: "save", "aria-busy": false }),
  ).toMatchObject({ type: "submit", id: "save", "aria-busy": false });
});
