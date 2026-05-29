import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraTabs } from "./GridraTabs";

afterEach(() => cleanup());

describe("GridraTabs", () => {
  const basicItems = [
    { id: "a", label: "Tab A", content: "Content A" },
    { id: "b", label: "Tab B", content: "Content B" },
    { id: "c", label: "Tab C", content: "Content C" },
  ];

  it("renders tabs and selected panel", () => {
    render(<GridraTabs items={basicItems} />);
    expect(screen.getByRole("tab", { name: "Tab A" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Tab B" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Tab C" })).toBeDefined();
    expect(screen.getByRole("tabpanel").textContent).toContain("Content A");
  });

  it("selects first enabled item by default", () => {
    render(<GridraTabs items={basicItems} />);
    expect(screen.getByRole("tab", { name: "Tab A" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tab", { name: "Tab B" }).getAttribute("aria-selected")).toBe("false");
    expect(screen.getByRole("tabpanel").textContent).toContain("Content A");
  });

  it("respects defaultSelectedId", () => {
    render(<GridraTabs items={basicItems} defaultSelectedId="b" />);
    expect(screen.getByRole("tab", { name: "Tab B" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toContain("Content B");
  });

  it("skips disabled items for default selection", () => {
    const items = [
      { id: "a", label: "A", content: "CA", disabled: true },
      { id: "b", label: "B", content: "CB" },
    ];
    render(<GridraTabs items={items} />);
    expect(screen.getByRole("tab", { name: "B" }).getAttribute("aria-selected")).toBe("true");
  });

  it("changes selection on click", () => {
    render(<GridraTabs items={basicItems} />);
    fireEvent.click(screen.getByRole("tab", { name: "Tab B" }));
    expect(screen.getByRole("tab", { name: "Tab B" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toContain("Content B");
  });

  it("does not select disabled tabs on click", () => {
    const items = [
      { id: "a", label: "A", content: "CA" },
      { id: "b", label: "B", content: "CB", disabled: true },
    ];
    render(<GridraTabs items={items} />);
    fireEvent.click(screen.getByRole("tab", { name: "B" }));
    expect(screen.getByRole("tab", { name: "A" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toContain("CA");
  });

  it("disabled tab has aria-disabled and is disabled", () => {
    const items = [{ id: "a", label: "A", content: "CA", disabled: true }];
    render(<GridraTabs items={items} />);
    const tab = screen.getByRole("tab", { name: "A" });
    expect(tab.getAttribute("aria-disabled")).toBe("true");
    expect((tab as HTMLButtonElement).disabled).toBe(true);
  });

  it("supports controlled selection", () => {
    const onChange = vi.fn();
    render(
      <GridraTabs items={basicItems} selectedId="a" onSelectionChange={onChange} />,
    );
    fireEvent.click(screen.getByRole("tab", { name: "Tab C" }));
    expect(onChange).toHaveBeenCalledWith("c", "a");
    expect(screen.getByRole("tabpanel").textContent).toContain("Content A");
  });

  it("uses the fallback selected tab as previous when controlled selectedId is invalid", () => {
    const onChange = vi.fn();
    render(
      <GridraTabs items={basicItems} selectedId="missing" onSelectionChange={onChange} />,
    );

    expect(screen.getByRole("tab", { name: "Tab A" }).getAttribute("aria-selected")).toBe("true");

    fireEvent.click(screen.getByRole("tab", { name: "Tab B" }));

    expect(onChange).toHaveBeenCalledWith("b", "a");
  });

  it("does not fire onSelectionChange when clicking the fallback selected tab", () => {
    const onChange = vi.fn();
    render(
      <GridraTabs items={basicItems} selectedId="missing" onSelectionChange={onChange} />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Tab A" }));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("navigates with ArrowRight in horizontal mode", () => {
    render(<GridraTabs items={basicItems} />);
    const list = screen.getByRole("tablist");

    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Tab B" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toContain("Content B");
  });

  it("navigates with ArrowLeft in horizontal mode", () => {
    render(<GridraTabs items={basicItems} defaultSelectedId="b" />);
    const list = screen.getByRole("tablist");

    fireEvent.keyDown(list, { key: "ArrowLeft" });
    expect(screen.getByRole("tab", { name: "Tab A" }).getAttribute("aria-selected")).toBe("true");
  });

  it("navigates with ArrowUp in vertical mode", () => {
    render(<GridraTabs items={basicItems} orientation="vertical" defaultSelectedId="b" />);
    const list = screen.getByRole("tablist");

    fireEvent.keyDown(list, { key: "ArrowUp" });
    expect(screen.getByRole("tab", { name: "Tab A" }).getAttribute("aria-selected")).toBe("true");
  });

  it("navigates with ArrowDown in vertical mode", () => {
    render(<GridraTabs items={basicItems} orientation="vertical" />);
    const list = screen.getByRole("tablist");

    fireEvent.keyDown(list, { key: "ArrowDown" });
    expect(screen.getByRole("tab", { name: "Tab B" }).getAttribute("aria-selected")).toBe("true");
  });

  it("Home and End jump to first/last enabled tab", () => {
    render(<GridraTabs items={basicItems} defaultSelectedId="b" />);
    const list = screen.getByRole("tablist");

    fireEvent.keyDown(list, { key: "End" });
    expect(screen.getByRole("tab", { name: "Tab C" }).getAttribute("aria-selected")).toBe("true");

    fireEvent.keyDown(list, { key: "Home" });
    expect(screen.getByRole("tab", { name: "Tab A" }).getAttribute("aria-selected")).toBe("true");
  });

  it("skips disabled tabs during keyboard navigation", () => {
    const items = [
      { id: "a", label: "A", content: "CA" },
      { id: "b", label: "B", content: "CB", disabled: true },
      { id: "c", label: "C", content: "CC" },
    ];
    render(<GridraTabs items={items} />);
    const list = screen.getByRole("tablist");

    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "C" }).getAttribute("aria-selected")).toBe("true");
  });

  it("manual mode focuses but does not select on arrow keys", () => {
    render(<GridraTabs items={basicItems} activationMode="manual" />);
    const list = screen.getByRole("tablist");

    fireEvent.keyDown(list, { key: "ArrowRight" });
    expect(screen.getByRole("tab", { name: "Tab A" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toContain("Content A");
  });

  it("manual mode selects on Enter", () => {
    render(<GridraTabs items={basicItems} activationMode="manual" />);
    const list = screen.getByRole("tablist");

    fireEvent.keyDown(list, { key: "ArrowRight" });
    fireEvent.keyDown(list, { key: "Enter" });
    expect(screen.getByRole("tab", { name: "Tab B" }).getAttribute("aria-selected")).toBe("true");
    expect(screen.getByRole("tabpanel").textContent).toContain("Content B");
  });

  it("renders size and variant classes", () => {
    render(<GridraTabs items={basicItems} size="sm" variant="boxed" />);
    const root = document.querySelector(".gridra-tabs")!;
    expect(root.className).toContain("gridra-tabs--sm");
    expect(root.className).toContain("gridra-tabs--boxed");
  });

  it("renders aria-orientation on tablist", () => {
    render(<GridraTabs items={basicItems} />);
    expect(screen.getByRole("tablist").getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("wires aria-controls and aria-labelledby between tab and panel", () => {
    render(<GridraTabs items={basicItems} defaultSelectedId="b" />);
    const tab = screen.getByRole("tab", { name: "Tab B" });
    const panel = screen.getByRole("tabpanel");
    expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
  });
});
