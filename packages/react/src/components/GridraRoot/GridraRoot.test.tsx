import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraRoot } from "./GridraRoot";

afterEach(() => {
  cleanup();
});

describe("GridraRoot", () => {
  it("renders main content without panel position class when no panel is provided", () => {
    render(
      <GridraRoot className="custom-root" data-testid="root">
        Canvas
      </GridraRoot>
    );
    const root = screen.getByTestId("root");
    const shell = root.firstElementChild;

    expect(root.className).toContain("gridra-root");
    expect(root.className).toContain("custom-root");
    expect(shell?.className).toBe("gridra-root__shell");
    expect(screen.getByRole("main").className).toContain("gridra-main");
    expect(screen.getByText("Canvas")).toBeTruthy();
  });

  it("places the panel before main content on the left", () => {
    render(
      <GridraRoot panel={<aside data-testid="panel">Panel</aside>}>
        Canvas
      </GridraRoot>
    );
    const shell = screen.getByTestId("panel").parentElement;

    expect(shell?.className).toContain("gridra-root__shell--left");
    expect(shell?.children[0]).toBe(screen.getByTestId("panel"));
    expect(shell?.children[1]).toBe(screen.getByRole("main"));
  });

  it("places the panel after main content on the right", () => {
    render(
      <GridraRoot panel={<aside data-testid="panel">Panel</aside>} panelPosition="right">
        Canvas
      </GridraRoot>
    );
    const shell = screen.getByTestId("panel").parentElement;

    expect(shell?.className).toContain("gridra-root__shell--right");
    expect(shell?.children[0]).toBe(screen.getByRole("main"));
    expect(shell?.children[1]).toBe(screen.getByTestId("panel"));
  });

  it("ignores panel position styling when the panel is null", () => {
    render(
      <GridraRoot panel={null} panelPosition="right">
        Canvas
      </GridraRoot>,
    );
    const shell = screen.getByRole("main").parentElement;

    expect(shell?.className).toBe("gridra-root__shell");
    expect(shell?.children).toHaveLength(1);
  });
});
