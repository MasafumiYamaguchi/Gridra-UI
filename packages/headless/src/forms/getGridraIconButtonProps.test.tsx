import { expect, it } from "vitest";
import { getGridraIconButtonProps } from "./getGridraIconButtonProps";

it("provides an accessible name and shared loading lock", () => {
  expect(
    getGridraIconButtonProps({ label: "Save", loading: true }),
  ).toMatchObject({ "aria-label": "Save", title: "Save", disabled: true });
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
