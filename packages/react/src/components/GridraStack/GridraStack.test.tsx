import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraStack } from "./GridraStack";

afterEach(() => {
  cleanup();
});

describe("GridraStack", () => {
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
