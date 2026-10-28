import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraSidebarToggle } from "../index";

afterEach(cleanup);

it("toggles a caller-owned button and respects disabled state", () => {
  function Example({ disabled = false }) {
    const s = useGridraSidebarToggle({ disabled });

    return <button {...s.getToggleProps()}>Toggle</button>;
  }
  const { rerender } = render(<Example />);
  const button = screen.getByRole("button");

  fireEvent.click(button);

  expect(button.getAttribute("aria-expanded")).toBe("true");

  rerender(<Example disabled />);
  fireEvent.click(button);

  expect(button.getAttribute("aria-expanded")).toBe("true");
});

it("honors cancellation and leaves controlled state to the owner", () => {
  const onOpenChange = vi.fn();

  function Example({ cancel = false }) {
    const s = useGridraSidebarToggle({ open: false, onOpenChange });

    return (
      <button
        {...s.getToggleProps({
          onClick: (e) => {
            if (cancel) e.preventDefault();
          },
        })}
      >
        Toggle
      </button>
    );
  }
  const { rerender } = render(<Example cancel />);

  fireEvent.click(screen.getByRole("button"));

  expect(onOpenChange).not.toHaveBeenCalled();

  rerender(<Example />);
  fireEvent.click(screen.getByRole("button"));

  expect(onOpenChange).toHaveBeenCalledWith(true, false);
  expect(screen.getByRole("button").getAttribute("aria-expanded")).toBe(
    "false",
  );
});
