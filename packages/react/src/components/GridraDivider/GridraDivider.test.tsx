import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraDivider } from "./GridraDivider";

afterEach(() => {
  cleanup();
});

describe("GridraDivider", () => {
  it("renders the default horizontal separator contract", () => {
    render(<GridraDivider />);
    const divider = screen.getByRole("separator");

    expect(divider.tagName).toBe("HR");
    expect(divider.getAttribute("aria-orientation")).toBe("horizontal");
    expect(divider.className).toContain("gridra-divider--horizontal");
    expect(divider.className).toContain("gridra-divider--sm");
    expect(divider.className).toContain("gridra-divider--default");
  });

  it("supports vertical orientation, spacing, tone, inset, and attributes", () => {
    render(
      <GridraDivider
        aria-label="Section break"
        className="custom-divider"
        data-testid="divider"
        inset
        orientation="vertical"
        spacing="lg"
        tone="strong"
      />
    );
    const divider = screen.getByTestId("divider");

    expect(divider.getAttribute("aria-label")).toBe("Section break");
    expect(divider.getAttribute("aria-orientation")).toBe("vertical");
    expect(divider.className).toContain("gridra-divider--vertical");
    expect(divider.className).toContain("gridra-divider--lg");
    expect(divider.className).toContain("gridra-divider--strong");
    expect(divider.className).toContain("gridra-divider--inset");
    expect(divider.className).toContain("custom-divider");
  });
});
