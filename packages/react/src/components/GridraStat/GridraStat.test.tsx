import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraStat } from "./GridraStat";

afterEach(() => {
  cleanup();
});

describe("GridraStat", () => {
  it("renders label, value, and description", () => {
    render(<GridraStat description="+12%" label="Revenue" value="$42k" />);
    const stat = screen.getByText("$42k").closest(".gridra-stat");

    expect(stat?.className).toContain("gridra-stat--md");
    expect(stat?.className).toContain("gridra-stat--default");
    expect(screen.getByText("Revenue").className).toContain("gridra-stat__label");
    expect(screen.getByText("$42k").className).toContain("gridra-stat__value");
    expect(screen.getByText("+12%").className).toContain("gridra-stat__description");
  });

  it("supports className, data, aria, style, size, tone, and alignment", () => {
    render(
      <GridraStat
        align="end"
        aria-label="Active nodes"
        className="custom-stat"
        data-testid="stat"
        size="lg"
        style={{ minWidth: 160 }}
        tone="accent"
        value="128"
      />
    );
    const stat = screen.getByTestId("stat");

    expect(stat.getAttribute("aria-label")).toBe("Active nodes");
    expect(stat.className).toContain("custom-stat");
    expect(stat.className).toContain("gridra-stat--lg");
    expect(stat.className).toContain("gridra-stat--accent");
    expect(stat.className).toContain("gridra-stat--align-end");
    expect((stat as HTMLElement).style.minWidth).toBe("160px");
  });

  it("does not add button or status semantics by default", () => {
    render(<GridraStat value="Passive" />);

    expect(screen.getByText("Passive").closest(".gridra-stat")?.getAttribute("role")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
