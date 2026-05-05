import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraCanvasArea } from "./GridraCanvasArea";

afterEach(() => {
  cleanup();
});

describe("GridraCanvasArea", () => {
  it("maps grid counts to CSS grid variables", () => {
    const { container } = render(<GridraCanvasArea gridColumns={12} gridRows={8} />);
    const canvas = container.querySelector(".gridra-canvas-area");

    expect(canvas?.getAttribute("style")).toContain("--gridra-grid-columns: 12");
    expect(canvas?.getAttribute("style")).toContain("--gridra-grid-rows: 8");
  });

  it("places nodes by grid line and span", () => {
    render(
      <GridraCanvasArea
        nodes={[
          {
            id: "input",
            label: "Input",
            placement: { column: 2, row: 3, columnSpan: 4, rowSpan: 2 }
          }
        ]}
      />
    );

    const node = document.querySelector(".gridra-node");

    expect(node?.getAttribute("style")).toContain("grid-column: 2 / span 4");
    expect(node?.getAttribute("style")).toContain("grid-row: 3 / span 2");
  });
});
