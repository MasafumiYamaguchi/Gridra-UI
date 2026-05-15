import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraContainer } from "./GridraContainer";

afterEach(() => {
  cleanup();
});

describe("GridraContainer", () => {
  it("renders default classes", () => {
    render(<GridraContainer>Content</GridraContainer>);
    const node = screen.getByText("Content");

    expect(node.className).toContain("gridra-container");
    expect(node.className).toContain("gridra-container--size-lg");
    expect(node.className).toContain("gridra-container--align-center");
  });

  it("applies size and align modifiers", () => {
    render(
      <GridraContainer align="end" size="sm">
        A
      </GridraContainer>
    );
    const node = screen.getByText("A");

    expect(node.className).toContain("gridra-container--size-sm");
    expect(node.className).toContain("gridra-container--align-end");
  });

  it("applies maxWidth override", () => {
    render(<GridraContainer maxWidth={840}>B</GridraContainer>);
    const node = screen.getByText("B");

    expect(node.getAttribute("style")).toContain("--gridra-container-max-width: 840px");
  });

  it("supports full size token", () => {
    render(<GridraContainer size="full">Wide</GridraContainer>);
    const node = screen.getByText("Wide");

    expect(node.className).toContain("gridra-container--size-full");
  });

  it("forwards GridraBox props", () => {
    render(
      <GridraContainer as="section" border="default" fullWidth padding="sm" surface="raised">
        Box
      </GridraContainer>
    );
    const node = screen.getByText("Box");

    expect(node.tagName.toLowerCase()).toBe("section");
    expect(node.className).toContain("gridra-box--padding-sm");
    expect(node.className).toContain("gridra-box--surface-raised");
    expect(node.className).toContain("gridra-box--border-default");
    expect(node.className).toContain("gridra-box--full-width");
  });
});
