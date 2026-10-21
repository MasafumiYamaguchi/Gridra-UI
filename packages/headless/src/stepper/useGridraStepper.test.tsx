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

it("allows returning to completed steps through caller-owned buttons", () => {
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
    screen.getByRole("button", { name: "B" }).getAttribute("aria-current"),
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

  rerender({ disabled: true });

  act(() => result.current.handleStepClick("a"));

  expect(onStepChange).toHaveBeenCalledOnce();
});
