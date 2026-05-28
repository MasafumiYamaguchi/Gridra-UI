import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraStatusIndicator } from "./GridraStatusIndicator";

afterEach(() => {
  cleanup();
});

describe("GridraStatusIndicator", () => {
  it("renders with default tone and size", () => {
    const { container } = render(
      <GridraStatusIndicator label="Online" />,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("gridra-status-indicator");
    expect(el.className).toContain("gridra-status-indicator--neutral");
    expect(el.className).toContain("gridra-status-indicator--md");
    expect(screen.getByText("Online")).toBeTruthy();
  });

  it("renders without a label", () => {
    const { container } = render(<GridraStatusIndicator />);
    const label = container.querySelector(
      ".gridra-status-indicator__label",
    );
    expect(label).toBeNull();
  });

  it("applies tone variant", () => {
    const { container } = render(
      <GridraStatusIndicator label="Saved" tone="success" />,
    );
    expect(container.firstElementChild!.className).toContain(
      "gridra-status-indicator--success",
    );
  });

  it("applies size variant", () => {
    const { container } = render(
      <GridraStatusIndicator label="Syncing" size="sm" />,
    );
    expect(container.firstElementChild!.className).toContain(
      "gridra-status-indicator--sm",
    );
  });

  it("applies pulse class when pulse is true", () => {
    const { container } = render(
      <GridraStatusIndicator label="Syncing" pulse />,
    );
    expect(container.firstElementChild!.className).toContain(
      "gridra-status-indicator--pulse",
    );
  });

  it("renders dot with aria-hidden", () => {
    const { container } = render(<GridraStatusIndicator label="OK" />);
    const dot = container.querySelector(
      ".gridra-status-indicator__dot",
    );
    expect(dot).toBeTruthy();
    expect(dot!.getAttribute("aria-hidden")).toBe("true");
  });

  it("does not auto-assign button/progress/status role", () => {
    const { container } = render(
      <GridraStatusIndicator label="Online" />,
    );
    const el = container.firstElementChild!;
    expect(el.getAttribute("role")).toBeNull();
  });

  it("passes through className and data attributes", () => {
    const { container } = render(
      <GridraStatusIndicator
        className="my-indicator"
        data-testid="ind"
        label="Idle"
      />,
    );
    const el = container.firstElementChild!;
    expect(el.className).toContain("my-indicator");
    expect(el.getAttribute("data-testid")).toBe("ind");
  });
});
