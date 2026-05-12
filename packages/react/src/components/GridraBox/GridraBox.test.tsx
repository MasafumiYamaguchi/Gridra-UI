import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraBox } from "./GridraBox";

afterEach(() => {
  cleanup();
});

describe("GridraBox", () => {
  it("renders children and defaults to div.gridra-box", () => {
    render(<GridraBox>Content</GridraBox>);
    const box = screen.getByText("Content");

    expect(box.tagName.toLowerCase()).toBe("div");
    expect(box.className).toContain("gridra-box");
  });

  it("changes tag with as prop", () => {
    render(<GridraBox as="section">Section</GridraBox>);
    const box = screen.getByText("Section");

    expect(box.tagName.toLowerCase()).toBe("section");
  });

  it("forwards className, id, aria-label, data-testid, and style", () => {
    render(
      <GridraBox
        aria-label="box"
        className="custom-class"
        data-testid="my-box"
        id="box-id"
        style={{ color: "red" }}
      >
        Styled
      </GridraBox>
    );
    const box = screen.getByTestId("my-box");

    expect(box.className).toContain("gridra-box");
    expect(box.className).toContain("custom-class");
    expect(box.id).toBe("box-id");
    expect(box.getAttribute("aria-label")).toBe("box");
    expect((box as HTMLElement).style.color).toBe("red");
  });

  it("applies padding classes", () => {
    render(<GridraBox padding="md">Padding</GridraBox>);
    const box = screen.getByText("Padding");

    expect(box.className).toContain("gridra-box--padding-md");
  });

  it("applies paddingX and paddingY classes", () => {
    render(
      <GridraBox paddingX="sm" paddingY="lg">
        PaddingXY
      </GridraBox>
    );
    const box = screen.getByText("PaddingXY");

    expect(box.className).toContain("gridra-box--padding-x-sm");
    expect(box.className).toContain("gridra-box--padding-y-lg");
  });

  it("applies surface class", () => {
    render(<GridraBox surface="raised">Surface</GridraBox>);
    const box = screen.getByText("Surface");

    expect(box.className).toContain("gridra-box--surface-raised");
  });

  it("applies border class", () => {
    render(<GridraBox border="strong">Border</GridraBox>);
    const box = screen.getByText("Border");

    expect(box.className).toContain("gridra-box--border-strong");
  });

  it("applies radius class", () => {
    render(<GridraBox radius="md">Radius</GridraBox>);
    const box = screen.getByText("Radius");

    expect(box.className).toContain("gridra-box--radius-md");
  });

  it("applies display class", () => {
    render(<GridraBox display="flex">Display</GridraBox>);
    const box = screen.getByText("Display");

    expect(box.className).toContain("gridra-box--display-flex");
  });

  it("applies gap class", () => {
    render(<GridraBox gap="lg">Gap</GridraBox>);
    const box = screen.getByText("Gap");

    expect(box.className).toContain("gridra-box--gap-lg");
  });

  it("applies scroll class", () => {
    render(<GridraBox scroll="y">Scroll</GridraBox>);
    const box = screen.getByText("Scroll");

    expect(box.className).toContain("gridra-box--scroll-y");
  });

  it("applies boolean modifier classes", () => {
    render(
      <GridraBox
        fullHeight
        fullWidth
        minHeightZero
        minWidthZero
      >
        Modifiers
      </GridraBox>
    );
    const box = screen.getByText("Modifiers");

    expect(box.className).toContain("gridra-box--full-width");
    expect(box.className).toContain("gridra-box--full-height");
    expect(box.className).toContain("gridra-box--min-width-zero");
    expect(box.className).toContain("gridra-box--min-height-zero");
  });
});
