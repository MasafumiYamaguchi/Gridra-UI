import { createElement, createRef } from "react";
import { describe, expect, it } from "vitest";
import { getChildRef } from "./getChildRef";

describe("getChildRef", () => {
  it("returns the ref passed to the child element", () => {
    const ref = createRef<HTMLButtonElement>();

    expect(getChildRef(createElement("button", { ref }))).toBe(ref);
  });

  it("returns no ref when the child has none", () => {
    // Reactのバージョンによりnullまたはundefinedになるため、refが無いことだけを確認する。
    expect(getChildRef(createElement("button"))).toBeFalsy();
  });
});
