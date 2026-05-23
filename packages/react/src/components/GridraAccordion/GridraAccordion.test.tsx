import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraAccordion, type GridraAccordionItem } from "./GridraAccordion";

afterEach(() => {
  cleanup();
});

function makeItems(count: number): GridraAccordionItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    title: `Title ${i}`,
    content: `Content ${i}`,
  }));
}

describe("GridraAccordion", () => {
  it("renders title buttons for each item", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} />);
    expect(screen.getByRole("button", { name: "Title 0" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Title 1" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Title 2" })).toBeTruthy();
  });

  it("renders nothing inside root for empty items", () => {
    const { container } = render(<GridraAccordion items={[]} />);
    const root = container.querySelector(".gridra-accordion");
    expect(root).toBeTruthy();
    expect(root?.children.length).toBe(0);
  });

  it("defaults first enabled item as open in single mode", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} />);
    expect(screen.getByText("Content 0")).toBeTruthy();
    expect(screen.queryByText("Content 1")).toBeNull();
    expect(screen.queryByText("Content 2")).toBeNull();
  });

  it("sets aria-expanded on headers", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} />);
    const headers = screen.getAllByRole("button");
    expect(headers[0].getAttribute("aria-expanded")).toBe("true");
    expect(headers[1].getAttribute("aria-expanded")).toBe("false");
    expect(headers[2].getAttribute("aria-expanded")).toBe("false");
  });

  it("links header and panel with aria-controls and aria-labelledby", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} />);
    const header = screen.getByRole("button", { name: "Title 0" });
    const panel = screen.getByRole("region");
    expect(header.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(header.id);
  });

  it("closes previous item when opening another in single mode", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} />);
    expect(screen.getByText("Content 0")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Title 1" }));
    expect(screen.queryByText("Content 0")).toBeNull();
    expect(screen.getByText("Content 1")).toBeTruthy();
  });

  it("does not close open item on re-click when collapsible is false (single)", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} />);
    const btn = screen.getByRole("button", { name: "Title 0" });
    fireEvent.click(btn);
    expect(screen.getByText("Content 0")).toBeTruthy();
  });

  it("closes open item on re-click when collapsible is true (single)", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} collapsible={true} />);
    const btn = screen.getByRole("button", { name: "Title 0" });
    fireEvent.click(btn);
    expect(screen.queryByText("Content 0")).toBeNull();
    expect(screen.queryByText("Content 1")).toBeNull();
  });

  it("allows multiple items open simultaneously in multiple mode", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} type="multiple" defaultValue={[]} />);
    fireEvent.click(screen.getByRole("button", { name: "Title 0" }));
    fireEvent.click(screen.getByRole("button", { name: "Title 2" }));
    expect(screen.getByText("Content 0")).toBeTruthy();
    expect(screen.getByText("Content 2")).toBeTruthy();
    expect(screen.queryByText("Content 1")).toBeNull();
  });

  it("closes a single item in multiple mode on re-click", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} type="multiple" defaultValue={["item-0"]} />);
    fireEvent.click(screen.getByRole("button", { name: "Title 0" }));
    expect(screen.queryByText("Content 0")).toBeNull();
  });

  it("does not toggle disabled items", () => {
    const items = makeItems(3);
    items[1].disabled = true;
    render(<GridraAccordion items={items} defaultValue="item-0" />);
    fireEvent.click(screen.getByRole("button", { name: "Title 1" }));
    expect(screen.getByText("Content 0")).toBeTruthy();
    expect(screen.queryByText("Content 1")).toBeNull();
  });

  it("disabled items have disabled and aria-disabled attrs", () => {
    const items = makeItems(3);
    items[1].disabled = true;
    render(<GridraAccordion items={items} />);
    const btn = screen.getByRole("button", { name: "Title 1" });
    expect(btn.hasAttribute("disabled")).toBe(true);
    expect(btn.getAttribute("aria-disabled")).toBe("true");
  });

  it("does not open a disabled id from defaultValue (single)", () => {
    const items = makeItems(3);
    items[0].disabled = true;
    render(<GridraAccordion items={items} defaultValue="item-0" />);
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("does not open a disabled id from defaultValue (multiple)", () => {
    const items = makeItems(3);
    items[0].disabled = true;
    render(<GridraAccordion items={items} type="multiple" defaultValue={["item-0", "item-1"]} />);
    expect(screen.getByText("Content 1")).toBeTruthy();
    expect(screen.queryByText("Content 0")).toBeNull();
  });

  it("ignores non-existent id in defaultValue (single)", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} defaultValue="nonexistent" />);
    expect(screen.getByText("Content 0")).toBeTruthy();
  });

  it("ignores non-existent id in defaultValue (multiple)", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} type="multiple" defaultValue={["nonexistent", "item-1"]} />);
    expect(screen.getByText("Content 1")).toBeTruthy();
    expect(screen.queryByText("Content 0")).toBeNull();
  });

  it("normalizes array value to first valid id in single mode", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} defaultValue={["item-2", "item-1"] as unknown as string} />);
    expect(screen.getByText("Content 2")).toBeTruthy();
  });

  it("normalizes string value to array in multiple mode", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} type="multiple" defaultValue={"item-1" as unknown as string[]} />);
    expect(screen.getByText("Content 1")).toBeTruthy();
    expect(screen.queryByText("Content 0")).toBeNull();
  });

  it("does not crash with duplicate item ids", () => {
    const items: GridraAccordionItem[] = [
      { id: "a", title: "First A", content: "First Content" },
      { id: "a", title: "Second A", content: "Second Content" },
      { id: "b", title: "B", content: "B Content" },
    ];
    render(<GridraAccordion items={items} defaultValue="a" />);
    expect(screen.getByText("First Content")).toBeTruthy();
  });

  it("supports controlled value", () => {
    const items = makeItems(3);
    const onValueChange = vi.fn();
    const { rerender } = render(
      <GridraAccordion items={items} value="item-0" onValueChange={onValueChange} />
    );
    fireEvent.click(screen.getByRole("button", { name: "Title 1" }));
    expect(onValueChange).toHaveBeenCalledWith("item-1", "item-0");
    expect(screen.getByText("Content 0")).toBeTruthy();
  });

  it("supports uncontrolled state changes", () => {
    const items = makeItems(3);
    const onValueChange = vi.fn();
    render(<GridraAccordion items={items} defaultValue="item-0" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Title 2" }));
    expect(onValueChange).toHaveBeenCalled();
    expect(screen.getByText("Content 2")).toBeTruthy();
    expect(screen.queryByText("Content 0")).toBeNull();
  });

  it("applies size class", () => {
    const items = makeItems(3);
    const { container } = render(<GridraAccordion items={items} size="sm" />);
    expect(container.querySelector(".gridra-accordion")?.className).toContain("gridra-accordion--sm");
  });

  it("applies variant class", () => {
    const items = makeItems(3);
    const { container } = render(<GridraAccordion items={items} variant="divided" />);
    expect(container.querySelector(".gridra-accordion")?.className).toContain("gridra-accordion--divided");
  });

  it("moves focus with ArrowDown", () => {
    const items = makeItems(4);
    render(<GridraAccordion items={items} />);
    const headers = screen.getAllByRole("button");
    headers[0].focus();
    fireEvent.keyDown(headers[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(headers[1]);
  });

  it("moves focus with ArrowUp", () => {
    const items = makeItems(4);
    render(<GridraAccordion items={items} />);
    const headers = screen.getAllByRole("button");
    headers[2].focus();
    fireEvent.keyDown(headers[2], { key: "ArrowUp" });
    expect(document.activeElement).toBe(headers[1]);
  });

  it("moves focus to first with Home", () => {
    const items = makeItems(4);
    render(<GridraAccordion items={items} />);
    const headers = screen.getAllByRole("button");
    headers[3].focus();
    fireEvent.keyDown(headers[3], { key: "Home" });
    expect(document.activeElement).toBe(headers[0]);
  });

  it("moves focus to last with End", () => {
    const items = makeItems(4);
    render(<GridraAccordion items={items} />);
    const headers = screen.getAllByRole("button");
    headers[0].focus();
    fireEvent.keyDown(headers[0], { key: "End" });
    expect(document.activeElement).toBe(headers[3]);
  });

  it("skips disabled items in keyboard navigation", () => {
    const items = makeItems(4);
    items[1].disabled = true;
    render(<GridraAccordion items={items} />);
    const headers = screen.getAllByRole("button");
    headers[0].focus();
    fireEvent.keyDown(headers[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(headers[2]);
    fireEvent.keyDown(headers[2], { key: "ArrowUp" });
    expect(document.activeElement).toBe(headers[0]);
  });

  it("unmounts closed panels", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} defaultValue="item-0" />);
    expect(screen.getByText("Content 0")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Title 2" }));
    expect(screen.queryByText("Content 0")).toBeNull();
    expect(screen.getByText("Content 2")).toBeTruthy();
  });

  it("uses role region for panels", () => {
    const items = makeItems(3);
    render(<GridraAccordion items={items} />);
    expect(screen.getByRole("region")).toBeTruthy();
  });
});
