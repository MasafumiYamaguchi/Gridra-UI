import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraSidebar } from "./GridraSidebar";

afterEach(() => {
  cleanup();
});

describe("GridraSidebar", () => {
  it("renders defaults for left open sidebar", () => {
    render(<GridraSidebar>Content</GridraSidebar>);
    const sidebar = screen.getByText("Content").closest(".gridra-sidebar") as HTMLElement;
    expect(sidebar.className).toContain("gridra-sidebar--left");
    expect(sidebar.className).toContain("gridra-sidebar--open");
    expect(sidebar.getAttribute("style")).toContain("--gridra-sidebar-width: 280px");
    expect(sidebar.getAttribute("aria-expanded")).toBe("true");
  });

  it("supports controlled open state", () => {
    render(
      <GridraSidebar open={false} resizable>
        Content
      </GridraSidebar>,
    );
    const sidebar = screen.getByText("Content").closest(".gridra-sidebar") as HTMLElement;
    expect(sidebar.className).toContain("gridra-sidebar--closed");
    expect(sidebar.getAttribute("style")).toContain("--gridra-sidebar-width: 0px");
    expect(sidebar.getAttribute("aria-expanded")).toBe("false");
  });

  it("uses defaultOpen for uncontrolled initial state", () => {
    render(
      <GridraSidebar defaultOpen={false}>
        Content
      </GridraSidebar>,
    );
    const sidebar = screen.getByText("Content").closest(".gridra-sidebar") as HTMLElement;
    expect(sidebar.className).toContain("gridra-sidebar--closed");
  });

  it("toggles open state by hamburger button in uncontrolled mode", () => {
    render(<GridraSidebar defaultOpen={false}>Content</GridraSidebar>);
    const sidebar = screen.getByText("Content").closest(".gridra-sidebar") as HTMLElement;
    const button = screen.getByRole("button", { name: "Open sidebar" });

    fireEvent.click(button);
    expect(sidebar.className).toContain("gridra-sidebar--open");
  });

  it("supports toggleSize and clamps numeric values to minimum", () => {
    const { rerender } = render(
      <GridraSidebar toggleSize={36}>
        Content
      </GridraSidebar>,
    );
    let sidebar = screen.getByText("Content").closest(".gridra-sidebar") as HTMLElement;
    expect(sidebar.getAttribute("style")).toContain("--gridra-sidebar-toggle-size: 36px");

    rerender(
      <GridraSidebar toggleSize={12}>
        Content
      </GridraSidebar>,
    );
    sidebar = screen.getByText("Content").closest(".gridra-sidebar") as HTMLElement;
    expect(sidebar.getAttribute("style")).toContain("--gridra-sidebar-toggle-size: 20px");
  });

  it("applies width and collapsedWidth", () => {
    render(
      <GridraSidebar collapsedWidth={64} open={false} width={360}>
        Content
      </GridraSidebar>,
    );
    const sidebar = screen.getByText("Content").closest(".gridra-sidebar") as HTMLElement;
    expect(sidebar.getAttribute("style")).toContain("--gridra-sidebar-width: 64px");
  });

  it("resizes by drag and clamps to min/max", () => {
    render(
      <GridraSidebar maxWidth={320} minWidth={200} resizable width={260}>
        Content
      </GridraSidebar>,
    );
    const sidebar = screen.getByText("Content").closest(".gridra-sidebar") as HTMLElement;
    const separator = screen.getByRole("separator");

    fireEvent.mouseDown(separator, { clientX: 100 });
    fireEvent.mouseMove(separator, { clientX: 300 });
    expect(sidebar.getAttribute("style")).toContain("--gridra-sidebar-width: 320px");

    fireEvent.mouseMove(separator, { clientX: -100 });
    expect(sidebar.getAttribute("style")).toContain("--gridra-sidebar-width: 200px");
    fireEvent.mouseUp(separator);
  });

  it("supports keyboard resizing and toggle", () => {
    const onOpenChange = vi.fn();
    render(
      <GridraSidebar
        defaultOpen={true}
        maxWidth={320}
        minWidth={200}
        onOpenChange={onOpenChange}
        resizable
        width={240}
      >
        Content
      </GridraSidebar>,
    );
    const sidebar = screen.getByText("Content").closest(".gridra-sidebar") as HTMLElement;
    const separator = screen.getByRole("separator");

    fireEvent.keyDown(separator, { key: "ArrowRight" });
    expect(sidebar.getAttribute("style")).toContain("--gridra-sidebar-width: 248px");

    fireEvent.keyDown(separator, { key: "Home" });
    expect(sidebar.getAttribute("style")).toContain("--gridra-sidebar-width: 200px");

    fireEvent.keyDown(separator, { key: "End" });
    expect(sidebar.getAttribute("style")).toContain("--gridra-sidebar-width: 320px");

    fireEvent.keyDown(separator, { key: "Enter" });
    expect(sidebar.className).toContain("gridra-sidebar--closed");
    expect(onOpenChange).toHaveBeenCalled();
  });
});
