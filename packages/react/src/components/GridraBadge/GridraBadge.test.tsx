import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraBadge } from "./GridraBadge";

afterEach(() => {
  cleanup();
});

describe("GridraBadge", () => {
  it("renders default badge classes and children", () => {
    render(<GridraBadge>Draft</GridraBadge>);
    const badge = screen.getByText("Draft");

    expect(badge.className).toContain("gridra-badge");
    expect(badge.className).toContain("gridra-badge--default");
    expect(badge.className).toContain("gridra-badge--md");
    expect(badge.className).toContain("gridra-badge--square");
  });

  it("supports tone, size, shape, className, and span attributes", () => {
    render(
      <GridraBadge aria-label="Build status" className="custom-badge" data-testid="badge" shape="pill" size="sm" title="Ready" tone="success">
        Live
      </GridraBadge>
    );
    const badge = screen.getByTestId("badge");

    expect(badge.getAttribute("aria-label")).toBe("Build status");
    expect(badge.getAttribute("title")).toBe("Ready");
    expect(badge.className).toContain("gridra-badge--success");
    expect(badge.className).toContain("gridra-badge--sm");
    expect(badge.className).toContain("gridra-badge--pill");
    expect(badge.className).toContain("custom-badge");
  });
});
