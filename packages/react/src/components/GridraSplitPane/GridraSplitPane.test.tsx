import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraSplitPane } from "./GridraSplitPane";

afterEach(() => {
  cleanup();
});

describe("GridraSplitPane", () => {
  it("renders default horizontal split with two panes", () => {
    render(
      <GridraSplitPane>
        <div>Left</div>
        <div>Right</div>
      </GridraSplitPane>,
    );

    const split = screen.getByText("Left").closest(".gridra-split-pane") as HTMLDivElement;
    expect(split.className).toContain("gridra-split-pane--horizontal");
    expect(split.getAttribute("style")).toContain("--gridra-split-pane-size: 50%");
    expect(screen.getByRole("separator")).toBeTruthy();
  });

  it("supports vertical orientation", () => {
    render(
      <GridraSplitPane orientation="vertical">
        <div>Top</div>
        <div>Bottom</div>
      </GridraSplitPane>,
    );

    const split = screen.getByText("Top").closest(".gridra-split-pane") as HTMLDivElement;
    const separator = screen.getByRole("separator");
    expect(split.className).toContain("gridra-split-pane--vertical");
    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
  });

  it("applies controlled size", () => {
    render(
      <GridraSplitPane size={64}>
        <div>A</div>
        <div>B</div>
      </GridraSplitPane>,
    );

    const split = screen.getByText("A").closest(".gridra-split-pane") as HTMLDivElement;
    expect(split.getAttribute("style")).toContain("--gridra-split-pane-size: 64%");
  });

  it("clamps size by min and max", () => {
    render(
      <GridraSplitPane defaultSize={2} maxSize={80} minSize={20}>
        <div>A</div>
        <div>B</div>
      </GridraSplitPane>,
    );

    const split = screen.getByText("A").closest(".gridra-split-pane") as HTMLDivElement;
    expect(split.getAttribute("style")).toContain("--gridra-split-pane-size: 20%");
  });

  it("updates size by drag and emits onSizeChange", () => {
    const handleSizeChange = vi.fn();
    render(
      <GridraSplitPane defaultSize={50} onSizeChange={handleSizeChange}>
        <div>A</div>
        <div>B</div>
      </GridraSplitPane>,
    );

    const split = screen.getByText("A").closest(".gridra-split-pane") as HTMLDivElement;
    const separator = screen.getByRole("separator") as HTMLDivElement;

    Object.defineProperty(split, "getBoundingClientRect", {
      value: () => ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        width: 200,
        height: 100,
        right: 200,
        bottom: 100,
        toJSON: () => ({}),
      }),
    });

    fireEvent.mouseDown(separator, { clientX: 120 });
    fireEvent.mouseMove(separator, { clientX: 140 });

    expect(handleSizeChange).toHaveBeenCalled();
    const style = split.getAttribute("style") ?? "";
    expect(style).toContain("--gridra-split-pane-size: 70%");
  });

  it("updates size with keyboard arrows and Home/End", () => {
    const handleSizeChange = vi.fn();
    render(
      <GridraSplitPane defaultSize={50} maxSize={90} minSize={10} onSizeChange={handleSizeChange}>
        <div>A</div>
        <div>B</div>
      </GridraSplitPane>,
    );

    const split = screen.getByText("A").closest(".gridra-split-pane") as HTMLDivElement;
    const separator = screen.getByRole("separator") as HTMLDivElement;

    fireEvent.keyDown(separator, { key: "ArrowRight" });
    expect(split.getAttribute("style")).toContain("--gridra-split-pane-size: 52%");

    fireEvent.keyDown(separator, { key: "Home" });
    expect(split.getAttribute("style")).toContain("--gridra-split-pane-size: 10%");

    fireEvent.keyDown(separator, { key: "End" });
    expect(split.getAttribute("style")).toContain("--gridra-split-pane-size: 90%");
    expect(handleSizeChange).toHaveBeenCalled();
  });
});
