import { expect, it } from "vitest";
import { getGridraMinimap } from "./getGridraMinimap";

it("normalizes grid and placements without mutation", () => {
  const nodes = [
    { id: "one", placement: { column: 3, row: 2, columnSpan: 20 } },
  ];
  const map = getGridraMinimap({
    gridColumns: 4,
    gridRows: 4,
    nodes,
    selectedIds: ["one"],
  });

  expect(map.nodes[0]).toMatchObject({
    selected: true,
    rect: { left: 50, top: 25, width: 50, height: 25 },
  });
  expect(nodes[0].placement.columnSpan).toBe(20);
});

it("handles invalid dimensions and clips viewport values", () => {
  const map = getGridraMinimap({
    gridColumns: NaN,
    gridRows: 0,
    viewport: { x: -1, y: 2, width: 100, height: 0 },
  });

  expect(map.safeColumns).toBe(12);
  expect(map.safeRows).toBe(1);
  expect(map.viewport).toEqual({ left: 0, top: 100, width: 100, height: 0 });
});
