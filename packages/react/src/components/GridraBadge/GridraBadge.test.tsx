import { readFileSync } from "node:fs";
import { resolve } from "node:path";
const themeCss = readFileSync(resolve("../theme/src/base.css"), "utf8");
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraBadge } from "./GridraBadge";

afterEach(() => {
  cleanup();
});

describe("GridraBadge", () => {
  it("keeps outline labels case-preserving and constrained for every size and tone", () => {
    const style = document.createElement("style");
    style.textContent = themeCss.replace(/@import[^;]+;/g, "");
    document.head.append(style);
    try {
      for (const size of ["sm", "md"] as const) {
        for (const tone of ["default", "accent", "muted", "success", "warning", "danger"] as const) {
          const { container, unmount } = render(<GridraBadge variant="outline" size={size} tone={tone}>Production</GridraBadge>);
          const badge = getComputedStyle(container.firstElementChild!);
          expect(badge.textTransform).toBe("none");
          expect(badge.maxWidth).toBe("100%");
          expect(badge.minWidth).toBe("0");
          expect(badge.minHeight).toBe(size === "sm" ? "18px" : "22px");
          expect(badge.fontSize).toBe(size === "sm" ? "10px" : "11px");
          expect(badge.padding).toBe(size === "sm" ? "0px 6px" : "0px 8px");
          if (["success", "warning", "danger"].includes(tone)) {
            expect(badge.getPropertyValue("--gridra-badge-outline-border")).toBe(`var(--gridra-color-${tone})`);
            expect(badge.getPropertyValue("--gridra-badge-outline-color")).toBe(`var(--gridra-color-${tone}-text)`);
          }
          unmount();
        }
      }
    } finally { style.remove(); }
  });

  it("supports outline metadata labels without changing solid defaults", () => {
    render(
      <>
        <GridraBadge data-testid="outline" shape="pill" size="sm" tone="success" variant="outline">Production</GridraBadge>
        <GridraBadge data-testid="solid">Active</GridraBadge>
      </>,
    );
    const outline = screen.getByTestId("outline");
    expect(outline.textContent).toBe("Production");
    expect(outline.className).toContain("gridra-badge--outline");
    expect(outline.className).toContain("gridra-badge--pill");
    expect(outline.className).toContain("gridra-badge--success");
    expect(screen.getByTestId("solid").className).toContain("gridra-badge--solid");
  });

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

  it("does not add button or status semantics by default", () => {
    render(<GridraBadge>Passive</GridraBadge>);
    const badge = screen.getByText("Passive");

    expect(badge.tagName).toBe("SPAN");
    expect(badge.getAttribute("role")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("allows explicit semantics without changing the span contract", () => {
    render(
      <GridraBadge aria-live="polite" role="status" tone="warning">
        Syncing
      </GridraBadge>,
    );
    const badge = screen.getByRole("status");

    expect(badge.tagName).toBe("SPAN");
    expect(badge.getAttribute("aria-live")).toBe("polite");
    expect(badge.className).toContain("gridra-badge--warning");
  });
});
