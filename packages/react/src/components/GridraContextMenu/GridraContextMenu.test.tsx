import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraContextMenu } from "./GridraContextMenu";

afterEach(() => {
  cleanup();
});

describe("GridraContextMenu", () => {
  const basicItems = [
    { id: "new", label: "New" },
    { id: "open", label: "Open" },
    { type: "separator" as const },
    { id: "delete", label: "Delete", destructive: true },
  ];

  it("renders target only while closed", () => {
    render(
      <GridraContextMenu items={basicItems}>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    expect(screen.getByTestId("target")).toBeDefined();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("opens on contextmenu and prevents native menu", () => {
    render(
      <GridraContextMenu items={basicItems}>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    const target = screen.getByTestId("target");

    const nativePrevented = fireEvent.contextMenu(target);
    expect(nativePrevented).toBe(false);

    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("sets aria-haspopup and aria-expanded on target", () => {
    render(
      <GridraContextMenu items={basicItems}>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    const target = screen.getByTestId("target");
    expect(target.getAttribute("aria-haspopup")).toBe("menu");
    expect(target.getAttribute("aria-expanded")).toBe("false");

    fireEvent.contextMenu(target);
    expect(target.getAttribute("aria-expanded")).toBe("true");
  });

  it("renders menuitem and separator roles", () => {
    render(
      <GridraContextMenu items={basicItems} defaultOpen>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    expect(screen.getByRole("menuitem", { name: "New" })).toBeDefined();
    expect(screen.getByRole("menuitem", { name: "Open" })).toBeDefined();
    expect(screen.getByRole("menuitem", { name: "Delete" })).toBeDefined();
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("calls onAction with item id on click and closes", () => {
    const onAction = vi.fn();
    render(
      <GridraContextMenu items={basicItems} onAction={onAction} defaultOpen>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "New" }));
    expect(onAction).toHaveBeenCalledWith("new");
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("does not call onAction for disabled items", () => {
    const onAction = vi.fn();
    const disabledItems = [
      { id: "a", label: "A" },
      { id: "b", label: "B", disabled: true },
    ];
    render(
      <GridraContextMenu items={disabledItems} onAction={onAction} defaultOpen>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "B" }));
    expect(onAction).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("does not close on action when closeOnAction is false", () => {
    const onAction = vi.fn();
    render(
      <GridraContextMenu
        closeOnAction={false}
        items={basicItems}
        onAction={onAction}
        defaultOpen
      >
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "New" }));
    expect(onAction).toHaveBeenCalledWith("new");
    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("closes on Escape", () => {
    render(
      <GridraContextMenu items={basicItems} defaultOpen>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes on outside pointerdown", () => {
    render(
      <GridraContextMenu items={basicItems} defaultOpen>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    const outside = document.createElement("div");
    document.body.appendChild(outside);
    fireEvent.pointerDown(outside);
    expect(screen.queryByRole("menu")).toBeNull();
    outside.remove();
  });

  it("composes with existing target handlers", () => {
    const onContextMenu = vi.fn();
    const onKeyDown = vi.fn();
    render(
      <GridraContextMenu items={basicItems}>
        <div data-testid="target" onContextMenu={onContextMenu as unknown as React.MouseEventHandler} onKeyDown={onKeyDown as unknown as React.KeyboardEventHandler}>
          Target
        </div>
      </GridraContextMenu>,
    );
    const target = screen.getByTestId("target");

    fireEvent.contextMenu(target);
    expect(onContextMenu).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("menu")).toBeDefined();

    fireEvent.keyDown(target, { key: "ContextMenu" });
    expect(onKeyDown).toHaveBeenCalledTimes(1);
  });

  it("navigates with ArrowDown and ArrowUp", () => {
    render(
      <GridraContextMenu items={basicItems} defaultOpen>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    const menu = screen.getByRole("menu");

    expect(screen.getByRole("menuitem", { name: "New" }).tabIndex).toBe(0);

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Open" }).tabIndex).toBe(0);

    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(screen.getByRole("menuitem", { name: "New" }).tabIndex).toBe(0);
  });

  it("Home and End jump to first and last enabled item", () => {
    render(
      <GridraContextMenu items={basicItems} defaultOpen>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    const menu = screen.getByRole("menu");

    fireEvent.keyDown(menu, { key: "End" });
    expect(screen.getByRole("menuitem", { name: "Delete" }).tabIndex).toBe(0);

    fireEvent.keyDown(menu, { key: "Home" });
    expect(screen.getByRole("menuitem", { name: "New" }).tabIndex).toBe(0);
  });

  it("activates item with Enter", () => {
    const onAction = vi.fn();
    render(
      <GridraContextMenu items={basicItems} onAction={onAction} defaultOpen>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "Enter" });
    expect(onAction).toHaveBeenCalledWith("new");
  });

  it("skips disabled items during keyboard navigation", () => {
    const mixedItems = [
      { id: "a", label: "A" },
      { id: "b", label: "B", disabled: true },
      { id: "c", label: "C" },
    ];
    render(
      <GridraContextMenu items={mixedItems} defaultOpen>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    const menu = screen.getByRole("menu");

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "C" }).tabIndex).toBe(0);

    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(screen.getByRole("menuitem", { name: "A" }).tabIndex).toBe(0);
  });

  it("applies size class", () => {
    render(
      <GridraContextMenu items={basicItems} defaultOpen size="sm">
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    const menu = screen.getByRole("menu");
    expect(menu.className).toContain("gridra-dropdown-menu--sm");
  });

  it("supports controlled open state", () => {
    const onOpenChange = vi.fn();
    render(
      <GridraContextMenu
        items={basicItems}
        open={false}
        onOpenChange={onOpenChange}
      >
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    const target = screen.getByTestId("target");

    fireEvent.contextMenu(target);
    expect(onOpenChange).toHaveBeenCalledWith(true, false);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("does not open when disabled", () => {
    render(
      <GridraContextMenu items={basicItems} disabled>
        <div data-testid="target">Target</div>
      </GridraContextMenu>,
    );
    fireEvent.contextMenu(screen.getByTestId("target"));
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
