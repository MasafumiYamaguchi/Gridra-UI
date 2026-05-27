import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraProgress } from "./GridraProgress";

afterEach(() => {
  cleanup();
});

describe("GridraProgress", () => {
  it("renders determinate progress with correct aria attributes", () => {
    const { container } = render(<GridraProgress value={50} />);
    const bar = screen.getByRole("progressbar");

    expect(bar).toBeTruthy();
    expect(bar.getAttribute("aria-valuenow")).toBe("50");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
    expect(bar.getAttribute("aria-valuemin")).toBe("0");

    const fill = container.querySelector(".gridra-progress__fill");
    expect(fill).toBeTruthy();
    expect((fill as HTMLElement).style.width).toBe("50%");
  });

  it("clamps value to the 0…max range", () => {
    const { rerender } = render(
      <GridraProgress max={100} value={150} />,
    );
    let bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("100");

    rerender(<GridraProgress max={100} value={-10} />);
    bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("0");
  });

  it("renders indeterminate without aria-valuenow", () => {
    render(<GridraProgress />);
    const bar = screen.getByRole("progressbar");

    expect(bar).toBeTruthy();
    expect(bar.hasAttribute("aria-valuenow")).toBe(false);
    expect(bar.className).toContain("gridra-progress--indeterminate");
  });

  it("uses a custom max value", () => {
    const { container } = render(<GridraProgress max={10} value={5} />);
    const bar = screen.getByRole("progressbar");
    const fill = container.querySelector(".gridra-progress__fill");

    expect(bar.getAttribute("aria-valuenow")).toBe("5");
    expect(bar.getAttribute("aria-valuemax")).toBe("10");
    expect((fill as HTMLElement).style.width).toBe("50%");
  });

  it("falls back to the default max for invalid max values", () => {
    const { rerender } = render(<GridraProgress max={0} value={150} />);
    let bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("100");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");

    rerender(<GridraProgress max={-1} value={50} />);
    bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("50");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");

    rerender(<GridraProgress max={Number.NaN} value={50} />);
    bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("50");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
  });

  it("normalizes non-finite values before clamping", () => {
    const { rerender } = render(
      <GridraProgress value={Number.NaN} />,
    );
    let bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("0");

    rerender(<GridraProgress value={Number.POSITIVE_INFINITY} />);
    bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("0");
  });

  it("applies the size variant class", () => {
    render(<GridraProgress size="sm" value={50} />);
    expect(screen.getByRole("progressbar").className).toContain(
      "gridra-progress--sm",
    );
  });

  it("applies the tone variant class", () => {
    render(<GridraProgress tone="danger" value={50} />);
    expect(screen.getByRole("progressbar").className).toContain(
      "gridra-progress--danger",
    );
  });

  it("sets aria-label from the label prop", () => {
    render(<GridraProgress label="Uploading files" value={50} />);
    expect(
      screen.getByRole("progressbar").getAttribute("aria-label"),
    ).toBe("Uploading files");
  });

  it("passes through className", () => {
    render(
      <GridraProgress className="custom-bar" value={50} />,
    );
    expect(screen.getByRole("progressbar").className).toContain(
      "custom-bar",
    );
  });
});
