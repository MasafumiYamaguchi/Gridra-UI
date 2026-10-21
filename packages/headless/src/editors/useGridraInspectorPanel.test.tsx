import { renderHook } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useGridraInspectorPanel } from "./useGridraInspectorPanel";

const node = { id: "one", placement: { x: 1, y: 1, w: 2, h: 2 } };

it("emits finite patches and commits without mutating the source", () => {
  const change = vi.fn(),
    commit = vi.fn();
  const { result } = renderHook(() =>
    useGridraInspectorPanel({
      selectedNode: node,
      onChange: change,
      onCommit: commit,
    }),
  );

  result.current.handlePlacementChange("x", "3");
  result.current.handleLabelChange("New");
  result.current.commit();

  expect(change.mock.calls).toEqual([
    [{ placement: { x: 3 } }],
    [{ label: "New" }],
  ]);
  expect(node.placement.x).toBe(1);
  expect(commit).toHaveBeenCalledOnce();
});

it("ignores invalid numbers, disabled state and missing selection", () => {
  const change = vi.fn(),
    commit = vi.fn();
  const { result, rerender } = renderHook(
    ({ disabled, selectedNode }) =>
      useGridraInspectorPanel({
        selectedNode,
        disabled,
        onChange: change,
        onCommit: commit,
      }),
    {
      initialProps: {
        disabled: false,
        selectedNode: node as typeof node | null,
      },
    },
  );
  for (const value of ["", "Infinity", "no"])
    result.current.handlePlacementChange("x", value);

  rerender({ disabled: true, selectedNode: node });
  result.current.handleLabelChange("No");
  result.current.commit();
  rerender({ disabled: false, selectedNode: null });
  result.current.handlePlacementChange("x", "3");

  expect(change).not.toHaveBeenCalled();
  expect(commit).not.toHaveBeenCalled();
});
