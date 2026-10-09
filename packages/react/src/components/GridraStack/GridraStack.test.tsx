import themeCss from "../../../../theme/src/base.css?raw";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraStack, GridraStackItem } from "./GridraStack";

afterEach(() => {
  cleanup();
});

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

  it("preserves legacy inline and cluster spacing, alignment and wrapping CSS", () => {
    const style = document.createElement("style");
    style.textContent = themeCss.replace(/@import[^;]+;/g, "");
    document.head.append(style);
    try {
      for (const kind of ["inline", "cluster"] as const) {
        const { container, unmount } = render(<>
          <div className={`gridra-box gridra-box--display-${kind === "inline" ? "inline-flex" : "flex"} gridra-${kind} gridra-${kind}--gap-sm gridra-${kind}--align-center gridra-${kind}--justify-start`} />
          <GridraStack direction="horizontal" inline={kind === "inline"} wrap={kind === "cluster"} align="center" gap="sm" />
        </>);
        const [legacy, stack] = Array.from(container.children, (element) => getComputedStyle(element));
        for (const property of ["display", "min-width", "min-height", "gap", "align-items", "justify-content", "flex-wrap"]) {
          expect(stack.getPropertyValue(property), `${kind}: ${property}`).toBe(legacy.getPropertyValue(property));
        }
        unmount();
      }
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
