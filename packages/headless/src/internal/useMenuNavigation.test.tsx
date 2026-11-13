import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { GridraDropdownMenuItem } from "../menu/menuItems";
import { isCommand } from "../menu/menuItems";
import { useMenuNavigation } from "./useMenuNavigation";

afterEach(cleanup);

const defaultItems: GridraDropdownMenuItem[] = [
  { id: "a", label: "A" },
  { type: "separator" },
  { id: "off", label: "Off", disabled: true },
  { id: "b", label: "B" },
  { id: "c", label: "C" },
];

function Menu({
  items = defaultItems,
  open = true,
  disabled = false,
  closeOnAction = true,
  onAction,
  close = () => {},
}: {
  items?: GridraDropdownMenuItem[];
  open?: boolean;
  disabled?: boolean;
  closeOnAction?: boolean;
  onAction?: (id: string) => void;
  close?: () => void;
}) {
  const navigation = useMenuNavigation({
    items,
    open,
    disabled,
    closeOnAction,
    onAction,
    close,
  });

  if (!open) {
    return null;
  }

  return (
    <div role="menu" onKeyDown={navigation.handleMenuKeyDown}>
      {items.filter(isCommand).map((item) => (
        <button key={item.id} {...navigation.getItemProps(item.id)}>
          {item.label}
        </button>
      ))}
      <output data-testid="active">
        {navigation.enabledIds[navigation.safeActiveIndex] ?? ""}
      </output>
    </div>
  );
}

function press(key: string) {
  return fireEvent.keyDown(screen.getByRole("menu"), { key });
}

describe("useMenuNavigation", () => {
  it("focuses the first enabled item when opened", () => {
    render(<Menu />);

    expect(document.activeElement).toBe(screen.getByText("A"));
    expect(screen.getByText("A").tabIndex).toBe(0);
    expect(screen.getByText("B").tabIndex).toBe(-1);
  });

  it("moves with arrows, wraps, and jumps with Home/End while skipping disabled items", () => {
    render(<Menu />);

    press("ArrowDown");

    expect(document.activeElement).toBe(screen.getByText("B"));

    press("End");

    expect(document.activeElement).toBe(screen.getByText("C"));

    press("ArrowDown");

    expect(document.activeElement).toBe(screen.getByText("A"));

    press("ArrowUp");

    expect(document.activeElement).toBe(screen.getByText("C"));

    press("Home");

    expect(document.activeElement).toBe(screen.getByText("A"));
    expect(screen.getByTestId("active").textContent).toBe("a");
  });

  it("prevents default and stops propagation only for handled keys", () => {
    const outer = vi.fn();
    render(
      <div onKeyDown={outer}>
        <Menu />
      </div>,
    );

    expect(press("ArrowDown")).toBe(false);
    expect(outer).not.toHaveBeenCalled();

    expect(press("a")).toBe(true);
    expect(outer).toHaveBeenCalledTimes(1);
  });

  it("activates the active item with Enter and Space and closes when requested", () => {
    const onAction = vi.fn();
    const close = vi.fn();
    render(<Menu onAction={onAction} close={close} />);

    press("Enter");

    expect(onAction).toHaveBeenLastCalledWith("a");
    expect(close).toHaveBeenCalledTimes(1);

    press("ArrowDown");
    press(" ");

    expect(onAction).toHaveBeenLastCalledWith("b");
    expect(close).toHaveBeenCalledTimes(2);
  });

  it("keeps the menu open after an action when closeOnAction is false", () => {
    const onAction = vi.fn();
    const close = vi.fn();
    render(<Menu closeOnAction={false} onAction={onAction} close={close} />);

    fireEvent.click(screen.getByText("B"));

    expect(onAction).toHaveBeenCalledWith("b");
    expect(close).not.toHaveBeenCalled();
  });

  it("ignores disabled items and a disabled menu", () => {
    const onAction = vi.fn();
    const { rerender } = render(<Menu onAction={onAction} />);
    const off = screen.getByText("Off") as HTMLButtonElement;

    expect(off.disabled).toBe(true);

    fireEvent.mouseEnter(off);

    expect(screen.getByTestId("active").textContent).toBe("a");

    rerender(<Menu disabled onAction={onAction} />);
    fireEvent.click(screen.getByText("A"));

    expect(onAction).not.toHaveBeenCalled();
  });

  it("closes on Tab without preventing the browser's focus move", () => {
    const close = vi.fn();
    render(<Menu close={close} />);

    expect(press("Tab")).toBe(true);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it("tracks hover as the active item", () => {
    render(<Menu />);

    fireEvent.mouseEnter(screen.getByText("C"));

    expect(screen.getByTestId("active").textContent).toBe("c");
    expect(screen.getByText("C").tabIndex).toBe(0);

    press("ArrowUp");

    expect(document.activeElement).toBe(screen.getByText("B"));
  });

  it("does not steal focus back to the first item on re-render with inline items", () => {
    function InlineItems() {
      const [, setCount] = useState(0);
      const navigation = useMenuNavigation({
        items: [
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ],
        open: true,
        close: () => {},
      });

      return (
        <div role="menu" onKeyDown={navigation.handleMenuKeyDown}>
          <button {...navigation.getItemProps("a")}>A</button>
          <button {...navigation.getItemProps("b")}>B</button>
          <button onClick={() => setCount((count) => count + 1)}>
            Rerender
          </button>
        </div>
      );
    }

    render(<InlineItems />);

    press("ArrowDown");

    expect(document.activeElement).toBe(screen.getByText("B"));

    fireEvent.click(screen.getByText("Rerender"));
    screen.getByText("B").focus();
    fireEvent.click(screen.getByText("Rerender"));

    expect(document.activeElement).toBe(screen.getByText("B"));

    press("ArrowUp");

    expect(document.activeElement).toBe(screen.getByText("A"));
  });

  it("refocuses the first item when the enabled items change", () => {
    const { rerender } = render(<Menu />);

    press("End");

    expect(document.activeElement).toBe(screen.getByText("C"));

    rerender(
      <Menu
        items={[
          { id: "b", label: "B" },
          { id: "c", label: "C" },
        ]}
      />,
    );

    expect(document.activeElement).toBe(screen.getByText("B"));
  });

  it("treats unknown ids as disabled items", () => {
    function Unknown() {
      const navigation = useMenuNavigation({
        items: defaultItems,
        open: true,
        close: () => {},
      });

      return <button {...navigation.getItemProps("missing")}>Missing</button>;
    }

    render(<Unknown />);

    const button = screen.getByText("Missing") as HTMLButtonElement;

    expect(button.disabled).toBe(true);
    expect(button.getAttribute("role")).toBe("menuitem");
    expect(button.tabIndex).toBe(-1);
  });
});

describe("isCommand", () => {
  it("separates commands from separators", () => {
    expect(isCommand({ id: "a", label: "A" })).toBe(true);
    expect(isCommand({ type: "separator" })).toBe(false);
    expect(defaultItems.filter(isCommand).map((item) => item.id)).toEqual([
      "a",
      "off",
      "b",
      "c",
    ]);
  });
});
