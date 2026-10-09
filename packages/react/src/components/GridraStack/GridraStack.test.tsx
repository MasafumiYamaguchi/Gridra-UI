import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraStack, GridraStackItem } from "./GridraStack";

afterEach(() => {
  cleanup();
});

const themeCss = readFileSync(resolve("../theme/src/base.css"), "utf8");

describe("GridraStack", () => {
  it("supports inline rows, rowGap, separators and grow items", () => {
    const { container } = render(
      <GridraStack data-testid="row" direction="horizontal" inline wrap rowGap="lg" separator="/" fullWidth>
        {null}{false}{""}
        <span>First</span>
        <GridraStackItem grow data-testid="grow">Second</GridraStackItem>
      </GridraStack>,
    );
    const row = screen.getByTestId("row");
    expect(row.className).toContain("gridra-box--display-inline-flex");
    expect(row.className).toContain("gridra-stack--row-gap-lg");
    expect(row.className).toContain("gridra-stack--wrap");
    expect(container.querySelectorAll(".gridra-stack__separator")).toHaveLength(1);
    expect(screen.getByTestId("grow").className).toContain("gridra-stack-item--grow");
  });

  it("keeps zero-valued children and omits separators for empty or single-child rows", () => {
    const { container, rerender } = render(<GridraStack separator="/">{0}<span>Value</span></GridraStack>);
    expect(container.querySelectorAll(".gridra-stack__separator")).toHaveLength(1);
    expect(container.textContent).toBe("0/Value");
    rerender(<GridraStack separator="/">{false}{""}<span>Only</span></GridraStack>);
    expect(container.querySelector(".gridra-stack__separator")).toBeNull();
    rerender(<GridraStack separator="/" />);
    expect(container.querySelector(".gridra-stack__separator")).toBeNull();
  });

  it("applies inline display, direction, wrapping, independent rowGap and grow styles", () => {
    const style = document.createElement("style");
    style.textContent = themeCss.replace(/@import[^;]+;/g, "");
    document.head.append(style);
    try {
      const { container } = render(<>
        <GridraStack data-testid="column" />
        <GridraStack data-testid="row" direction="horizontal" inline wrap align="center" gap="sm" rowGap="md" separator="/">
          <span>First</span><GridraStackItem data-testid="grow" grow>Second</GridraStackItem>
        </GridraStack>
      </>);
      const column = getComputedStyle(screen.getByTestId("column"));
      expect(column.display).toBe("flex");
      expect(column.flexDirection).toBe("column");
      const row = getComputedStyle(screen.getByTestId("row"));
      expect(row.display).toBe("inline-flex");
      expect(row.flexDirection).toBe("row");
      expect(row.flexWrap).toBe("wrap");
      expect(row.alignItems).toBe("center");
      expect(row.gap).toBe("var(--gridra-space-sm)");
      expect(row.rowGap).toBe("var(--gridra-space-md)");
      expect(getComputedStyle(screen.getByTestId("grow")).flex).toBe("1 1 auto");
      expect(getComputedStyle(container.querySelector(".gridra-stack__separator")!).flex).toBe("0 0 auto");
    } finally { style.remove(); }
  });

  it("renders children with default classes", () => {
    render(<GridraStack>Content</GridraStack>);
    const stack = screen.getByText("Content");

    expect(stack.tagName.toLowerCase()).toBe("div");
    expect(stack.className).toContain("gridra-stack");
    expect(stack.className).toContain("gridra-stack--vertical");
    expect(stack.className).toContain("gridra-stack--gap-md");
    expect(stack.className).toContain("gridra-stack--align-stretch");
    expect(stack.className).toContain("gridra-stack--justify-start");
    expect(stack.className).toContain("gridra-box");
    expect(stack.className).toContain("gridra-box--display-flex");
  });

  it("supports horizontal direction with reverse", () => {
    render(<GridraStack direction="horizontal" reverse>Reversed</GridraStack>);
    const stack = screen.getByText("Reversed");

    expect(stack.className).toContain("gridra-stack--horizontal-reverse");
  });

  it("applies gap, align, justify, and wrap classes", () => {
    render(
      <GridraStack align="center" gap="lg" justify="between" wrap>
        Configured
      </GridraStack>
    );
    const stack = screen.getByText("Configured");

    expect(stack.className).toContain("gridra-stack--gap-lg");
    expect(stack.className).toContain("gridra-stack--align-center");
    expect(stack.className).toContain("gridra-stack--justify-between");
    expect(stack.className).toContain("gridra-stack--wrap");
  });

  it("forwards Box-derived props", () => {
    render(
      <GridraStack
        border="default"
        padding="sm"
        radius="md"
        scroll="y"
        surface="raised"
      >
        BoxProps
      </GridraStack>
    );
    const stack = screen.getByText("BoxProps");

    expect(stack.className).toContain("gridra-box--padding-sm");
    expect(stack.className).toContain("gridra-box--surface-raised");
    expect(stack.className).toContain("gridra-box--border-default");
    expect(stack.className).toContain("gridra-box--radius-md");
    expect(stack.className).toContain("gridra-box--scroll-y");
  });

  it("supports semantic as prop", () => {
    render(<GridraStack as="section">Section</GridraStack>);
    const stack = screen.getByText("Section");

    expect(stack.tagName.toLowerCase()).toBe("section");
  });

  it("forwards className, id, aria-label, data-testid, and style", () => {
    render(
      <GridraStack
        aria-label="stack"
        className="custom-stack"
        data-testid="my-stack"
        id="stack-id"
        style={{ color: "blue" }}
      >
        Styled
      </GridraStack>
    );
    const stack = screen.getByTestId("my-stack");

    expect(stack.className).toContain("gridra-stack");
    expect(stack.className).toContain("custom-stack");
    expect(stack.id).toBe("stack-id");
    expect(stack.getAttribute("aria-label")).toBe("stack");
    expect((stack as HTMLElement).style.color).toBe("blue");
  });
});
