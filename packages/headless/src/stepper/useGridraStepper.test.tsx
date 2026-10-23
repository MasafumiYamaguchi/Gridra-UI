import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraStepper } from "../index";

afterEach(cleanup);

const items = [
  { id: "a", label: "A" },
  { id: "b", label: "B" },
  { id: "c", label: "C" },
];

it("moves forward and backward through caller-owned buttons", () => {
  function Example() {
    const s = useGridraStepper({ items, defaultCurrentId: "b" });

    return (
      <>
        {s.steps.map((x) => (
          <button key={x.item.id} {...s.getStepProps(x.item.id)}>
            {x.item.label}
          </button>
        ))}
      </>
    );
  }
  render(<Example />);

  fireEvent.click(screen.getByRole("button", { name: "C" }));

  expect(
    screen.getByRole("button", { name: "C" }).getAttribute("aria-current"),
  ).toBe("step");

  fireEvent.click(screen.getByRole("button", { name: "A" }));

  expect(
    screen.getByRole("button", { name: "A" }).getAttribute("aria-current"),
  ).toBe("step");
});

it("preserves controlled state, ignores missing ids and disabled navigation", () => {
  const onStepChange = vi.fn();
  const { result, rerender } = renderHook(
    ({ disabled }) =>
      useGridraStepper({ items, currentId: "b", onStepChange, disabled }),
    { initialProps: { disabled: false } },
  );
  act(() => result.current.handleStepClick("missing"));

  expect(onStepChange).not.toHaveBeenCalled();

  act(() => result.current.handleStepClick("a"));

  expect(onStepChange).toHaveBeenCalledWith("a", "b");
  expect(result.current.currentId).toBe("b");

  act(() => result.current.handleStepClick("c"));

  expect(onStepChange).toHaveBeenLastCalledWith("c", "b");
  expect(result.current.currentId).toBe("b");

  rerender({ disabled: true });

  act(() => result.current.handleStepClick("a"));

  expect(onStepChange).toHaveBeenCalledTimes(2);
});

it("ignores current and locked steps while allowing navigation past a locked step", () => {
  const onStepChange = vi.fn();
  const { result } = renderHook(() =>
    useGridraStepper({
      items: [items[0], { ...items[1], disabled: true }, items[2]],
      onStepChange,
    }),
  );

  act(() => result.current.handleStepClick("a"));
  act(() => result.current.handleStepClick("b"));

  expect(onStepChange).not.toHaveBeenCalled();
  expect(result.current.getStepProps("b")["aria-disabled"]).toBe(true);
  expect(result.current.getStepProps("c")["aria-disabled"]).toBeUndefined();

  act(() => result.current.handleStepClick("c"));

  expect(result.current.currentId).toBe("c");
  expect(result.current.progress).toBe(100);
  expect(onStepChange).toHaveBeenCalledExactlyOnceWith("c", "a");
});

it("uses the resolved current step as previous when a supplied id is invalid", () => {
  const onStepChange = vi.fn();
  const { result } = renderHook(() =>
    useGridraStepper({
      items,
      currentId: "missing",
      onStepChange,
    }),
  );

  act(() => result.current.handleStepClick("c"));

  expect(onStepChange).toHaveBeenCalledExactlyOnceWith("c", "a");
  expect(result.current.currentId).toBe("a");
});
