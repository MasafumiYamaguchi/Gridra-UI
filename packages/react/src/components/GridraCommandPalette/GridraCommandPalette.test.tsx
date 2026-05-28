import { useState } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraCommandPalette } from "./GridraCommandPalette";

afterEach(() => {
  cleanup();
});

describe("GridraCommandPalette", () => {
  const basicItems = [
    { id: "new", label: "New File", description: "Create", group: "File", keywords: ["add"] },
    { id: "open", label: "Open", description: "Browse", group: "File" },
    { id: "cut", label: "Cut", group: "Edit" },
    { id: "copy", label: "Copy", group: "Edit" },
    { id: "delete", label: "Delete", destructive: true },
    { id: "locked", label: "Locked", disabled: true },
  ];

  it("renders nothing when closed", () => {
    render(<GridraCommandPalette items={basicItems} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders modal palette when open", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen />);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeDefined();
    expect(dialog.getAttribute("aria-modal")).toBe("true");
  });

  it("does not crash during server render when controlled open", () => {
    expect(() =>
      renderToString(<GridraCommandPalette items={basicItems} open />),
    ).not.toThrow();
  });

  it("carries Gridra root and theme classes into the portal backdrop", () => {
    render(
      <div className="gridra-theme-light">
        <GridraCommandPalette items={basicItems} defaultOpen />
      </div>,
    );
    const backdrop = document.querySelector(".gridra-command-palette__backdrop") as HTMLElement;

    expect(backdrop.className).toContain("gridra-root");
    expect(backdrop.className).toContain("gridra-theme-light");
  });

  it("filters commands by label", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen query="new" />);
    expect(screen.getByText("New File")).toBeDefined();
    expect(screen.queryByText("Open")).toBeNull();
    expect(screen.queryByText("Cut")).toBeNull();
  });

  it("filters by description", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen query="browse" />);
    expect(screen.getByText("Open")).toBeDefined();
    expect(screen.queryByText("New File")).toBeNull();
  });

  it("filters by keywords", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen query="add" />);
    expect(screen.getByText("New File")).toBeDefined();
  });

  it("matches JSX labels through keywords without relying on ReactNode stringification", () => {
    render(
      <GridraCommandPalette
        items={[
          { id: "jsx", label: <span>Rendered Label</span>, keywords: ["semantic"] },
        ]}
        defaultOpen
        query="semantic"
      />,
    );

    expect(screen.getByText("Rendered Label")).toBeDefined();
  });

  it("does not match JSX labels through object stringification", () => {
    render(
      <GridraCommandPalette
        items={[
          { id: "jsx", label: <span>Rendered Label</span> },
        ]}
        defaultOpen
        query="object"
      />,
    );

    expect(screen.queryByText("Rendered Label")).toBeNull();
    expect(screen.getByText("No commands found.")).toBeDefined();
  });

  it("shows empty state when nothing matches", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen query="zzz" />);
    expect(screen.getByText("No commands found.")).toBeDefined();
  });

  it("calls onAction on Enter and closes", () => {
    const onAction = vi.fn();
    render(
      <GridraCommandPalette items={basicItems} onAction={onAction} defaultOpen query="new" />,
    );
    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Enter" });
    expect(onAction).toHaveBeenCalledWith("new");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("calls onAction on click and closes", () => {
    const onAction = vi.fn();
    render(
      <GridraCommandPalette items={basicItems} onAction={onAction} defaultOpen query="copy" />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Copy/ }));
    expect(onAction).toHaveBeenCalledWith("copy");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("navigates with ArrowDown and ArrowUp", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen />);
    const dialog = screen.getByRole("dialog");
    const buttons = screen.getAllByRole("button");

    const newFile = buttons.find((b) => b.textContent?.includes("New File"))!;
    const open = buttons.find((b) => b.textContent?.includes("Open") && b.textContent?.includes("Browse"))!;

    expect(newFile.tabIndex).toBe(0);

    fireEvent.keyDown(dialog, { key: "ArrowDown" });
    expect(newFile.tabIndex).toBe(-1);
    expect(open.tabIndex).toBe(0);

    fireEvent.keyDown(dialog, { key: "ArrowUp" });
    expect(open.tabIndex).toBe(-1);
    expect(newFile.tabIndex).toBe(0);
  });

  it("Home and End jump to extremes", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen />);
    const dialog = screen.getByRole("dialog");
    const buttons = screen.getAllByRole("button");
    const deleteBtn = buttons.find((b) => b.textContent?.includes("Delete"))!;
    const newFile = buttons.find((b) => b.textContent?.includes("New File"))!;

    fireEvent.keyDown(dialog, { key: "End" });
    expect(deleteBtn.tabIndex).toBe(0);

    fireEvent.keyDown(dialog, { key: "Home" });
    expect(newFile.tabIndex).toBe(0);
  });

  it("skips disabled items during navigation", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen />);
    const dialog = screen.getByRole("dialog");
    const buttons = screen.getAllByRole("button");
    const locked = buttons.find((b) => b.textContent?.includes("Locked"))!;
    const deleteBtn = buttons.find((b) => b.textContent?.includes("Delete"))!;

    fireEvent.keyDown(dialog, { key: "End" });
    expect(deleteBtn.tabIndex).toBe(0);
    expect(locked.tabIndex).toBe(-1);

    fireEvent.keyDown(dialog, { key: "ArrowUp" });
    expect(deleteBtn.tabIndex).toBe(-1);
    const copy = buttons.find((b) => b.textContent?.includes("Copy"))!;
    expect(copy.tabIndex).toBe(0);
  });

  it("disabled items do not call onAction", () => {
    const onAction = vi.fn();
    render(
      <GridraCommandPalette items={basicItems} onAction={onAction} defaultOpen query="lock" />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Locked/ }));
    expect(onAction).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("closes on backdrop pointerdown", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen />);
    const backdrop = document.querySelector(".gridra-command-palette__backdrop") as HTMLElement;
    fireEvent.pointerDown(backdrop);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes on Escape", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("does not close on Escape when disabled", () => {
    render(<GridraCommandPalette closeOnEscape={false} items={basicItems} defaultOpen />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("resets query on close", () => {
    function Harness() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button onClick={() => setOpen(true)} type="button">
            Reopen
          </button>
          <GridraCommandPalette
            items={basicItems}
            onOpenChange={(next) => setOpen(next)}
            open={open}
          />
        </>
      );
    }

    render(<Harness />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "new" } });
    expect(screen.getByText("New File")).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Reopen" }));
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("");
  });

  it("does not reset a controlled query on close", () => {
    const onQueryChange = vi.fn();
    render(
      <GridraCommandPalette
        items={basicItems}
        defaultOpen
        onQueryChange={onQueryChange}
        query="copy"
      />,
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onQueryChange).not.toHaveBeenCalled();
  });

  it("supports controlled query", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen query="copy" />);
    const input = screen.getByRole("textbox");
    expect((input as HTMLInputElement).value).toBe("copy");
    expect(screen.getByText("Copy")).toBeDefined();
    expect(screen.queryByText("New File")).toBeNull();
  });

  it("renders group labels", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen />);
    expect(screen.getByText("File")).toBeDefined();
    expect(screen.getByText("Edit")).toBeDefined();
  });

  it("closes via close button", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen />);
    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("renders the close button inside the header", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen />);
    const closeButton = screen.getByRole("button", { name: "Close" });
    const header = closeButton.closest(".gridra-command-palette__header");

    expect(header).toBeDefined();
  });

  it("traps Tab focus inside the palette", () => {
    render(<GridraCommandPalette items={basicItems} defaultOpen />);
    const dialog = screen.getByRole("dialog");
    const closeButton = screen.getByRole("button", { name: "Close" });
    const activeItem = screen.getByRole("button", { name: /New File/ });

    activeItem.focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(document.activeElement).toBe(activeItem);
  });

  it("uses custom placeholder, title, and empty label", () => {
    render(
      <GridraCommandPalette
        emptyLabel="Nothing to see"
        items={basicItems}
        defaultOpen
        placeholder="Find..."
        query="zzz"
        title="My Commands"
      />,
    );
    expect(screen.getByText("My Commands")).toBeDefined();
    expect(screen.getByPlaceholderText("Find...")).toBeDefined();
    expect(screen.getByText("Nothing to see")).toBeDefined();
  });
});
