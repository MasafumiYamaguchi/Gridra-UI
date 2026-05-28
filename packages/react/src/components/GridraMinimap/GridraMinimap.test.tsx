import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraMinimap } from "./GridraMinimap";

afterEach(() => {
  cleanup();
});

describe("GridraMinimap", () => {
  it("renders nodes using percentage placement", () => {
    const { container } = render(
      <GridraMinimap
        gridColumns={10}
        gridRows={5}
        nodes={[{ id: "a", placement: { column: 2, row: 2, columnSpan: 3, rowSpan: 2 } }]}
      />
    );

    const node = container.querySelector('[data-gridra-minimap-node-id="a"]');
    expect(node?.getAttribute("style")).toContain("left: 10%");
    expect(node?.getAttribute("style")).toContain("top: 20%");
    expect(node?.getAttribute("style")).toContain("width: 30%");
    expect(node?.getAttribute("style")).toContain("height: 40%");
  });

  it("marks selected nodes", () => {
    const { container } = render(
      <GridraMinimap
        nodes={[{ id: "a", placement: { column: 1, row: 1 } }]}
        selectedIds={["a"]}
      />
    );
    const node = container.querySelector('[data-gridra-minimap-node-id="a"]');
    expect(node?.classList.contains("gridra-minimap__node--selected")).toBe(true);
  });

  it("renders viewport when provided", () => {
    const { container } = render(
      <GridraMinimap gridColumns={12} gridRows={6} viewport={{ x: 3, y: 1, width: 6, height: 3 }} />
    );
    const viewport = container.querySelector(".gridra-minimap__viewport");
    expect(viewport?.getAttribute("style")).toContain("left: 25%");
    expect(viewport?.getAttribute("style")).toContain("width: 50%");
  });

  it("hides viewport when disabled", () => {
    const { container } = render(
      <GridraMinimap showViewport={false} viewport={{ x: 1, y: 1, width: 2, height: 2 }} />
    );
    expect(container.querySelector(".gridra-minimap__viewport")).toBeNull();
  });

  it("sanitizes NaN gridColumns and gridRows to safe defaults", () => {
    const { container } = render(
      <GridraMinimap gridColumns={NaN} gridRows={NaN} />
    );
    const style = (container.firstElementChild as HTMLElement).style;
    expect(style.getPropertyValue("--gridra-minimap-columns")).not.toBe("NaN");
    expect(style.getPropertyValue("--gridra-minimap-rows")).not.toBe("NaN");
  });

  it("sanitizes Infinity gridColumns and gridRows to safe defaults", () => {
    const { container } = render(
      <GridraMinimap gridColumns={Infinity} gridRows={Infinity} />
    );
    const style = (container.firstElementChild as HTMLElement).style;
    expect(style.getPropertyValue("--gridra-minimap-columns")).not.toBe("Infinity");
  });
});
