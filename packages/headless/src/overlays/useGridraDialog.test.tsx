import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraDialog } from "../index";

afterEach(cleanup);

function Example({
  open,
  onOpenChange,
}: {
  open?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
}) {
  const d = useGridraDialog({ open, onOpenChange });

  return (
    <>
      <button {...d.getTriggerProps()}>Open</button>
      {d.currentOpen ? (
        <div {...d.getBackdropProps()} data-testid="backdrop">
          <div {...d.getDialogProps()}>
            <h2 id={d.titleId}>Title</h2>
            <button {...d.getCloseProps()}>Close</button>
            <button>Last</button>
          </div>
        </div>
      ) : null}
    </>
  );
}

it("opens custom markup, traps focus, closes and restores focus", () => {
  render(<Example />);
  const trigger = screen.getByRole("button", { name: "Open" });
  trigger.focus();

  fireEvent.click(trigger);

  const close = screen.getByRole("button", { name: "Close" });

  expect(document.activeElement).toBe(close);

  const last = screen.getByRole("button", { name: "Last" });
  last.focus();

  fireEvent.keyDown(last, { key: "Tab" });

  expect(document.activeElement).toBe(close);

  fireEvent.keyDown(document, { key: "Escape" });

  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

it("keeps controlled state external and ignores pointerdown inside content", () => {
  const onOpenChange = vi.fn();
  render(<Example open onOpenChange={onOpenChange} />);

  fireEvent.pointerDown(screen.getByRole("heading"));

  expect(onOpenChange).not.toHaveBeenCalled();

  fireEvent.pointerDown(screen.getByTestId("backdrop"));

  expect(onOpenChange).toHaveBeenCalledWith(false, true);
  expect(screen.getByRole("dialog")).toBeTruthy();
});
