import { renderHook } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useGridraPropertiesPanel } from "./useGridraPropertiesPanel";

const options = {
  selectedNodeId: "one",
  selectedNodeType: "node",
  schema: { node: [{ id: "count", label: "Count", kind: "number" as const }] },
  value: { count: 1 },
};

it("emits finite numeric patches without mutating controlled values", () => {
  const change = vi.fn();
  const { result } = renderHook(() =>
    useGridraPropertiesPanel({ ...options, onChange: change }),
  );

  result.current.changeNumber("count", "3");

  expect(change).toHaveBeenCalledWith({ count: 3 });
  expect(options.value.count).toBe(1);
  expect(result.current.getFieldValue(options.schema.node[0])).toBe(1);
});

it("ignores invalid input, disabled and incomplete selections", () => {
  const change = vi.fn();
  const { result, rerender } = renderHook(
    ({ disabled, selectedNodeId }) =>
      useGridraPropertiesPanel({
        ...options,
        disabled,
        selectedNodeId,
        onChange: change,
      }),
    {
      initialProps: { disabled: false, selectedNodeId: "one" as string | null },
    },
  );
  for (const raw of ["", "NaN", "Infinity"])
    result.current.changeNumber("count", raw);

  rerender({ disabled: true, selectedNodeId: "one" });
  result.current.handleChange("count", 5);
  rerender({ disabled: false, selectedNodeId: null });
  result.current.handleChange("count", 6);

  expect(change).not.toHaveBeenCalled();
  expect(result.current.hasSelection).toBe(false);
});
