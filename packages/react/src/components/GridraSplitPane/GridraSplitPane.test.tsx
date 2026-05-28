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

  it("ignores pointer movement before dragging starts", () => {
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

    fireEvent.mouseMove(separator, { clientX: 160 });

    expect(handleSizeChange).not.toHaveBeenCalled();
    expect(split.getAttribute("style")).toContain("--gridra-split-pane-size: 50%");
  });

  it("ignores drag math when the container has no measurable size", () => {
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
        width: 0,
        height: 100,
        right: 0,
        bottom: 100,
        toJSON: () => ({}),
      }),
    });

    fireEvent.mouseDown(separator, { clientX: 10 });
    fireEvent.mouseMove(separator, { clientX: 20 });

    expect(handleSizeChange).not.toHaveBeenCalled();
    expect(split.getAttribute("style")).toContain("--gridra-split-pane-size: 50%");
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

  it("renders three panes with two separators", () => {
    render(
      <GridraSplitPane defaultSizes={[20, 50, 30]}>
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </GridraSplitPane>,
    );

    const split = screen.getByText("A").closest(".gridra-split-pane") as HTMLDivElement;
    expect(split.className).toContain("gridra-split-pane--three");
    expect(screen.getAllByRole("separator")).toHaveLength(2);
    const style = split.getAttribute("style") ?? "";
    expect(style).toContain("--gridra-split-pane-size-a: 20%");
    expect(style).toContain("--gridra-split-pane-size-b: 50%");
    expect(style).toContain("--gridra-split-pane-size-c: 30%");
  });

  it("applies controlled sizes in three-pane mode", () => {
    render(
      <GridraSplitPane sizes={[25, 35, 40]}>
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </GridraSplitPane>,
    );
    const split = screen.getByText("A").closest(".gridra-split-pane") as HTMLDivElement;
    const style = split.getAttribute("style") ?? "";
    expect(style).toContain("--gridra-split-pane-size-a: 25%");
    expect(style).toContain("--gridra-split-pane-size-b: 35%");
    expect(style).toContain("--gridra-split-pane-size-c: 40%");
  });

  it("updates adjacent panes through first separator drag in three-pane mode", () => {
    const handleSizesChange = vi.fn();
    render(
      <GridraSplitPane defaultSizes={[30, 40, 30]} onSizesChange={handleSizesChange}>
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </GridraSplitPane>,
    );

    const split = screen.getByText("A").closest(".gridra-split-pane") as HTMLDivElement;
    const firstSeparator = screen.getAllByRole("separator")[0] as HTMLDivElement;
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

    fireEvent.mouseDown(firstSeparator, { clientX: 80 });
    fireEvent.mouseMove(firstSeparator, { clientX: 100 });

    expect(handleSizesChange).toHaveBeenCalled();
    const style = split.getAttribute("style") ?? "";
    expect(style).toContain("--gridra-split-pane-size-a: 50%");
    expect(style).toContain("--gridra-split-pane-size-b: 20%");
    expect(style).toContain("--gridra-split-pane-size-c: 30%");
  });

  it("sanitizes NaN minSize and maxSize to safe defaults", () => {
    const { container } = render(
      <GridraSplitPane minSize={NaN} maxSize={NaN} defaultSize={NaN}>
        <div>A</div>
        <div>B</div>
      </GridraSplitPane>
    );
    const style = (container.firstElementChild as HTMLElement).style;
    expect(style.getPropertyValue("--gridra-split-pane-size")).not.toBe("NaN%");
  });

  it("sanitizes Infinity minSize and defaultSize", () => {
    const { container } = render(
      <GridraSplitPane minSize={Infinity} defaultSize={Infinity}>
        <div>A</div>
        <div>B</div>
      </GridraSplitPane>
    );
    const style = (container.firstElementChild as HTMLElement).style;
    expect(style.getPropertyValue("--gridra-split-pane-size")).not.toBe("Infinity%");
  });
});
