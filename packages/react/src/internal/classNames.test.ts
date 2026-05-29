import { describe, expect, it } from "vitest";
import { cx } from "./classNames";

describe("cx", () => {
  it("joins truthy class names in order", () => {
    expect(cx("gridra-button", "gridra-button--md", "custom")).toBe(
      "gridra-button gridra-button--md custom",
    );
  });

  it("omits false, null, and undefined values", () => {
    expect(cx("gridra-button", false, null, undefined, "custom")).toBe(
      "gridra-button custom",
    );
  });
});
