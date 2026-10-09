import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraGrid, GridraSelectableGrid } from "./index";

afterEach(() => {
  cleanup();
});

describe("GridraGrid (compatibility alias)", () => {
  it("exports the same component as GridraSelectableGrid", () => {
    expect(GridraGrid).toBe(GridraSelectableGrid);
    const { container } = render(<GridraGrid items={[]} />);
    const grid = container.querySelector(".gridra-grid");

    expect(grid).not.toBeNull();
  });

  it("preserves selectable grid behavior through the alias", () => {
    const { container } = render(
      <GridraGrid defaultSelectedId="a" items={[{ id: "a", label: "Alpha" }]} />,
    );

    const item = container.querySelector(".gridra-grid__item");

    expect(item?.getAttribute("aria-selected")).toBe("true");
  });
});
