import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraSelectableGrid } from "../index";

afterEach(cleanup);

it("selects and deselects caller-owned buttons without theme CSS", () => {
  function Example() {
    const grid = useGridraSelectableGrid({ items: [{ id: "a" }] });

    return <button {...grid.getItemProps("a")}>A</button>;
  }
  render(<Example />);
  const button = screen.getByRole("button");

  fireEvent.click(button);

  expect(button.getAttribute("aria-selected")).toBe("true");

  fireEvent.click(button);

  expect(button.getAttribute("aria-selected")).toBe("false");
  expect(button.className).toBe("");
});

it("sanitizes removed ids, ignores missing ids and preserves controlled state", () => {
  const onSelectionChange = vi.fn();
  const { result } = renderHook(() =>
    useGridraSelectableGrid({
      items: [{ id: "a" }],
      selectedId: "missing",
      onSelectionChange,
    }),
  );

  expect(result.current.selectedId).toBeNull();

  act(() => result.current.select("missing"));

  expect(onSelectionChange).not.toHaveBeenCalled();

  act(() => result.current.select("a"));

  expect(onSelectionChange).toHaveBeenCalledWith("a", null);
  expect(result.current.selectedId).toBeNull();
});

it("composes consumer onClick and respects preventDefault", () => {
  const onClick = vi.fn();
  const onPreventedClick = vi.fn((event: { preventDefault: () => void }) =>
    event.preventDefault(),
  );
  function Example() {
    const grid = useGridraSelectableGrid({
      items: [{ id: "a" }, { id: "b" }],
    });

    return (
      <>
        <button {...grid.getItemProps("a", { onClick })}>A</button>
        <button {...grid.getItemProps("b", { onClick: onPreventedClick })}>
          B
        </button>
      </>
    );
  }
  render(<Example />);
  const [a, b] = screen.getAllByRole("button");

  fireEvent.click(a);

  expect(onClick).toHaveBeenCalledTimes(1);
  expect(a.getAttribute("aria-selected")).toBe("true");

  fireEvent.click(b);

  expect(onPreventedClick).toHaveBeenCalledTimes(1);
  expect(b.getAttribute("aria-selected")).toBe("false");
  expect(a.getAttribute("aria-selected")).toBe("true");
});
