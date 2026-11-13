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

function Example() {
  const tree = useGridraTreeView({ items });

  return (
    <>
      {tree.flatItems.map((row) => (
        <div key={row.key} {...tree.getRowProps(row.item)}>
          {row.item.label}
        </div>
      ))}
    </>
  );
}

it("expands custom rows and moves focus into a visible child", () => {
  render(<Example />);

  fireEvent.click(screen.getByText("Parent"));

  expect(screen.getByText("Child")).toBeTruthy();

  fireEvent.keyDown(screen.getByText("Parent"), { key: "ArrowDown" });

  expect(document.activeElement).toBe(screen.getByText("Child"));
});

it("moves ArrowLeft focus from a child to its parent, then collapses the parent", () => {
  render(<Example />);

  fireEvent.click(screen.getByText("Parent"));
  fireEvent.keyDown(screen.getByText("Parent"), { key: "ArrowDown" });
  fireEvent.keyDown(screen.getByText("Child"), { key: "ArrowLeft" });

  expect(document.activeElement).toBe(screen.getByText("Parent"));
  expect(screen.getByText("Child")).toBeTruthy();

  fireEvent.keyDown(screen.getByText("Parent"), { key: "ArrowLeft" });

  expect(screen.queryByText("Child")).toBeNull();
  expect(document.activeElement).toBe(screen.getByText("Parent"));
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
  expect(result.current.isExpanded("p")).toBe(false);
});
