import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraHoverCard } from "../index";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function Example({ disabled = false }) {
  const c = useGridraHoverCard({ showDelay: 10, hideDelay: 10, disabled });

  return (
    <>
      <button {...c.getTriggerProps()}>Open</button>
      {c.currentOpen ? (
        <div {...c.getContentProps()} aria-label="Custom card">
          <button>Inner</button>
        </div>
      ) : null}
    </>
  );
}

it("opens custom content and retains it when focus moves inside the card", () => {
  vi.useFakeTimers();
  render(<Example />);
  const trigger = screen.getByRole("button", { name: "Open" });

  fireEvent.focus(trigger);

  act(() => vi.advanceTimersByTime(10));
  const inner = screen.getByRole("button", { name: "Inner" });

  fireEvent.blur(trigger, { relatedTarget: inner });

  act(() => vi.advanceTimersByTime(20));

  expect(screen.getByRole("dialog")).toBeTruthy();

  fireEvent.keyDown(document, { key: "Escape" });

  expect(screen.queryByRole("dialog")).toBeNull();
});

it("cancels pending timers on unmount and does not open when disabled", () => {
  vi.useFakeTimers();
  const { rerender, unmount } = render(<Example disabled />);

  fireEvent.focus(screen.getByRole("button"));

  act(() => vi.runAllTimers());

  expect(screen.queryByRole("dialog")).toBeNull();

  rerender(<Example />);
  fireEvent.focus(screen.getByRole("button"));
  unmount();

  expect(vi.getTimerCount()).toBe(0);
});
