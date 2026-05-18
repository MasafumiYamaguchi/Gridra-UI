import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraDialog } from "./GridraDialog";

afterEach(() => {
  cleanup();
});

describe("GridraDialog", () => {
  it("opens dialog on trigger click via portal", () => {
    render(
      <GridraDialog title="Test Dialog" content="Dialog body">
        <button type="button">Open</button>
      </GridraDialog>,
    );
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(screen.getByText("Test Dialog")).toBeDefined();
    expect(screen.getByText("Dialog body")).toBeDefined();
  });

  it("carries Gridra root and theme classes into the portal backdrop", () => {
    render(
      <div className="gridra-theme-light">
        <GridraDialog title="Themed Dialog" content="Dialog body">
          <button type="button">Open</button>
        </GridraDialog>
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    const backdrop = document.querySelector(".gridra-dialog__backdrop") as HTMLElement;

    expect(backdrop.className).toContain("gridra-root");
    expect(backdrop.className).toContain("gridra-theme-light");
  });

  it("renders title and description with correct IDs", () => {
    render(
      <GridraDialog
        content="Body"
        description="A description"
        open
        title="Title"
      />,
    );
    const dialog = screen.getByRole("dialog");
    const title = screen.getByText("Title");
    const desc = screen.getByText("A description");

    expect(dialog.getAttribute("aria-labelledby")).toBe(title.id);
    expect(dialog.getAttribute("aria-describedby")).toBe(desc.id);
  });

  it("closes on Escape key", () => {
    render(
      <GridraDialog content="Body" defaultOpen title="Dialog">
        <button type="button">Trigger</button>
      </GridraDialog>,
    );
    expect(screen.getByRole("dialog")).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not close on Escape when closeOnEscape is false", () => {
    render(
      <GridraDialog closeOnEscape={false} content="Body" open title="Dialog">
        <button type="button">Trigger</button>
      </GridraDialog>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("closes on backdrop pointerdown", () => {
    render(
      <GridraDialog content="Body" defaultOpen title="Dialog">
        <button type="button">Trigger</button>
      </GridraDialog>,
    );
    const backdrop = document.querySelector(".gridra-dialog__backdrop") as HTMLElement;
    fireEvent.pointerDown(backdrop);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not close on pointerdown inside dialog surface", () => {
    render(
      <GridraDialog content="Body" open title="Dialog">
        <button type="button">Trigger</button>
      </GridraDialog>,
    );
    const dialog = screen.getByRole("dialog");
    fireEvent.pointerDown(dialog);
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("does not close on backdrop when closeOnBackdropPointerDown is false", () => {
    render(
      <GridraDialog closeOnBackdropPointerDown={false} content="Body" open title="Dialog">
        <button type="button">Trigger</button>
      </GridraDialog>,
    );
    const backdrop = document.querySelector(".gridra-dialog__backdrop") as HTMLElement;
    fireEvent.pointerDown(backdrop);
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("close button closes dialog with correct label", () => {
    render(
      <GridraDialog closeLabel="Dismiss" content="Body" defaultOpen title="Dialog">
        <button type="button">Trigger</button>
      </GridraDialog>,
    );
    const closeButton = screen.getByRole("button", { name: "Dismiss" });
    expect(closeButton).toBeDefined();

    fireEvent.click(closeButton);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("hides close button when showCloseButton is false", () => {
    render(
      <GridraDialog content="Body" open showCloseButton={false} title="Dialog">
        <button type="button">Trigger</button>
      </GridraDialog>,
    );
    expect(screen.queryByRole("button", { name: "Close dialog" })).toBeNull();
  });

  it("sets aria-haspopup and aria-expanded on trigger", () => {
    render(
      <GridraDialog content="Body" title="Dialog">
        <button type="button">Trigger</button>
      </GridraDialog>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("supports controlled open state", () => {
    const onOpenChange = vi.fn();
    render(
      <GridraDialog
        content="Controlled"
        open={false}
        onOpenChange={onOpenChange}
        title="Dialog"
      >
        <button type="button">Trigger</button>
      </GridraDialog>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });

    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true, false);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("composes with existing trigger onClick", () => {
    const existingClick = vi.fn();
    render(
      <GridraDialog content="Body" title="Dialog">
        <button type="button" onClick={existingClick as unknown as React.MouseEventHandler}>
          Trigger
        </button>
      </GridraDialog>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });

    fireEvent.click(trigger);
    expect(existingClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("renders with size class", () => {
    render(
      <GridraDialog content="Body" open size="lg" title="Dialog" />,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toContain("gridra-dialog--lg");
  });

  it("renders without trigger element when children not provided", () => {
    render(
      <GridraDialog content="Body" open title="No Trigger Dialog" />,
    );
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("No Trigger Dialog")).toBeDefined();
  });
});
