import { renderHook } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { useGridraBreadcrumb } from "./useGridraBreadcrumb";

it("retains context when collapsing and exposes navigation states", () => {
  const { result } = renderHook(() =>
    useGridraBreadcrumb({
      items: [
        { id: "a", label: "A", href: "#a" },
        { id: "b", label: "B" },
        { id: "c", label: "C" },
        { id: "d", label: "D", current: true },
      ],
      maxItems: 3,
    }),
  );

  expect(result.current.visibleItems.map((e) => e.index)).toEqual([0, -1, 3]);
  expect(
    result.current.getItemState({
      id: "x",
      label: "X",
      href: "#",
      disabled: true,
    }).canNavigate,
  ).toBe(false);
});

it("reports invalid hierarchy and accepts nonfinite limits", () => {
  const invalid = vi.fn();
  const { result } = renderHook(() =>
    useGridraBreadcrumb({
      items: [{ id: "a", label: "A", parentId: "missing" }],
      maxItems: NaN,
      onHierarchyInvalid: invalid,
    }),
  );

  expect(invalid).toHaveBeenCalledWith([
    { itemId: "a", index: 0, reason: "missing-parent" },
  ]);
  expect(result.current.visibleItems).toHaveLength(1);
});
