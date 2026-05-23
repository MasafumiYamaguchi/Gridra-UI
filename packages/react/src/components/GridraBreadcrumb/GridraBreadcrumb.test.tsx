import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraBreadcrumb, type GridraBreadcrumbItem } from "./GridraBreadcrumb";

afterEach(() => {
  cleanup();
});

function makeItems(count: number, overrides?: Partial<GridraBreadcrumbItem>[]): GridraBreadcrumbItem[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    label: `Item ${i}`,
    href: `/${i}`,
    ...overrides?.[i],
  }));
}

describe("GridraBreadcrumb", () => {
  it("renders a nav with aria-label", () => {
    const items = makeItems(3);
    render(<GridraBreadcrumb items={items} />);
    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(nav.tagName).toBe("NAV");
  });

  it("renders an ordered list", () => {
    const items = makeItems(3);
    render(<GridraBreadcrumb items={items} />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
  });

  it("renders each item label", () => {
    const items = makeItems(3);
    render(<GridraBreadcrumb items={items} />);
    expect(screen.getByText("Item 0")).toBeTruthy();
    expect(screen.getByText("Item 1")).toBeTruthy();
    expect(screen.getByText("Item 2")).toBeTruthy();
  });

  it("renders links for items with href", () => {
    const items = makeItems(3);
    render(<GridraBreadcrumb items={items} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(3);
    expect(links[0].getAttribute("href")).toBe("/0");
    expect(links[1].getAttribute("href")).toBe("/1");
    expect(links[2].getAttribute("href")).toBe("/2");
  });

  it("does not render a link for current item", () => {
    const items = makeItems(3);
    items[2].current = true;
    render(<GridraBreadcrumb items={items} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    const current = screen.getByText("Item 2");
    expect(current.getAttribute("aria-current")).toBe("page");
    expect(current.tagName).toBe("SPAN");
  });

  it("does not render a link for disabled item", () => {
    const items = makeItems(3);
    items[1].disabled = true;
    render(<GridraBreadcrumb items={items} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    const disabled = screen.getByText("Item 1");
    expect(disabled.tagName).toBe("SPAN");
    const li = disabled.closest("li");
    expect(li?.className).toContain("gridra-breadcrumb__item--disabled");
  });

  it("does not render a link for item without href", () => {
    const items = makeItems(3);
    items[1].href = undefined;
    render(<GridraBreadcrumb items={items} />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(screen.getByText("Item 1").tagName).toBe("SPAN");
  });

  it("renders separator between items but not at start or end", () => {
    const items = makeItems(3);
    render(<GridraBreadcrumb items={items} separator=">" />);
    const separators = screen.getAllByText(">");
    expect(separators).toHaveLength(2);
    separators.forEach((sep) => {
      expect(sep.getAttribute("aria-hidden")).toBe("true");
    });
  });

  it("uses default separator '/'", () => {
    const items = makeItems(3);
    render(<GridraBreadcrumb items={items} />);
    const separators = screen.getAllByText("/");
    expect(separators).toHaveLength(2);
  });

  it("renders single item without separator", () => {
    const items = makeItems(1);
    render(<GridraBreadcrumb items={items} />);
    const separators = screen.queryAllByText("/");
    expect(separators).toHaveLength(0);
  });

  it("applies size class", () => {
    const items = makeItems(3);
    const { container } = render(<GridraBreadcrumb items={items} size="sm" />);
    const nav = container.querySelector("nav");
    expect(nav?.className).toContain("gridra-breadcrumb--sm");
  });

  it("defaults to md size", () => {
    const items = makeItems(3);
    const { container } = render(<GridraBreadcrumb items={items} />);
    const nav = container.querySelector("nav");
    expect(nav?.className).toContain("gridra-breadcrumb--md");
  });

  it("shows all items when maxItems is not set", () => {
    const items = makeItems(10);
    render(<GridraBreadcrumb items={items} />);
    expect(screen.getByText("Item 0")).toBeTruthy();
    expect(screen.getByText("Item 5")).toBeTruthy();
    expect(screen.getByText("Item 9")).toBeTruthy();
  });

  it("collapses items when maxItems is set", () => {
    const items = makeItems(10);
    render(<GridraBreadcrumb items={items} maxItems={4} />);
    expect(screen.getByText("Item 0")).toBeTruthy();
    expect(screen.getByText("Item 8")).toBeTruthy();
    expect(screen.getByText("Item 9")).toBeTruthy();
    expect(screen.queryByText("Item 1")).toBeNull();
    expect(screen.queryByText("Item 7")).toBeNull();
  });

  it("shows ellipsis when items are collapsed", () => {
    const items = makeItems(10);
    render(<GridraBreadcrumb items={items} maxItems={4} />);
    const ellipsis = screen.getByText("\u2026");
    expect(ellipsis).toBeTruthy();
    expect(ellipsis.closest("li")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not collapse when maxItems >= items length", () => {
    const items = makeItems(3);
    render(<GridraBreadcrumb items={items} maxItems={5} />);
    expect(screen.getByText("Item 0")).toBeTruthy();
    expect(screen.getByText("Item 1")).toBeTruthy();
    expect(screen.getByText("Item 2")).toBeTruthy();
    expect(screen.queryByText("\u2026")).toBeNull();
  });

  it("treats maxItems < 3 as 3", () => {
    const items = makeItems(10);
    render(<GridraBreadcrumb items={items} maxItems={1} />);
    expect(screen.getByText("Item 0")).toBeTruthy();
    expect(screen.getByText("Item 9")).toBeTruthy();
  });

  it("does not mark invalid hierarchy when no parentId is set", () => {
    const items = makeItems(3);
    const onInvalid = vi.fn();
    render(<GridraBreadcrumb items={items} onHierarchyInvalid={onInvalid} />);
    expect(onInvalid).not.toHaveBeenCalled();
  });

  it("does not mark invalid when parentIds form a correct chain", () => {
    const items: GridraBreadcrumbItem[] = [
      { id: "a", label: "A", href: "/a" },
      { id: "b", label: "B", href: "/b", parentId: "a" },
      { id: "c", label: "C", href: "/c", parentId: "b" },
    ];
    const onInvalid = vi.fn();
    render(<GridraBreadcrumb items={items} onHierarchyInvalid={onInvalid} />);
    expect(onInvalid).not.toHaveBeenCalled();
  });

  it("marks invalid when parentId references non-existent id", () => {
    const items: GridraBreadcrumbItem[] = [
      { id: "a", label: "A", href: "/a" },
      { id: "b", label: "B", href: "/b", parentId: "missing" },
    ];
    const onInvalid = vi.fn();
    const { container } = render(<GridraBreadcrumb items={items} onHierarchyInvalid={onInvalid} />);
    const nav = container.querySelector("nav");
    expect(nav?.getAttribute("data-gridra-invalid-hierarchy")).toBe("true");
    expect(onInvalid).toHaveBeenCalledTimes(1);
    const issues = onInvalid.mock.calls[0][0];
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ itemId: "b", index: 1, reason: "missing-parent" });
  });

  it("marks invalid when parentId does not point to previous item", () => {
    const items: GridraBreadcrumbItem[] = [
      { id: "a", label: "A", href: "/a" },
      { id: "b", label: "B", href: "/b", parentId: "a" },
      { id: "c", label: "C", href: "/c", parentId: "a" },
    ];
    const onInvalid = vi.fn();
    const { container } = render(<GridraBreadcrumb items={items} onHierarchyInvalid={onInvalid} />);
    const nav = container.querySelector("nav");
    expect(nav?.getAttribute("data-gridra-invalid-hierarchy")).toBe("true");
    expect(onInvalid).toHaveBeenCalledTimes(1);
    const issues = onInvalid.mock.calls[0][0];
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ itemId: "c", index: 2, reason: "broken-chain" });
  });

  it("renders all items in order even with invalid hierarchy", () => {
    const items: GridraBreadcrumbItem[] = [
      { id: "a", label: "A", href: "/a" },
      { id: "b", label: "B", href: "/b", parentId: "missing" },
      { id: "c", label: "C", href: "/c" },
    ];
    render(<GridraBreadcrumb items={items} />);
    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
    expect(listItems[0].textContent).toContain("A");
    expect(listItems[1].textContent).toContain("B");
    expect(listItems[2].textContent).toContain("C");
  });

  it("skips hierarchy validation when no parentId is set", () => {
    const items = makeItems(5);
    const onInvalid = vi.fn();
    const { container } = render(<GridraBreadcrumb items={items} onHierarchyInvalid={onInvalid} />);
    const nav = container.querySelector("nav");
    expect(nav?.hasAttribute("data-gridra-invalid-hierarchy")).toBe(false);
    expect(onInvalid).not.toHaveBeenCalled();
  });
});
