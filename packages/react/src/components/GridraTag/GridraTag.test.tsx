import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraTag } from "./GridraTag";

afterEach(() => {
  cleanup();
});

describe("GridraTag", () => {
  it("renders default tag classes and children", () => {
    render(<GridraTag>Graph</GridraTag>);
    const tag = screen.getByText("Graph");

    expect(tag.tagName).toBe("SPAN");
    expect(tag.className).toContain("gridra-tag");
    expect(tag.className).toContain("gridra-tag--md");
    expect(tag.className).toContain("gridra-tag--default");
  });

  it("supports tone, size, className, and attributes", () => {
    render(
      <GridraTag
        aria-label="Environment tag"
        className="custom-tag"
        data-testid="tag"
        size="sm"
        style={{ maxWidth: 80 }}
        tone="success"
      >
        Prod
      </GridraTag>
    );
    const tag = screen.getByTestId("tag");

    expect(tag.getAttribute("aria-label")).toBe("Environment tag");
    expect(tag.className).toContain("custom-tag");
    expect(tag.className).toContain("gridra-tag--sm");
    expect(tag.className).toContain("gridra-tag--success");
    expect((tag as HTMLElement).style.maxWidth).toBe("80px");
  });

  it("does not add button or status semantics by default", () => {
    render(<GridraTag>Passive</GridraTag>);

    expect(screen.getByText("Passive").getAttribute("role")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
