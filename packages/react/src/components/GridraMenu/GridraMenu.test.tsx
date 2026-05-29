import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraMenu } from "./GridraMenu";

afterEach(() => cleanup());

describe("GridraMenu", () => {
  const basicItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "projects", label: "Projects" },
    { type: "separator" as const },
    { id: "settings", label: "Settings", href: "/settings" },
    { id: "logout", label: "Logout", destructive: true },
  ];

  it("renders a nav with aria-label", () => {
    render(<GridraMenu items={basicItems} />);
    const nav = screen.getByRole("navigation", { name: "Menu" });
    expect(nav.tagName).toBe("NAV");
  });

  it("renders command items and separator", () => {
    render(<GridraMenu items={basicItems} />);
    expect(screen.getByText("Dashboard")).toBeDefined();
    expect(screen.getByText("Projects")).toBeDefined();
    expect(screen.getByText("Logout")).toBeDefined();
    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("renders link for item with href", () => {
    render(<GridraMenu items={basicItems} />);
    const link = screen.getByRole("link", { name: "Settings" });
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("/settings");
  });

  it("renders button for item without href", () => {
    render(<GridraMenu items={basicItems} />);
    const button = screen.getByRole("button", { name: "Dashboard" });
    expect(button.tagName).toBe("BUTTON");
  });

  it("applies default activeId", () => {
    render(<GridraMenu items={basicItems} defaultActiveId="projects" />);
    const item = screen.getByRole("button", { name: "Projects" });
    expect(item.getAttribute("aria-current")).toBe("page");
    expect(item.className).toContain("gridra-menu__item--active");
  });

  it("sets aria-current on active item", () => {
    render(<GridraMenu items={basicItems} defaultActiveId="settings" />);
    const link = screen.getByRole("link", { name: "Settings" });
    expect(link.getAttribute("aria-current")).toBe("page");
  });

  it("calls onAction on button click", () => {
    const onAction = vi.fn();
    render(<GridraMenu items={basicItems} onAction={onAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Dashboard" }));
    expect(onAction).toHaveBeenCalledWith("dashboard");
  });

  it("does not call onAction for disabled items", () => {
    const onAction = vi.fn();
    const items = [
      { id: "a", label: "A" },
      { id: "b", label: "B", disabled: true },
    ];
    render(<GridraMenu items={items} onAction={onAction} />);
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    expect(onAction).not.toHaveBeenCalled();
  });

  it("disabled item button is actually disabled", () => {
    const items = [{ id: "a", label: "A", disabled: true }];
    render(<GridraMenu items={items} />);
    const button = screen.getByRole("button", { name: "A" }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("disabled item with href renders as button, not link", () => {
    const items = [
      { id: "a", label: "A", href: "/a", disabled: true },
    ];
    render(<GridraMenu items={items} />);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByRole("button", { name: "A" })).toBeDefined();
  });

  it("applies destructive class", () => {
    render(<GridraMenu items={basicItems} />);
    const logout = screen.getByRole("button", { name: "Logout" });
    expect(logout.className).toContain("gridra-menu__item--destructive");
  });

  it("supports controlled activeId", () => {
    const onChange = vi.fn();
    render(
      <GridraMenu items={basicItems} activeId="dashboard" onActiveIdChange={onChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    expect(onChange).toHaveBeenCalledWith("projects", "dashboard");
    expect(screen.getByRole("button", { name: "Dashboard" }).getAttribute("aria-current")).toBe("page");
  });

  it("uses undefined as previous activeId when controlled activeId is invalid", () => {
    const onChange = vi.fn();
    render(
      <GridraMenu items={basicItems} activeId="missing" onActiveIdChange={onChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Projects" }));

    expect(onChange).toHaveBeenCalledWith("projects", undefined);
  });

  it("ignores non-existent defaultActiveId", () => {
    render(<GridraMenu items={basicItems} defaultActiveId="nonexistent" />);
    const items = screen.getAllByRole("button");
    items.forEach((item) => {
      expect(item.getAttribute("aria-current")).toBeNull();
    });
  });

  it("ignores disabled item as defaultActiveId", () => {
    const items = [
      { id: "a", label: "A", disabled: true },
      { id: "b", label: "B" },
    ];
    render(<GridraMenu items={items} defaultActiveId="a" />);
    expect(screen.getByRole("button", { name: "A" }).getAttribute("aria-current")).toBeNull();
    expect(screen.getByRole("button", { name: "B" }).getAttribute("aria-current")).toBeNull();
  });

  it("renders empty list for empty items", () => {
    const { container } = render(<GridraMenu items={[]} />);
    const nav = container.querySelector("nav");
    expect(nav).toBeDefined();
    const list = container.querySelector("ul");
    expect(list).toBeDefined();
  });

  it("renders size and orientation classes", () => {
    const { container } = render(
      <GridraMenu items={basicItems} size="sm" orientation="horizontal" />,
    );
    const nav = container.querySelector("nav")!;
    expect(nav.className).toContain("gridra-menu--sm");
    expect(nav.className).toContain("gridra-menu--horizontal");
  });

  it("defaults to vertical and md", () => {
    const { container } = render(<GridraMenu items={basicItems} />);
    const nav = container.querySelector("nav")!;
    expect(nav.className).toContain("gridra-menu--vertical");
    expect(nav.className).toContain("gridra-menu--md");
  });

  it("calls onAction with activeId update on button click", () => {
    const onAction = vi.fn();
    render(<GridraMenu items={basicItems} onAction={onAction} />);
    fireEvent.click(screen.getByRole("button", { name: "Projects" }));
    expect(onAction).toHaveBeenCalledWith("projects");
    expect(screen.getByRole("button", { name: "Projects" }).getAttribute("aria-current")).toBe("page");
  });

  it("does not update activeId for href items (links)", () => {
    render(<GridraMenu items={basicItems} />);
    const link = screen.getByRole("link", { name: "Settings" });
    fireEvent.click(link);
    expect(link.getAttribute("aria-current")).toBeNull();
  });

  it("has roving tabindex pattern", () => {
    render(<GridraMenu items={basicItems} defaultActiveId="dashboard" />);
    expect(screen.getByRole("button", { name: "Dashboard" }).tabIndex).toBe(0);
    const others = [screen.getByRole("button", { name: "Projects" }), screen.getByRole("button", { name: "Logout" })];
    others.forEach((el) => {
      expect(el.tabIndex).toBe(-1);
    });
  });

  it("navigates with ArrowDown in vertical mode", () => {
    render(<GridraMenu items={basicItems} defaultActiveId="dashboard" />);
    const nav = screen.getByRole("navigation");

    fireEvent.keyDown(nav, { key: "ArrowDown" });
    expect(screen.getByRole("button", { name: "Projects" })).toBe(document.activeElement);

    fireEvent.keyDown(nav, { key: "ArrowDown" });
    expect(screen.getByRole("link", { name: "Settings" })).toBe(document.activeElement);

    fireEvent.keyDown(nav, { key: "ArrowDown" });
    expect(screen.getByRole("button", { name: "Logout" })).toBe(document.activeElement);

    fireEvent.keyDown(nav, { key: "ArrowDown" });
    expect(screen.getByRole("button", { name: "Dashboard" })).toBe(document.activeElement);
  });

  it("navigates with ArrowUp in vertical mode", () => {
    render(<GridraMenu items={basicItems} defaultActiveId="projects" />);
    const nav = screen.getByRole("navigation");

    fireEvent.keyDown(nav, { key: "ArrowUp" });
    expect(screen.getByRole("button", { name: "Dashboard" })).toBe(document.activeElement);
  });

  it("navigates with ArrowRight in horizontal mode", () => {
    render(<GridraMenu items={basicItems} orientation="horizontal" />);
    const nav = screen.getByRole("navigation");

    fireEvent.keyDown(nav, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: "Projects" })).toBe(document.activeElement);
  });

  it("navigates with ArrowLeft in horizontal mode", () => {
    render(<GridraMenu items={basicItems} orientation="horizontal" defaultActiveId="projects" />);
    const nav = screen.getByRole("navigation");

    fireEvent.keyDown(nav, { key: "ArrowLeft" });
    expect(screen.getByRole("button", { name: "Dashboard" })).toBe(document.activeElement);
  });

  it("Home jumps to first enabled item", () => {
    render(<GridraMenu items={basicItems} defaultActiveId="logout" />);
    const nav = screen.getByRole("navigation");

    fireEvent.keyDown(nav, { key: "Home" });
    expect(screen.getByRole("button", { name: "Dashboard" })).toBe(document.activeElement);
  });

  it("End jumps to last enabled item", () => {
    render(<GridraMenu items={basicItems} defaultActiveId="dashboard" />);
    const nav = screen.getByRole("navigation");

    fireEvent.keyDown(nav, { key: "End" });
    expect(screen.getByRole("button", { name: "Logout" })).toBe(document.activeElement);
  });

  it("skips disabled items during keyboard navigation", () => {
    const items = [
      { id: "a", label: "A" },
      { id: "b", label: "B", disabled: true },
      { id: "c", label: "C" },
    ];
    render(<GridraMenu items={items} defaultActiveId="a" />);
    const nav = screen.getByRole("navigation");

    fireEvent.keyDown(nav, { key: "ArrowDown" });
    expect(screen.getByRole("button", { name: "C" })).toBe(document.activeElement);
  });

  it("renders custom content via renderItem", () => {
    const items = [
      { id: "a", label: "Alpha" },
      { id: "b", label: "Beta" },
    ];
    render(
      <GridraMenu
        items={items}
        renderItem={(item, state) => (
          <span data-testid={`custom-${item.id}`}>
            {state.active ? "✓ " : ""}{item.label}
          </span>
        )}
        defaultActiveId="a"
      />,
    );
    expect(screen.getByTestId("custom-a").textContent).toBe("✓ Alpha");
    expect(screen.getByTestId("custom-b").textContent).toBe("Beta");
  });

  it("renderItem receives correct state", () => {
    const stateCaptured: unknown[] = [];
    const items = [
      { id: "a", label: "A", destructive: true },
      { id: "b", label: "B", href: "/b" },
    ];
    render(
      <GridraMenu
        items={items}
        renderItem={(item, state) => {
          stateCaptured.push(state);
          return <span>{item.label}</span>;
        }}
        defaultActiveId="a"
        orientation="horizontal"
      />,
    );
    expect(stateCaptured[0]).toMatchObject({
      active: true,
      disabled: false,
      destructive: true,
      hasHref: false,
      orientation: "horizontal",
    });
    expect(stateCaptured[1]).toMatchObject({
      active: false,
      disabled: false,
      destructive: false,
      hasHref: true,
    });
  });
});
