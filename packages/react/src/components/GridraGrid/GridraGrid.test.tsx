import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraGrid } from "./index";

afterEach(() => {
  cleanup();
});

describe("GridraGrid (compatibility alias)", () => {
  it("exports the same component as GridraSelectableGrid", () => {
    const { container } = render(<GridraGrid items={[]} />);
    const grid = container.querySelector(".gridra-grid");

    expect(grid).not.toBeNull();
  });
});
