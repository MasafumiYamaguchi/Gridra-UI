import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraSidebar } from "../index";

afterEach(cleanup);

it("resizes caller-owned separators with keyboard and supports toggling", () => {
  function Example() {
    const s = useGridraSidebar({ resizable: true });

    return (
      <>
        <button onClick={s.toggleOpen} aria-expanded={s.currentOpen}>
          Toggle
        </button>
        <div {...s.getSeparatorProps()} />
      </>
    );
  }
  render(<Example />);
  const sep = screen.getByRole("separator");

  fireEvent.keyDown(sep, { key: "ArrowRight" });

  expect(sep.getAttribute("aria-valuenow")).toBe("288");

  fireEvent.keyDown(sep, { key: "End" });

  expect(sep.getAttribute("aria-valuenow")).toBe("480");

  fireEvent.click(screen.getByRole("button"));

  expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
    "false",
  );
});

it("keeps controlled open state and makes unavailable separators inert", () => {
  const onOpenChange = vi.fn();
  const { result } = renderHook(() =>
    useGridraSidebar({ open: false, onOpenChange, resizable: false }),
  );
  act(() => result.current.toggleOpen());

  expect(onOpenChange).toHaveBeenCalledWith(true, false);
  expect(result.current.currentOpen).toBe(false);
  expect(result.current.getSeparatorProps()["aria-disabled"]).toBe(true);
  expect(result.current.getSeparatorProps().onKeyDown).toBeUndefined();
});

function DragExample({ side }: { side: "left" | "right" }) {
  const s = useGridraSidebar({ resizable: true, side });

  return <div {...s.getSeparatorProps()} />;
}

it("resizes by dragging the separator on the left side", () => {
  render(<DragExample side="left" />);
  const sep = screen.getByRole("separator");

  fireEvent.mouseDown(sep, { clientX: 100 });
  fireEvent.mouseMove(sep, { clientX: 140 });

  expect(sep.getAttribute("aria-valuenow")).toBe("320");

  fireEvent.mouseUp(sep);
  fireEvent.mouseMove(sep, { clientX: 200 });

  expect(sep.getAttribute("aria-valuenow")).toBe("320");
});

it("inverts the drag direction for right-side sidebars", () => {
  render(<DragExample side="right" />);
  const sep = screen.getByRole("separator");

  fireEvent.mouseDown(sep, { clientX: 100 });
  fireEvent.mouseMove(sep, { clientX: 140 });

  expect(sep.getAttribute("aria-valuenow")).toBe("240");

  fireEvent.mouseMove(sep, { clientX: 20 });

  expect(sep.getAttribute("aria-valuenow")).toBe("360");
});
