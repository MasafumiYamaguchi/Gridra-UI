import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraKbd } from "./GridraKbd";

afterEach(() => {
  cleanup();
});

describe("GridraKbd", () => {
  it("renders a kbd element with default classes", () => {
    render(<GridraKbd>Esc</GridraKbd>);
    const key = screen.getByText("Esc");

    expect(key.tagName).toBe("KBD");
    expect(key.className).toContain("gridra-kbd");
    expect(key.className).toContain("gridra-kbd--md");
  });

  it("supports size, className, and passthrough attributes", () => {
    render(
      <GridraKbd
        aria-label="Command key"
        className="custom-kbd"
        data-testid="kbd"
        size="sm"
        style={{ minWidth: 24 }}
      >
        Cmd
      </GridraKbd>
    );
    const key = screen.getByTestId("kbd");

    expect(key.getAttribute("aria-label")).toBe("Command key");
    expect(key.className).toContain("custom-kbd");
    expect(key.className).toContain("gridra-kbd--sm");
    expect((key as HTMLElement).style.minWidth).toBe("24px");
  });

  it("does not add button or status semantics by default", () => {
    render(<GridraKbd>Tab</GridraKbd>);

    expect(screen.getByText("Tab").getAttribute("role")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
