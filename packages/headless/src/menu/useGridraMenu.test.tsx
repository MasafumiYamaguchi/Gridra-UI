import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraMenu } from "../index";

afterEach(cleanup);

const items = [
  { id: "a", label: "A" },
  { id: "disabled", label: "Disabled", disabled: true },
  { id: "b", label: "B" },
];

it("activates caller-owned items and moves focus past disabled items", () => {
  function Example() {
    const menu = useGridraMenu({ items, defaultActiveId: "a" });

    return (
      <nav {...menu.getRootProps()}>
        {items.map((item) => (
          <button key={item.id} {...menu.getItemProps(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>
    );
  }
  render(<Example />);
  const firstButton = screen.getByRole("button", { name: "A" });
  firstButton.focus();

  fireEvent.keyDown(firstButton, { key: "ArrowDown" });

  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: "B" }),
  );

  fireEvent.click(screen.getByRole("button", { name: "B" }));

  expect(
    screen.getByRole("button", { name: "B" }).getAttribute("aria-current"),
  ).toBe("page");
});

it("sanitizes invalid controlled ids and ignores disabled actions", () => {
  const onAction = vi.fn();
  const onActiveIdChange = vi.fn();
  const { result } = renderHook(() =>
    useGridraMenu({ items, activeId: "missing", onAction, onActiveIdChange }),
  );
  act(() => result.current.handleActivate("disabled"));

  expect(onAction).not.toHaveBeenCalled();

  act(() => result.current.handleActivate("a"));

  expect(onActiveIdChange).toHaveBeenCalledWith("a", undefined);
  expect(result.current.safeActiveId).toBeUndefined();
});
