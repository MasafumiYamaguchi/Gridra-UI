import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraTreeView } from "../index";

afterEach(cleanup);

const items = [
  { id: "p", label: "Parent", children: [{ id: "c", label: "Child" }] },
  { id: "d", label: "Disabled", disabled: true },
];

it("expands custom rows and moves focus into a visible child", () => {
  function Example() {
    const tree = useGridraTreeView({ items });

    return (
      <>
        {tree.flatItems.map((row) => (
          <div key={row.key} {...tree.getRowProps(row.item, row.hasChildren)}>
            {row.item.label}
          </div>
        ))}
      </>
    );
  }
  render(<Example />);

  fireEvent.click(screen.getByText("Parent"));

  expect(screen.getByText("Child")).toBeTruthy();

  fireEvent.keyDown(screen.getByText("Parent"), { key: "ArrowDown" });

  expect(document.activeElement).toBe(screen.getByText("Child"));
});

it("rejects missing, disabled and leaf expansion and leaves controlled state to the owner", () => {
  const onExpandedIdsChange = vi.fn();
  const { result } = renderHook(() =>
    useGridraTreeView({ items, expandedIds: [], onExpandedIdsChange }),
  );
  act(() => {
    result.current.toggleExpand("missing");
    result.current.toggleExpand("d");
    result.current.toggleExpand("c");
  });

  expect(onExpandedIdsChange).not.toHaveBeenCalled();

  act(() => result.current.toggleExpand("p"));

  expect(onExpandedIdsChange).toHaveBeenCalledWith(["p"], []);
  expect(result.current.expandedSet.size).toBe(0);
});
