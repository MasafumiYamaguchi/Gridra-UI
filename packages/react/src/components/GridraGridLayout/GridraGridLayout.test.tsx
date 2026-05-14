import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraGridLayout } from "./GridraGridLayout";

afterEach(() => {
  cleanup();
});

describe("GridraGridLayout", () => {
  it("renders children with default classes", () => {
    render(<GridraGridLayout>Content</GridraGridLayout>);
    const layout = screen.getByText("Content");

    expect(layout.tagName.toLowerCase()).toBe("div");
    expect(layout.className).toContain("gridra-grid-layout");
    expect(layout.className).toContain("gridra-grid-layout--columns-auto");
    expect(layout.className).toContain("gridra-grid-layout--gap-md");
    expect(layout.className).toContain("gridra-grid-layout--align-stretch");
    expect(layout.className).toContain("gridra-grid-layout--justify-stretch");
    expect(layout.className).toContain("gridra-box");
    expect(layout.className).toContain("gridra-box--display-grid");
  });

  it("applies fixed columns class and CSS variable", () => {
    render(<GridraGridLayout columns={3}>Fixed</GridraGridLayout>);
    const layout = screen.getByText("Fixed");

    expect(layout.className).toContain("gridra-grid-layout--columns-fixed");
    expect(layout.getAttribute("style")).toContain("--gridra-grid-layout-columns: 3");
  });

  it("applies auto columns with numeric minColumnWidth", () => {
    render(<GridraGridLayout columns="auto" minColumnWidth={180}>Auto</GridraGridLayout>);
    const layout = screen.getByText("Auto");

    expect(layout.className).toContain("gridra-grid-layout--columns-auto");
    expect(layout.getAttribute("style")).toContain("--gridra-grid-layout-min-column-width: 180px");
  });

  it("applies auto columns with string minColumnWidth", () => {
    render(<GridraGridLayout columns="auto" minColumnWidth="12rem">Auto</GridraGridLayout>);
    const layout = screen.getByText("Auto");

    expect(layout.getAttribute("style")).toContain("--gridra-grid-layout-min-column-width: 12rem");
  });

  it("applies gap, rowGap, columnGap, align, and justify classes", () => {
    render(
      <GridraGridLayout
        align="center"
        columnGap="sm"
        gap="lg"
        justify="center"
        rowGap="xs"
      >
        Configured
      </GridraGridLayout>
    );
    const layout = screen.getByText("Configured");

    expect(layout.className).toContain("gridra-grid-layout--gap-lg");
    expect(layout.className).toContain("gridra-grid-layout--column-gap-sm");
    expect(layout.className).toContain("gridra-grid-layout--row-gap-xs");
    expect(layout.className).toContain("gridra-grid-layout--align-center");
    expect(layout.className).toContain("gridra-grid-layout--justify-center");
  });

  it("forwards Box-derived props", () => {
    render(
      <GridraGridLayout
        border="default"
        fullWidth
        padding="sm"
        radius="md"
        surface="raised"
      >
        BoxProps
      </GridraGridLayout>
    );
    const layout = screen.getByText("BoxProps");

    expect(layout.className).toContain("gridra-box--padding-sm");
    expect(layout.className).toContain("gridra-box--surface-raised");
    expect(layout.className).toContain("gridra-box--border-default");
    expect(layout.className).toContain("gridra-box--radius-md");
    expect(layout.className).toContain("gridra-box--full-width");
  });

  it("supports semantic as prop", () => {
    render(<GridraGridLayout as="section">Section</GridraGridLayout>);
    const layout = screen.getByText("Section");

    expect(layout.tagName.toLowerCase()).toBe("section");
  });

  it("forwards className, id, aria-label, data-testid, and style", () => {
    render(
      <GridraGridLayout
        aria-label="grid"
        className="custom-grid"
        data-testid="my-grid"
        id="grid-id"
        style={{ color: "blue" }}
      >
        Styled
      </GridraGridLayout>
    );
    const layout = screen.getByTestId("my-grid");

    expect(layout.className).toContain("gridra-grid-layout");
    expect(layout.className).toContain("custom-grid");
    expect(layout.id).toBe("grid-id");
    expect(layout.getAttribute("aria-label")).toBe("grid");
    expect((layout as HTMLElement).style.color).toBe("blue");
  });
});
