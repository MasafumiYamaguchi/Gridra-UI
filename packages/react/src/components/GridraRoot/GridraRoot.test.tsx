import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GRIDRA_BUILT_IN_THEME_NAMES } from "../../theme";
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

  it.each(GRIDRA_BUILT_IN_THEME_NAMES)(
    "applies the built-in %s theme",
    (theme) => {
      render(
        <GridraRoot data-testid="root" theme={theme}>
          Canvas
        </GridraRoot>,
      );

      expect(screen.getByTestId("root").className).toContain(
        `gridra-theme-${theme}`,
      );
    },
  );

  it("supports a custom kebab-case theme name", () => {
    render(
      <GridraRoot data-testid="root" theme="studio-blue">
        Canvas
      </GridraRoot>,
    );

    expect(screen.getByTestId("root").className).toContain(
      "gridra-theme-studio-blue",
    );
  });

  it("ignores an invalid custom theme name", () => {
    render(
      <GridraRoot data-testid="root" theme="Studio Blue">
        Canvas
      </GridraRoot>,
    );

    expect(screen.getByTestId("root").className).toBe("gridra-root");
  });

  it("keeps the legacy className theme pattern", () => {
    render(
      <GridraRoot className="gridra-theme-light" data-testid="root">
        Canvas
      </GridraRoot>,
    );

    expect(screen.getByTestId("root").className).toContain(
      "gridra-theme-light",
    );
  });

  it("prefers the theme prop over a legacy theme class", () => {
    render(
      <GridraRoot
        className="custom-root gridra-theme-light"
        data-testid="root"
        theme="forest"
      >
        Canvas
      </GridraRoot>,
    );

    const root = screen.getByTestId("root");
    expect(root.className).toContain("custom-root");
    expect(root.className).toContain("gridra-theme-forest");
    expect(root.className).not.toContain("gridra-theme-light");
  });
});
