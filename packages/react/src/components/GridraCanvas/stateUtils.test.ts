import { describe, expect, it } from "vitest";
import { canvasStatesEqual } from "./stateUtils";
import type { GridraCanvasState } from "./types";
const state: GridraCanvasState = { nodes: [], connections: [{ sourceId: "a", targetId: "b" }],
  selectedIds: ["a"], selectedConnections: [{ sourceId: "a", targetId: "b" }] };
describe("controlled canvas state comparisons", () => {
  it("recognizes equivalent selections and connections without requiring object identity", () => {
    expect(canvasStatesEqual(state, { ...state, selectedIds: ["a"], connections: [{ sourceId: "a", targetId: "b" }],
      selectedConnections: [{ sourceId: "a", targetId: "b" }] })).toBe(true);
  });
  it.each(["nodes", "selectedIds", "connections", "selectedConnections"] as const)("detects a change to %s", (key) => {
    const changes: GridraCanvasState = { nodes: [{ id: "a", placement: { column: 1, row: 1 } }],
      selectedIds: [], connections: [{ sourceId: "b", targetId: "a" }], selectedConnections: [] };
    expect(canvasStatesEqual(state, { ...state, [key]: changes[key] })).toBe(false);
  });
});
