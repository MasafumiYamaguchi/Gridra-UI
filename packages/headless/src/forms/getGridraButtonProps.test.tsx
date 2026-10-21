import { expect, it } from "vitest";
import { getGridraButtonProps } from "./getGridraButtonProps";

it("locks loading buttons and exposes pressed state", () => {
  expect(
    getGridraButtonProps({ loading: true, disabled: false, pressed: true }),
  ).toMatchObject({
    disabled: true,
    "aria-busy": true,
    "aria-pressed": true,
    type: "button",
  });
});

it("preserves native attributes and explicit aria overrides", () => {
  expect(
    getGridraButtonProps({ type: "submit", id: "save", "aria-busy": false }),
  ).toMatchObject({ type: "submit", id: "save", "aria-busy": false });
});
