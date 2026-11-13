import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraTooltip } from "../index";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function Example({ disabled = false }) {
  const t = useGridraTooltip({ showDelay: 10, disabled });

  return (
    <>
      <button {...t.getTriggerProps({ "aria-describedby": "existing" })}>
        Help
      </button>
      {t.currentOpen ? <div {...t.getContentProps()}>Explanation</div> : null}
    </>
  );
}

it("shows delayed custom content and preserves an existing description", () => {
  vi.useFakeTimers();
  render(<Example />);
  const trigger = screen.getByRole("button");

  fireEvent.focus(trigger);

  expect(screen.queryByRole("tooltip")).toBeNull();

  act(() => vi.advanceTimersByTime(10));
  const tooltip = screen.getByRole("tooltip");

  expect(trigger.getAttribute("aria-describedby")).toBe(
    "existing " + tooltip.id,
  );

  fireEvent.blur(trigger);

  expect(screen.queryByRole("tooltip")).toBeNull();
});

it("cancels pending display on blur, disabled state and unmount", () => {
  vi.useFakeTimers();
  const { rerender, unmount } = render(<Example />);

  fireEvent.focus(screen.getByRole("button"));
  fireEvent.blur(screen.getByRole("button"));

  act(() => vi.runAllTimers());

  expect(screen.queryByRole("tooltip")).toBeNull();

  rerender(<Example disabled />);
  fireEvent.focus(screen.getByRole("button"));

  act(() => vi.runAllTimers());

  expect(screen.queryByRole("tooltip")).toBeNull();

  unmount();

  expect(vi.getTimerCount()).toBe(0);
});

function DefaultDelayExample() {
  const t = useGridraTooltip();

  return (
    <>
      <button {...t.getTriggerProps()}>Help</button>
      {t.currentOpen ? <div {...t.getContentProps()}>Explanation</div> : null}
    </>
  );
}

it("waits for the default show delay when showDelay is omitted", () => {
  vi.useFakeTimers();
  render(<DefaultDelayExample />);

  fireEvent.mouseEnter(screen.getByRole("button"));
  act(() => vi.advanceTimersByTime(119));

  expect(screen.queryByRole("tooltip")).toBeNull();

  act(() => vi.advanceTimersByTime(1));

  expect(screen.getByRole("tooltip").style.position).toBe("fixed");
});
