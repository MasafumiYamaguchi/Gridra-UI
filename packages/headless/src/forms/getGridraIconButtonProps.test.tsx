import { expect, it } from "vitest";
import { getGridraIconButtonProps } from "./getGridraIconButtonProps";

it("provides an accessible name and title from label", () => {
  expect(getGridraIconButtonProps({ label: "Save" })).toMatchObject({
    "aria-label": "Save",
    title: "Save",
  });
});

it("shares the loading lock with the button", () => {
  expect(
    getGridraIconButtonProps({ label: "Save", loading: true }),
  ).toMatchObject({ disabled: true, "aria-busy": true });
});

it("preserves explicit label and title overrides", () => {
  expect(
    getGridraIconButtonProps({
      label: "Save",
      "aria-label": "Store",
      title: "Store document",
    }),
  ).toMatchObject({ "aria-label": "Store", title: "Store document" });
});
