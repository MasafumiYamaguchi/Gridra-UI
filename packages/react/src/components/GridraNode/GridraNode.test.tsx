import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { MouseEvent } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraNode } from "./GridraNode";

afterEach(() => {
  cleanup();
});

describe("GridraNode", () => {
  it("renders children, slots, selection state, and normalized grid placement", () => {
    render(
      <GridraNode
        aria-label="Node A"
        className="custom-node"
        connectionHandles={<span data-testid="connection-slot" />}
        dragHandle={<span data-testid="drag-slot" />}
        id="node-a"
        placement={{ column: 2.8, row: 3.4, columnSpan: 2.2, rowSpan: 1.7 }}
        resizeHandle={<span data-testid="resize-slot" />}
        selected
        style={{ backgroundColor: "red" }}
      >
        Node title
      </GridraNode>
    );
    const node = screen.getByRole("button", { name: "Node A" });

    expect(node.className).toContain("gridra-node");
    expect(node.className).toContain("custom-node");
    expect(node.getAttribute("aria-selected")).toBe("true");
    expect(node.getAttribute("style")).toContain("grid-column: 2 / span 2");
    expect(node.getAttribute("style")).toContain("grid-row: 3 / span 1");
    expect(node.getAttribute("style")).toContain("background-color: red");
    expect(screen.getByText("Node title").className).toContain("gridra-node__label");
    expect(screen.getByTestId("connection-slot")).toBeTruthy();
    expect(screen.getByTestId("drag-slot")).toBeTruthy();
    expect(screen.getByTestId("resize-slot")).toBeTruthy();
  });

  it("falls back to the id label and clamps invalid placement values", () => {
    render(
      <GridraNode
        id="node-b"
        placement={{ column: Number.NaN, row: -2, columnSpan: 0, rowSpan: Number.POSITIVE_INFINITY }}
      />
    );
    const node = screen.getByRole("button", { name: "node-b" });

    expect(node.getAttribute("aria-selected")).toBe("false");
    expect(node.getAttribute("style")).toContain("grid-column: 1 / span 1");
    expect(node.getAttribute("style")).toContain("grid-row: 1 / span 1");
  });

  it("reports selection unless the click is prevented", () => {
    const onSelect = vi.fn();
    const onClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    });

    const { rerender } = render(
      <GridraNode id="node-c" onSelect={onSelect} placement={{ column: 1, row: 1 }}>
        Selectable
      </GridraNode>
    );

    fireEvent.click(screen.getByRole("button", { name: "Selectable" }));
    expect(onSelect).toHaveBeenCalledWith("node-c");

    rerender(
      <GridraNode id="node-c" onClick={onClick} onSelect={onSelect} placement={{ column: 1, row: 1 }}>
        Selectable
      </GridraNode>
    );

    fireEvent.click(screen.getByRole("button", { name: "Selectable" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
