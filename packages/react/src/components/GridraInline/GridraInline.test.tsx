import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraInline, GridraInlineItem } from "./GridraInline";

afterEach(() => {
  cleanup();
});

describe("GridraInline", () => {
  it("renders children with default classes", () => {
    render(<GridraInline>Content</GridraInline>);
    const inline = screen.getByText("Content");

    expect(inline.tagName.toLowerCase()).toBe("div");
    expect(inline.className).toContain("gridra-inline");
    expect(inline.className).toContain("gridra-inline--gap-sm");
    expect(inline.className).toContain("gridra-inline--align-center");
    expect(inline.className).toContain("gridra-inline--justify-start");
    expect(inline.className).toContain("gridra-box");
    expect(inline.className).toContain("gridra-box--display-inline-flex");
  });

  it("applies gap, align, and justify classes", () => {
    render(
      <GridraInline align="end" gap="lg" justify="between">
        Configured
      </GridraInline>
    );
    const inline = screen.getByText("Configured");

    expect(inline.className).toContain("gridra-inline--gap-lg");
    expect(inline.className).toContain("gridra-inline--align-end");
    expect(inline.className).toContain("gridra-inline--justify-between");
  });

  it("forwards Box-derived props", () => {
    render(
      <GridraInline
        border="default"
        fullWidth
        padding="sm"
        radius="md"
        surface="raised"
      >
        BoxProps
      </GridraInline>
    );
    const inline = screen.getByText("BoxProps");

    expect(inline.className).toContain("gridra-box--padding-sm");
    expect(inline.className).toContain("gridra-box--surface-raised");
    expect(inline.className).toContain("gridra-box--border-default");
    expect(inline.className).toContain("gridra-box--radius-md");
    expect(inline.className).toContain("gridra-box--full-width");
  });

  it("supports semantic as prop", () => {
    render(<GridraInline as="section">Section</GridraInline>);
    const inline = screen.getByText("Section");

    expect(inline.tagName.toLowerCase()).toBe("section");
  });

  it("forwards className, id, aria-label, data-testid, and style", () => {
    render(
      <GridraInline
        aria-label="inline"
        className="custom-inline"
        data-testid="my-inline"
        id="inline-id"
        style={{ color: "blue" }}
      >
        Styled
      </GridraInline>
    );
    const inline = screen.getByTestId("my-inline");

    expect(inline.className).toContain("gridra-inline");
    expect(inline.className).toContain("custom-inline");
    expect(inline.id).toBe("inline-id");
    expect(inline.getAttribute("aria-label")).toBe("inline");
    expect((inline as HTMLElement).style.color).toBe("blue");
  });

  it("renders separator between children only", () => {
    render(
      <GridraInline separator={<span data-testid="sep">|</span>}>
        <span data-testid="child-a">A</span>
        <span data-testid="child-b">B</span>
        <span data-testid="child-c">C</span>
      </GridraInline>
    );

    const separators = screen.getAllByTestId("sep");
    expect(separators.length).toBe(2);
  });

  it("does not render separator when there is one child", () => {
    render(
      <GridraInline separator={<span data-testid="sep">|</span>}>
        <span>A</span>
      </GridraInline>
    );

    expect(screen.queryByTestId("sep")).toBeNull();
  });

  it("does not render separator when there are no children", () => {
    render(<GridraInline separator={<span data-testid="sep">|</span>} />);

    expect(screen.queryByTestId("sep")).toBeNull();
  });

  it("does not render separator for falsy children when only one truthy child remains", () => {
    render(
      <GridraInline separator={<span data-testid="sep">|</span>}>
        {null}
        {false}
        <span>A</span>
        {undefined}
        {""}
      </GridraInline>
    );

    expect(screen.queryByTestId("sep")).toBeNull();
  });
});

describe("GridraInlineItem", () => {
  it("renders with default class", () => {
    render(<GridraInlineItem data-testid="item">Item</GridraInlineItem>);
    const item = screen.getByTestId("item");

    expect(item.tagName.toLowerCase()).toBe("span");
    expect(item.className).toContain("gridra-inline-item");
  });

  it("applies grow class when grow is true", () => {
    render(
      <GridraInlineItem grow data-testid="item">
        Item
      </GridraInlineItem>
    );
    const item = screen.getByTestId("item");

    expect(item.className).toContain("gridra-inline-item--grow");
  });

  it("forwards span attributes", () => {
    render(
      <GridraInlineItem aria-label="item" data-testid="item" id="item-id">
        Item
      </GridraInlineItem>
    );
    const item = screen.getByTestId("item");

    expect(item.id).toBe("item-id");
    expect(item.getAttribute("aria-label")).toBe("item");
  });
});
