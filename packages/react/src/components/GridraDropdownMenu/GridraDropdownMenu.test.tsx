import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraDropdownMenu } from "./GridraDropdownMenu";

afterEach(() => {
  cleanup();
});

describe("GridraDropdownMenu", () => {
  const basicItems = [
    { id: "new", label: "New" },
    { id: "open", label: "Open" },
    { type: "separator" as const },
    { id: "delete", label: "Delete", destructive: true },
  ];

  it("opens on trigger click with default placement and size", () => {
    render(
      <GridraDropdownMenu items={basicItems}>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132,
      }),
      configurable: true,
    });

    expect(screen.queryByRole("menu")).toBeNull();

    fireEvent.click(trigger);
    const menu = screen.getByRole("menu");
    expect(menu).toBeDefined();
    expect(menu.className).toContain("gridra-dropdown-menu--bottom");
    expect(menu.className).toContain("gridra-dropdown-menu--md");
  });

  it("flips placement with start alignment when the menu would overflow", () => {
    render(
      <GridraDropdownMenu items={basicItems} placement="bottom">
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 720,
        left: 120,
        width: 80,
        height: 32,
        right: 200,
        bottom: 752,
      }),
      configurable: true,
    });

    fireEvent.click(trigger);
    const menu = screen.getByRole("menu") as HTMLElement;
    Object.defineProperty(menu, "getBoundingClientRect", {
      value: () => ({
        top: 0,
        left: 0,
        width: 160,
        height: 80,
        right: 160,
        bottom: 80,
      }),
      configurable: true,
    });

    fireEvent(window, new Event("resize"));

    expect(menu.className).toContain("gridra-dropdown-menu--top");
    expect(menu.style.left).toBe("120px");
    expect(menu.style.top).toBe("636px");
  });

  it("renders menuitem and separator roles", () => {
    render(
      <GridraDropdownMenu items={basicItems} defaultOpen>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    expect(screen.getByRole("menuitem", { name: "New" })).toBeDefined();
    expect(screen.getByRole("menuitem", { name: "Open" })).toBeDefined();
    expect(screen.getByRole("menuitem", { name: "Delete" })).toBeDefined();
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("calls onAction with item id on click and closes", () => {
    const onAction = vi.fn();
    render(
      <GridraDropdownMenu items={basicItems} onAction={onAction} defaultOpen>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
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
      <GridraDropdownMenu items={disabledItems} onAction={onAction} defaultOpen>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "B" }));
    expect(onAction).not.toHaveBeenCalled();
    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("does not close on action when closeOnAction is false", () => {
    const onAction = vi.fn();
    render(
      <GridraDropdownMenu
        closeOnAction={false}
        items={basicItems}
        onAction={onAction}
        defaultOpen
      >
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    fireEvent.click(screen.getByRole("menuitem", { name: "New" }));
    expect(onAction).toHaveBeenCalledWith("new");
    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("closes on Escape", () => {
    render(
      <GridraDropdownMenu items={basicItems} defaultOpen>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes on outside pointerdown", () => {
    render(
      <GridraDropdownMenu items={basicItems} defaultOpen>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    const outside = document.createElement("div");
    document.body.appendChild(outside);
    fireEvent.pointerDown(outside);
    expect(screen.queryByRole("menu")).toBeNull();
    outside.remove();
  });

  it("sets aria-haspopup and aria-expanded on trigger", () => {
    render(
      <GridraDropdownMenu items={basicItems}>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" });
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
  });

  it("supports controlled open state", () => {
    const onOpenChange = vi.fn();
    render(
      <GridraDropdownMenu
        items={basicItems}
        open={false}
        onOpenChange={onOpenChange}
      >
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132,
      }),
      configurable: true,
    });

    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true, false);
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("does not open when disabled", () => {
    render(
      <GridraDropdownMenu items={basicItems} disabled>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Menu" }));
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("navigates with ArrowDown and ArrowUp", () => {
    render(
      <GridraDropdownMenu items={basicItems} defaultOpen>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    const menu = screen.getByRole("menu");

    expect(screen.getByRole("menuitem", { name: "New" }).tabIndex).toBe(0);

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "Open" }).tabIndex).toBe(0);
    expect(screen.getByRole("menuitem", { name: "New" }).tabIndex).toBe(-1);

    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(screen.getByRole("menuitem", { name: "New" }).tabIndex).toBe(0);
  });

  it("activates item with Enter", () => {
    const onAction = vi.fn();
    render(
      <GridraDropdownMenu items={basicItems} onAction={onAction} defaultOpen>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: "ArrowDown" });
    fireEvent.keyDown(menu, { key: "Enter" });
    expect(onAction).toHaveBeenCalledWith("open");
  });

  it("activates item with Space", () => {
    const onAction = vi.fn();
    render(
      <GridraDropdownMenu items={basicItems} onAction={onAction} defaultOpen>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    const menu = screen.getByRole("menu");
    fireEvent.keyDown(menu, { key: " " });
    expect(onAction).toHaveBeenCalledWith("new");
  });

  it("Home and End jump to first and last enabled item", () => {
    render(
      <GridraDropdownMenu items={basicItems} defaultOpen>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    const menu = screen.getByRole("menu");

    fireEvent.keyDown(menu, { key: "End" });
    expect(screen.getByRole("menuitem", { name: "Delete" }).tabIndex).toBe(0);

    fireEvent.keyDown(menu, { key: "Home" });
    expect(screen.getByRole("menuitem", { name: "New" }).tabIndex).toBe(0);
  });

  it("skips disabled items during keyboard navigation", () => {
    const mixedItems = [
      { id: "a", label: "A" },
      { id: "b", label: "B", disabled: true },
      { id: "c", label: "C" },
    ];
    render(
      <GridraDropdownMenu items={mixedItems} defaultOpen>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    const menu = screen.getByRole("menu");

    expect(screen.getByRole("menuitem", { name: "A" }).tabIndex).toBe(0);

    fireEvent.keyDown(menu, { key: "ArrowDown" });
    expect(screen.getByRole("menuitem", { name: "C" }).tabIndex).toBe(0);
    expect(screen.getByRole("menuitem", { name: "B" }).tabIndex).toBe(-1);

    fireEvent.keyDown(menu, { key: "ArrowUp" });
    expect(screen.getByRole("menuitem", { name: "A" }).tabIndex).toBe(0);
  });

  it("opens with ArrowDown on trigger", () => {
    render(
      <GridraDropdownMenu items={basicItems}>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    const trigger = screen.getByRole("button", { name: "Menu" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132,
      }),
      configurable: true,
    });

    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByRole("menu")).toBeDefined();
  });

  it("applies destructive class", () => {
    render(
      <GridraDropdownMenu items={basicItems} defaultOpen>
        <button type="button">Menu</button>
      </GridraDropdownMenu>,
    );
    const deleteItem = screen.getByRole("menuitem", { name: "Delete" });
    expect(deleteItem.className).toContain("gridra-dropdown-menu__item--destructive");
  });
});
