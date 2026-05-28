import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraTreeView, type GridraTreeItem } from "./GridraTreeView";

afterEach(() => {
  cleanup();
});

function makeItems(): GridraTreeItem[] {
  return [
    {
      id: "a",
      label: "Item A",
      children: [
        { id: "a1", label: "Item A1" },
        { id: "a2", label: "Item A2", children: [{ id: "a2x", label: "Item A2x" }] },
      ],
    },
    { id: "b", label: "Item B" },
    {
      id: "c",
      label: "Item C",
      children: [{ id: "c1", label: "Item C1" }],
    },
  ];
}

describe("GridraTreeView", () => {
  it("renders root items", () => {
    render(<GridraTreeView items={makeItems()} />);
    expect(screen.getByText("Item A")).toBeTruthy();
    expect(screen.getByText("Item B")).toBeTruthy();
    expect(screen.getByText("Item C")).toBeTruthy();
  });

  it("renders custom item content with renderItem", () => {
    render(
      <GridraTreeView
        items={makeItems()}
        renderItem={(item) => (
          <span data-testid={`custom-${item.id}`}>
            <strong>{item.label}</strong>
            <span> custom</span>
          </span>
        )}
      />,
    );

    expect(screen.getByTestId("custom-a").textContent).toContain("Item A custom");
  });

  it("passes item state to renderItem", () => {
    render(
      <GridraTreeView
        items={makeItems()}
        defaultExpandedIds={["a"]}
        renderItem={(item, state) => (
          <span>
            {item.label}:{state.depth}:{state.hasChildren ? "branch" : "leaf"}:
            {state.expanded ? "open" : "closed"}
          </span>
        )}
      />,
    );

    expect(screen.getByText("Item A:0:branch:open")).toBeTruthy();
    expect(screen.getByText("Item A1:1:leaf:closed")).toBeTruthy();
  });

  it("does not render children when collapsed", () => {
    render(<GridraTreeView items={makeItems()} />);
    expect(screen.queryByText("Item A1")).toBeNull();
    expect(screen.queryByText("Item A2")).toBeNull();
    expect(screen.queryByText("Item C1")).toBeNull();
  });

  it("expands branch on row click", () => {
    render(<GridraTreeView items={makeItems()} />);
    const rowA = screen.getByText("Item A").closest(".gridra-tree-view__row")!;
    fireEvent.click(rowA);
    expect(screen.getByText("Item A1")).toBeTruthy();
    expect(screen.getByText("Item A2")).toBeTruthy();
  });

  it("collapses expanded branch on row click", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} />);
    expect(screen.getByText("Item A1")).toBeTruthy();
    fireEvent.click(screen.getByText("Item A").closest(".gridra-tree-view__row")!);
    expect(screen.queryByText("Item A1")).toBeNull();
  });

  it("leaf item row click does nothing", () => {
    render(<GridraTreeView items={makeItems()} />);
    const rows = document.querySelectorAll(".gridra-tree-view__row");
    const rowB = Array.from(rows).find((r) => r.textContent?.includes("Item B"))!;
    fireEvent.click(rowB);
    expect(screen.queryByText("Item A1")).toBeNull();
  });

  it("supports controlled expandedIds", () => {
    const items = makeItems();
    const onChange = vi.fn();
    render(
      <GridraTreeView items={items} expandedIds={[]} onExpandedIdsChange={onChange} />
    );
    expect(screen.queryByText("Item A1")).toBeNull();
    fireEvent.click(screen.getByText("Item A").closest(".gridra-tree-view__row")!);
    expect(onChange).toHaveBeenCalledWith(["a"], []);
    expect(screen.queryByText("Item A1")).toBeNull();
  });

  it("supports uncontrolled defaultExpandedIds", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} />);
    expect(screen.getByText("Item A1")).toBeTruthy();
  });

  it("does not toggle disabled item", () => {
    const items = makeItems();
    items[0].disabled = true;
    render(<GridraTreeView items={items} />);
    fireEvent.click(screen.getByText("Item A").closest(".gridra-tree-view__row")!);
    expect(screen.queryByText("Item A1")).toBeNull();
  });

  it("renders emptyState when items is empty", () => {
    render(<GridraTreeView items={[]} emptyState="No items" />);
    expect(screen.getByText("No items")).toBeTruthy();
  });

  it("renders nothing when emptyState is not provided and items is empty", () => {
    const { container } = render(<GridraTreeView items={[]} />);
    expect(container.querySelector(".gridra-tree-view__empty")).toBeNull();
  });

  it("does not crash with non-existent expanded id", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["nonexistent"]} />);
    expect(screen.queryByText("Item A1")).toBeNull();
  });

  it("does not crash with disabled id in expanded", () => {
    const items = makeItems();
    items[0].disabled = true;
    render(<GridraTreeView items={items} defaultExpandedIds={["a"]} />);
    expect(screen.queryByText("Item A1")).toBeNull();
  });

  it("does not crash with duplicate item ids", () => {
    const items: GridraTreeItem[] = [
      { id: "x", label: "First X" },
      { id: "x", label: "Second X" },
    ];
    render(<GridraTreeView items={items} />);
    expect(screen.getByText("First X")).toBeTruthy();
  });

  it("does not crash with empty children", () => {
    const items: GridraTreeItem[] = [
      { id: "a", label: "A", children: [] },
      { id: "b", label: "B" },
    ];
    render(<GridraTreeView items={items} />);
    expect(screen.getByText("A")).toBeTruthy();
    expect(screen.getByText("B")).toBeTruthy();
  });

  it("has role tree on root list", () => {
    render(<GridraTreeView items={makeItems()} />);
    expect(screen.getByRole("tree")).toBeTruthy();
  });

  it("has role treeitem on each item", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} />);
    const items = screen.getAllByRole("treeitem");
    expect(items.length).toBeGreaterThanOrEqual(3);
  });

  it("sets aria-level correctly", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a", "a2"]} />);
    const treeItems = screen.getAllByRole("treeitem");
    const idxA = treeItems.findIndex((t) => t.textContent?.includes("Item A"));
    const idxA2 = treeItems.findIndex((t) => t.textContent?.includes("Item A2"));
    const idxA2x = treeItems.findIndex((t) => t.textContent?.includes("Item A2x"));
    expect(treeItems[idxA].getAttribute("aria-level")).toBe("1");
    expect(treeItems[idxA2].getAttribute("aria-level")).toBe("2");
    expect(treeItems[idxA2x].getAttribute("aria-level")).toBe("3");
  });

  it("sets aria-expanded on branch items", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} />);
    const treeItems = screen.getAllByRole("treeitem");
    const branch = treeItems.find((t) => t.textContent?.includes("Item A"));
    expect(branch?.getAttribute("aria-expanded")).toBe("true");
  });

  it("does not set aria-expanded on leaf items", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} />);
    const treeItems = screen.getAllByRole("treeitem");
    const leaf = treeItems.find((t) => t.textContent?.includes("Item B"));
    expect(leaf?.getAttribute("aria-expanded")).toBeNull();
  });

  it("has role group for child lists", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} />);
    const groups = screen.getAllByRole("group");
    expect(groups.length).toBeGreaterThanOrEqual(1);
  });

  it("navigates with ArrowDown", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} />);
    const rows = document.querySelectorAll(".gridra-tree-view__row");
    (rows[0] as HTMLElement).focus();
    fireEvent.keyDown(rows[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(rows[1]);
  });

  it("navigates with ArrowUp", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} />);
    const rows = document.querySelectorAll(".gridra-tree-view__row");
    (rows[2] as HTMLElement).focus();
    fireEvent.keyDown(rows[2], { key: "ArrowUp" });
    expect(document.activeElement).toBe(rows[1]);
  });

  it("navigates with Home and End", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} />);
    const rows = document.querySelectorAll(".gridra-tree-view__row");
    (rows[rows.length - 1] as HTMLElement).focus();
    fireEvent.keyDown(rows[rows.length - 1], { key: "Home" });
    expect(document.activeElement).toBe(rows[0]);
    fireEvent.keyDown(rows[0], { key: "End" });
    expect(document.activeElement).toBe(rows[rows.length - 1]);
  });

  it("ArrowRight expands collapsed branch", () => {
    render(<GridraTreeView items={makeItems()} />);
    const rows = document.querySelectorAll(".gridra-tree-view__row");
    (rows[0] as HTMLElement).focus();
    fireEvent.keyDown(rows[0], { key: "ArrowRight" });
    expect(screen.getByText("Item A1")).toBeTruthy();
  });

  it("ArrowLeft collapses expanded branch", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} />);
    const rows = document.querySelectorAll(".gridra-tree-view__row");
    (rows[0] as HTMLElement).focus();
    fireEvent.keyDown(rows[0], { key: "ArrowLeft" });
    expect(screen.queryByText("Item A1")).toBeNull();
  });

  it("ArrowLeft on child moves to parent", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} />);
    const rows = document.querySelectorAll(".gridra-tree-view__row");
    (rows[1] as HTMLElement).focus(); // A1
    fireEvent.keyDown(rows[1], { key: "ArrowLeft" });
    expect(document.activeElement).toBe(rows[0]);
  });

  it("skips disabled items in keyboard nav", () => {
    const items = makeItems();
    items[1].disabled = true; // B
    render(<GridraTreeView items={items} defaultExpandedIds={["a"]} />);
    const rows = document.querySelectorAll(".gridra-tree-view__row");
    (rows[2] as HTMLElement).focus(); // A2
    fireEvent.keyDown(rows[2], { key: "ArrowDown" });
    expect(document.activeElement?.textContent).toContain("Item C");
    fireEvent.keyDown(rows[4] as HTMLElement, { key: "ArrowUp" });
    expect(document.activeElement?.textContent).toContain("Item A2");
  });

  it("leaf items have spacer instead of chevron", () => {
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} />);
    const rowB = screen.getByText("Item B").closest(".gridra-tree-view__row")!;
    expect(rowB.querySelector(".gridra-tree-view__chevron")).toBeNull();
    expect(rowB.querySelector(".gridra-tree-view__chevron-spacer")).toBeTruthy();
  });

  it("calls onItemClick when row is clicked", () => {
    const onClick = vi.fn();
    render(<GridraTreeView items={makeItems()} defaultExpandedIds={["a"]} onItemClick={onClick} />);
    fireEvent.click(screen.getByText("Item B").closest(".gridra-tree-view__row")!);
    expect(onClick).toHaveBeenCalledWith("b");
  });

  it("calls onItemClick on branch click too", () => {
    const onClick = vi.fn();
    render(<GridraTreeView items={makeItems()} onItemClick={onClick} />);
    fireEvent.click(screen.getByText("Item A").closest(".gridra-tree-view__row")!);
    expect(onClick).toHaveBeenCalledWith("a");
  });

  it("does not call onItemClick for disabled item", () => {
    const items = makeItems();
    items[0].disabled = true;
    const onClick = vi.fn();
    render(<GridraTreeView items={items} onItemClick={onClick} />);
    fireEvent.click(screen.getByText("Item A").closest(".gridra-tree-view__row")!);
    expect(onClick).not.toHaveBeenCalled();
  });
});
