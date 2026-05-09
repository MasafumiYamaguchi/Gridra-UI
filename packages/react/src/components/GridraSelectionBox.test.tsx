import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraSelectionBox } from "./GridraSelectionBox";

afterEach(() => {
  cleanup();
});

describe("GridraSelectionBox", () => {
  it("maps grid placement to grid line and span styles", () => {
    const { container } = render(
      <GridraSelectionBox placement={{ column: 2, row: 3, columnSpan: 4, rowSpan: 2 }} />
    );
    const selectionBox = container.querySelector(".gridra-selection-box");

    expect(selectionBox?.classList.contains("gridra-selection-box--placement")).toBe(true);
    expect(selectionBox?.getAttribute("style")).toContain("grid-column: 2 / span 4");
    expect(selectionBox?.getAttribute("style")).toContain("grid-row: 3 / span 2");
  });

  it("maps rect coordinates to absolute box styles", () => {
    const { container } = render(
      <GridraSelectionBox rect={{ x: 12, y: 16, width: 120, height: 80 }} />
    );
    const selectionBox = container.querySelector(".gridra-selection-box");

    expect(selectionBox?.classList.contains("gridra-selection-box--rect")).toBe(true);
    expect(selectionBox?.getAttribute("style")).toContain("left: 12px");
    expect(selectionBox?.getAttribute("style")).toContain("top: 16px");
    expect(selectionBox?.getAttribute("style")).toContain("width: 120px");
    expect(selectionBox?.getAttribute("style")).toContain("height: 80px");
  });

  it("does not render when hidden", () => {
    const { container } = render(
      <GridraSelectionBox
        rect={{ x: 12, y: 16, width: 120, height: 80 }}
        visible={false}
      />
    );

    expect(container.querySelector(".gridra-selection-box")).toBeNull();
  });

  it("does not render without placement or rect data", () => {
    const { container } = render(<GridraSelectionBox />);

    expect(container.querySelector(".gridra-selection-box")).toBeNull();
  });

  it("normalizes invalid dimensions to a zero-sized box", () => {
    const { container } = render(
      <GridraSelectionBox
        rect={{ x: Number.NaN, y: Number.POSITIVE_INFINITY, width: -20, height: Number.NaN }}
      />
    );
    const selectionBox = container.querySelector(".gridra-selection-box");

    expect(selectionBox?.getAttribute("style")).toContain("left: 0px");
    expect(selectionBox?.getAttribute("style")).toContain("top: 0px");
    expect(selectionBox?.getAttribute("style")).toContain("width: 0px");
    expect(selectionBox?.getAttribute("style")).toContain("height: 0px");
  });
});
