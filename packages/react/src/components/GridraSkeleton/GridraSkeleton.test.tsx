import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraSkeleton } from "./GridraSkeleton";

afterEach(() => {
  cleanup();
});

describe("GridraSkeleton", () => {
  it("renders with default variant and aria-hidden", () => {
    const { container } = render(<GridraSkeleton />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("gridra-skeleton");
    expect(el.className).toContain("gridra-skeleton--block");
    expect(el.getAttribute("aria-hidden")).toBe("true");
  });

  it("applies variant class", () => {
    const { container } = render(
      <GridraSkeleton variant="text" />,
    );
    expect(container.firstElementChild!.className).toContain(
      "gridra-skeleton--text",
    );
  });

  it("renders circle variant", () => {
    const { container } = render(
      <GridraSkeleton variant="circle" />,
    );
    expect(container.firstElementChild!.className).toContain(
      "gridra-skeleton--circle",
    );
  });

  it("applies size class", () => {
    const { container } = render(<GridraSkeleton size="lg" />);
    expect(container.firstElementChild!.className).toContain(
      "gridra-skeleton--lg",
    );
  });

  it("omits animated class when animated is false", () => {
    const { container } = render(
      <GridraSkeleton animated={false} />,
    );
    expect(
      container.firstElementChild!.className,
    ).not.toContain("gridra-skeleton--animated");
  });

  it("applies width and height as CSS custom properties", () => {
    const { container } = render(
      <GridraSkeleton height={16} width="50%" />,
    );
    const style = (container.firstElementChild as HTMLElement).style;
    expect(style.getPropertyValue("--gridra-skeleton-width")).toBe(
      "50%",
    );
    expect(style.getPropertyValue("--gridra-skeleton-height")).toBe(
      "16px",
    );
  });

  it("renders text rows when rows is specified", () => {
    const { container } = render(
      <GridraSkeleton rows={3} variant="text" />,
    );
    const rows = container.querySelectorAll(".gridra-skeleton__row");
    expect(rows.length).toBe(3);
  });

  it("clamps rows to minimum 1", () => {
    const { container } = render(
      <GridraSkeleton rows={0} variant="text" />,
    );
    expect(
      container.querySelectorAll(".gridra-skeleton__row").length,
    ).toBe(1);
  });

  it("allows overriding aria-hidden", () => {
    const { container } = render(
      <GridraSkeleton aria-hidden="false" />,
    );
    expect(
      container.firstElementChild!.getAttribute("aria-hidden"),
    ).toBe("false");
  });

  it("passes through className and data attributes", () => {
    const { container } = render(
      <GridraSkeleton className="my-skel" data-testid="skel" />,
    );
    const el = container.firstElementChild!;
    expect(el.className).toContain("my-skel");
    expect(el.getAttribute("data-testid")).toBe("skel");
  });
});
