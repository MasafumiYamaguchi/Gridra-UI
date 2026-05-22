import { describe, expect, it } from "vitest";
import { hitTestConnections, hitTestNodes } from "./hitTesting";
import type { GridraCanvasNode, GridraNodeConnection } from "./types";

describe("canvas hit testing helpers", () => {
  const nodes: GridraCanvasNode[] = [
    { id: "a", placement: { column: 1, row: 1 } },
    { id: "b", placement: { column: 3, row: 2 } },
  ];
  const connections: GridraNodeConnection[] = [
    { sourceId: "a", targetId: "b" },
    { sourceId: "a", targetId: "missing" },
  ];

  it("returns no nodes or connections for a zero-sized selection rectangle", () => {
    const canvas = createCanvas();

    expect(hitTestNodes(nodes, { x: 10, y: 10, width: 0, height: 0 }, canvas, 4, 2)).toEqual([]);
    expect(hitTestConnections(connections, nodes, { x: 10, y: 10, width: 0, height: 0 }, canvas, 4, 2)).toEqual([]);
  });

  it("finds nodes that partially intersect the selection rectangle", () => {
    const canvas = createCanvas();

    expect(hitTestNodes(nodes, { x: 195, y: 95, width: 30, height: 30 }, canvas, 4, 2)).toEqual(["b"]);
  });

  it("returns no hits when the selection rectangle misses all items", () => {
    const canvas = createCanvas();

    expect(hitTestNodes(nodes, { x: 360, y: 170, width: 20, height: 20 }, canvas, 4, 2)).toEqual([]);
    expect(hitTestConnections(connections, nodes, { x: 360, y: 170, width: 20, height: 20 }, canvas, 4, 2)).toEqual([]);
  });

  it("finds intersecting connections and skips missing endpoints", () => {
    const canvas = createCanvas();

    expect(hitTestConnections(connections, nodes, { x: 80, y: 40, width: 230, height: 120 }, canvas, 4, 2)).toEqual([
      { sourceId: "a", targetId: "b" },
    ]);
  });
});

function createCanvas() {
  const canvas = document.createElement("div");
  canvas.style.padding = "0px";
  canvas.style.gap = "0px";
  Object.defineProperty(canvas, "clientWidth", { configurable: true, value: 400 });
  Object.defineProperty(canvas, "clientHeight", { configurable: true, value: 200 });
  canvas.getBoundingClientRect = () => ({
    bottom: 200,
    height: 200,
    left: 0,
    right: 400,
    top: 0,
    width: 400,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  });
  return canvas;
}
