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

function IdExample({ id, dialogId }: { id?: string; dialogId?: string }) {
  const d = useGridraDialog({ defaultOpen: true, id });

  return (
    <>
      <button {...d.getTriggerProps()}>Open</button>
      <div {...d.getDialogProps({ id: dialogId })}>
        <h2 id={d.titleId}>Title</h2>
      </div>
    </>
  );
}

it("uses the id option for both the dialog and the trigger's aria-controls", () => {
  render(<IdExample id="custom-dialog" />);

  expect(screen.getByRole("dialog").id).toBe("custom-dialog");
  expect(
    screen.getByRole("button", { name: "Open" }).getAttribute("aria-controls"),
  ).toBe("custom-dialog");
});

it("does not overwrite an id passed to getDialogProps", () => {
  render(<IdExample dialogId="direct-id" />);

  expect(screen.getByRole("dialog").id).toBe("direct-id");
});

it("focuses the dialog itself when it has no focusable content", () => {
  render(<IdExample />);

  expect(document.activeElement).toBe(screen.getByRole("dialog"));
});
