import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { resolveAriaInvalid, useControlDescriptionIds } from "./formControl";

describe("resolveAriaInvalid", () => {
  it("preserves explicit aria-invalid values", () => {
    expect(resolveAriaInvalid("false", true)).toBe("false");
    expect(resolveAriaInvalid(false, true)).toBe(false);
  });

  it("derives aria-invalid from invalid state only when omitted", () => {
    expect(resolveAriaInvalid(undefined, true)).toBe(true);
    expect(resolveAriaInvalid(undefined, false)).toBeUndefined();
  });
});

describe("useControlDescriptionIds", () => {
  it("uses a provided control id and derives a description id when needed", () => {
    const { result } = renderHook(() => useControlDescriptionIds("field", true));

    expect(result.current).toEqual({
      controlId: "field",
      descriptionId: "field-description",
    });
  });

  it("omits description id when there is no description", () => {
    const { result } = renderHook(() => useControlDescriptionIds("field", false));

    expect(result.current).toEqual({
      controlId: "field",
      descriptionId: undefined,
    });
  });
});
