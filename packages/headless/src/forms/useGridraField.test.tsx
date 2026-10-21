import { renderHook } from "@testing-library/react";
import { expect, it } from "vitest";
import { useGridraField } from "./useGridraField";

it("associates labels and gives errors precedence over hints", () => {
  const { result } = renderHook(() =>
    useGridraField({ hasHint: true, hasError: true, required: true }),
  );
  const f = result.current;

  expect(f.labelProps.htmlFor).toBe(f.controlProps.id);
  expect(f.controlProps["aria-describedby"]).toBe(f.errorProps.id);
  expect(f.controlProps["aria-invalid"]).toBe(true);
  expect(f.controlProps.required).toBe(true);
});

it("preserves explicit control state and deduplicates descriptions", () => {
  const { result } = renderHook(() =>
    useGridraField({
      controlProps: {
        id: "x",
        disabled: false,
        "aria-invalid": false,
        "aria-describedby": "external x-hint",
      },
      hasHint: true,
      disabled: true,
      usesAriaRequired: true,
      required: true,
    }),
  );

  expect(result.current.controlProps["aria-describedby"]).toBe(
    "external x-hint",
  );
  expect(result.current.controlProps.disabled).toBe(false);
  expect(result.current.controlProps["aria-invalid"]).toBe(false);
  expect(result.current.controlProps["aria-required"]).toBe(true);
});
