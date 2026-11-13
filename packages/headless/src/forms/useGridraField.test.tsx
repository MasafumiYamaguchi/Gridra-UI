import { renderHook } from "@testing-library/react";
import { expect, it } from "vitest";
import { useGridraField } from "./useGridraField";

it("associates labels and gives errors precedence over hints", () => {
  const { result } = renderHook(() =>
    useGridraField({ hasHint: true, hasError: true, required: true }),
  );
  const f = result.current;

  expect(f.labelProps.htmlFor).toBe(f.controlBindings.id);
  expect(f.controlBindings["aria-describedby"]).toBe(f.errorProps.id);
  expect(f.controlBindings["aria-invalid"]).toBe(true);
  expect(f.controlBindings.required).toBe(true);
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

  expect(result.current.controlBindings["aria-describedby"]).toBe(
    "external x-hint",
  );
  expect(result.current.controlBindings.disabled).toBe(false);
  expect(result.current.controlBindings["aria-invalid"]).toBe(false);
  expect(result.current.controlBindings["aria-required"]).toBe(true);
});
