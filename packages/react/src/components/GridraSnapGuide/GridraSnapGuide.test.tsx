import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraSnapGuide } from "./GridraSnapGuide";

afterEach(() => {
  cleanup();
});

describe("GridraSnapGuide", () => {
  it("maps a vertical pixel position to absolute guide styles", () => {
    const { container } = render(<GridraSnapGuide end={120} position={32} start={8} />);
    const guide = container.querySelector(".gridra-snap-guide");

    expect(guide?.classList.contains("gridra-snap-guide--vertical")).toBe(true);
    expect(guide?.classList.contains("gridra-snap-guide--position")).toBe(true);
    expect(guide?.getAttribute("aria-hidden")).toBe("true");
    expect(guide?.getAttribute("style")).toContain("left: 32px");
    expect(guide?.getAttribute("style")).toContain("top: 8px");
    expect(guide?.getAttribute("style")).toContain("height: 112px");
  });

  it("maps a horizontal pixel position to absolute guide styles", () => {
    const { container } = render(
      <GridraSnapGuide end={90} orientation="horizontal" position={24} start={10} />
    );
    const guide = container.querySelector(".gridra-snap-guide");

    expect(guide?.classList.contains("gridra-snap-guide--horizontal")).toBe(true);
    expect(guide?.getAttribute("style")).toContain("top: 24px");
    expect(guide?.getAttribute("style")).toContain("left: 10px");
    expect(guide?.getAttribute("style")).toContain("width: 80px");
  });

  it("maps vertical placement to grid line and row span styles", () => {
    const { container } = render(
      <GridraSnapGuide placement={{ column: 4, row: 2, rowSpan: 3 }} />
    );
    const guide = container.querySelector(".gridra-snap-guide");

    expect(guide?.classList.contains("gridra-snap-guide--placement")).toBe(true);
    expect(guide?.getAttribute("style")).toContain("grid-column: 4 / span 1");
    expect(guide?.getAttribute("style")).toContain("grid-row: 2 / span 3");
  });

  it("maps horizontal placement to grid row and column span styles", () => {
    const { container } = render(
      <GridraSnapGuide
        orientation="horizontal"
        placement={{ column: 2, row: 5, columnSpan: 6 }}
      />
    );
    const guide = container.querySelector(".gridra-snap-guide");

    expect(guide?.getAttribute("style")).toContain("grid-column: 2 / span 6");
    expect(guide?.getAttribute("style")).toContain("grid-row: 5 / span 1");
  });

  it("does not render when inactive, hidden, or missing guide data", () => {
    const inactive = render(<GridraSnapGuide active={false} position={12} />);
    expect(inactive.container.querySelector(".gridra-snap-guide")).toBeNull();
    inactive.unmount();

    const hidden = render(<GridraSnapGuide position={12} visible={false} />);
    expect(hidden.container.querySelector(".gridra-snap-guide")).toBeNull();
    hidden.unmount();

    const missing = render(<GridraSnapGuide />);
    expect(missing.container.querySelector(".gridra-snap-guide")).toBeNull();
  });

  it("normalizes invalid placement and dimensions", () => {
    const { container } = render(
      <GridraSnapGuide
        end={-10}
        placement={{ column: Number.NaN, row: 0, rowSpan: Number.POSITIVE_INFINITY }}
        position={Number.NaN}
        start={10}
      />
    );
    const guide = container.querySelector(".gridra-snap-guide");

    expect(guide?.getAttribute("style")).toContain("grid-column: 1 / span 1");
    expect(guide?.getAttribute("style")).toContain("grid-row: 1 / span 1");
    expect(guide?.getAttribute("style")).toContain("left: 0px");
    expect(guide?.getAttribute("style")).toContain("top: 10px");
    expect(guide?.getAttribute("style")).toContain("height: 0px");
  });
});
