import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraAvatar } from "./GridraAvatar";

afterEach(() => {
  cleanup();
});

describe("GridraAvatar", () => {
  it("renders image mode with alt text", () => {
    render(<GridraAvatar alt="User" src="/user.png" />);
    const img = screen.getByAltText("User");

    expect(img.tagName.toLowerCase()).toBe("img");
    expect(img.className).toContain("gridra-avatar__image");
  });

  it("renders fallback text when no src is provided", () => {
    render(<GridraAvatar fallback="JD" />);
    const root = document.querySelector(".gridra-avatar");
    const fallback = document.querySelector(".gridra-avatar__fallback");

    expect(root?.textContent).toBe("JD");
    expect(fallback).not.toBeNull();
  });

  it("applies size, shape, and monochrome classes", () => {
    render(<GridraAvatar fallback="A" monochrome shape="circle" size="lg" />);
    const root = document.querySelector(".gridra-avatar");

    expect(root?.className).toContain("gridra-avatar--circle");
    expect(root?.className).toContain("gridra-avatar--lg");
    expect(root?.className).toContain("gridra-avatar--monochrome");
  });

  it("does not add redundant role or aria-label in image mode (alt is on the img)", () => {
    render(<GridraAvatar alt="User" src="/user.png" />);
    const root = document.querySelector(".gridra-avatar");

    expect(root?.getAttribute("role")).toBeNull();
    expect(root?.getAttribute("aria-label")).toBeNull();
  });

  it("exposes an equivalent accessible name in fallback mode via alt", () => {
    render(<GridraAvatar alt="User" fallback="JD" />);
    const root = document.querySelector(".gridra-avatar");

    expect(root?.getAttribute("aria-label")).toBe("User");
    expect(root?.getAttribute("role")).toBe("img");
  });

  it("exposes an accessible name in fallback mode via fallback text", () => {
    render(<GridraAvatar fallback="JD" />);
    const root = document.querySelector(".gridra-avatar");

    expect(root?.getAttribute("aria-label")).toBe("JD");
    expect(root?.getAttribute("role")).toBe("img");
  });

  it("does not add role or aria-label when no accessible name is provided", () => {
    render(<GridraAvatar />);
    const root = document.querySelector(".gridra-avatar");

    expect(root?.getAttribute("role")).toBeNull();
    expect(root?.getAttribute("aria-label")).toBeNull();
  });

  it("hides the fallback text from the accessibility tree", () => {
    render(<GridraAvatar fallback="JD" />);
    const fallback = document.querySelector(".gridra-avatar__fallback");

    expect(fallback?.getAttribute("aria-hidden")).toBe("true");
  });
});
