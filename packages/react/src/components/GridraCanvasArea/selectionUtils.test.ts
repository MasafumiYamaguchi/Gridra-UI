import { describe, expect, it } from "vitest";
import { getSelectionMode, mergeSelectedIds } from "./selectionUtils";
import type { PointerEvent } from "react";

function makePointerEvent(overrides: Partial<PointerEvent<HTMLDivElement>>): PointerEvent<HTMLDivElement> {
  return {
    shiftKey: false,
    metaKey: false,
    ctrlKey: false,
    ...overrides,
  } as PointerEvent<HTMLDivElement>;
}

describe("getSelectionMode", () => {
  it("returns fallbackMode when no modifier keys match", () => {
    const event = makePointerEvent({});
    expect(getSelectionMode(event, "replace")).toBe("replace");
    expect(getSelectionMode(event, "additive")).toBe("additive");
    expect(getSelectionMode(event, "toggle")).toBe("toggle");
  });

  it("returns additive when shiftKey matches", () => {
    const event = makePointerEvent({ shiftKey: true });
    expect(
      getSelectionMode(event, "replace", { additive: "Shift" }),
    ).toBe("additive");
  });

  it("returns toggle when metaKey matches modifier set to Meta", () => {
    const event = makePointerEvent({ metaKey: true });
    expect(
      getSelectionMode(event, "replace", { toggle: "Meta" }),
    ).toBe("toggle");
  });

  it("returns toggle when ctrlKey matches modifier set to Control", () => {
    const event = makePointerEvent({ ctrlKey: true });
    expect(
      getSelectionMode(event, "replace", { toggle: "Control" }),
    ).toBe("toggle");
  });

  it("returns fallback when modifier key does not match the configured key", () => {
    const event = makePointerEvent({ shiftKey: true });
    expect(
      getSelectionMode(event, "replace", { additive: undefined }),
    ).toBe("replace");
  });
});

describe("mergeSelectedIds", () => {
  it("replace mode returns hit ids directly", () => {
    expect(mergeSelectedIds("replace", ["a", "b"], ["c"])).toEqual(["c"]);
    expect(mergeSelectedIds("replace", [], [])).toEqual([]);
  });

  it("additive mode unions current and hit ids with dedup", () => {
    expect(mergeSelectedIds("additive", ["a"], ["b"])).toEqual(["a", "b"]);
    expect(mergeSelectedIds("additive", ["a"], ["a", "b"])).toEqual(["a", "b"]);
  });

  it("toggle mode removes already-selected ids and adds unselected ones", () => {
    // a is selected → removed, c is not → added
    const result = mergeSelectedIds("toggle", ["a", "b"], ["a", "c"]);
    expect(result).toEqual(["b", "c"]);
  });

  it("toggle mode preserves order: existing first, then new", () => {
    const result = mergeSelectedIds("toggle", ["z", "y"], ["x", "z"]);
    expect(result).toEqual(["y", "x"]);
  });
});
