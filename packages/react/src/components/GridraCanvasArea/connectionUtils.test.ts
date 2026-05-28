import { describe, expect, it } from "vitest";
import type { GridraNodeConnection } from "./types";
import { createNodeConnection, getConnectionKey, hasConnection } from "./connectionUtils";

describe("connection utilities", () => {
  it("detects duplicate connections by exact source and target ids", () => {
    const connections = [{ sourceId: "a", targetId: "b" }];

    expect(hasConnection(connections, { sourceId: "a", targetId: "b" })).toBe(true);
    expect(hasConnection(connections, { sourceId: "b", targetId: "a" })).toBe(false);
  });

  it("formats stable connection keys", () => {
    expect(getConnectionKey({ sourceId: "source", targetId: "target" })).toBe("source->target");
  });
});

describe("createNodeConnection", () => {
  it("rejects self-connections", () => {
    expect(createNodeConnection("a", "output", "a", "input")).toBeNull();
  });

  it("rejects same-kind connections (output→output / input→input)", () => {
    expect(createNodeConnection("a", "output", "b", "output")).toBeNull();
    expect(createNodeConnection("a", "input", "b", "input")).toBeNull();
  });

  it("normalizes output→input as source→target", () => {
    const conn: GridraNodeConnection | null = createNodeConnection("a", "output", "b", "input");
    expect(conn).toEqual({ sourceId: "a", targetId: "b" });
  });

  it("normalizes input→output by flipping to source→target", () => {
    const conn: GridraNodeConnection | null = createNodeConnection("a", "input", "b", "output");
    expect(conn).toEqual({ sourceId: "b", targetId: "a" });
  });
});
