import { describe, expect, it } from "vitest";
import { getConnectionKey, hasConnection } from "./connectionUtils";

describe("connection utilities", () => {
  it("detects duplicate connections by source and target ids", () => {
    const connections = [{ sourceId: "a", targetId: "b" }];

    expect(hasConnection(connections, { sourceId: "a", targetId: "b" })).toBe(true);
    expect(hasConnection(connections, { sourceId: "b", targetId: "a" })).toBe(false);
  });

  it("formats stable connection keys", () => {
    expect(getConnectionKey({ sourceId: "source", targetId: "target" })).toBe("source->target");
  });
});
