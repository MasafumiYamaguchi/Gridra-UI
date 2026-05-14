import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraCanvasArea } from "./GridraCanvasArea";

afterEach(() => {
  cleanup();
});

describe("GridraCanvasArea", () => {
  it("maps grid counts to CSS grid variables", () => {
    const { container } = render(<GridraCanvasArea gridColumns={12} gridRows={8} />);
    const canvas = container.querySelector(".gridra-canvas-area");

    expect(canvas?.getAttribute("style")).toContain("--gridra-grid-columns: 12");
    expect(canvas?.getAttribute("style")).toContain("--gridra-grid-rows: 8");
  });

  it("places nodes by grid line and span", () => {
    render(
      <GridraCanvasArea
        nodes={[
          {
            id: "input",
            label: "Input",
            placement: { column: 2, row: 3, columnSpan: 4, rowSpan: 2 }
          }
        ]}
      />
    );

    const node = document.querySelector(".gridra-node");

    expect(node?.getAttribute("style")).toContain("grid-column: 2 / span 4");
    expect(node?.getAttribute("style")).toContain("grid-row: 3 / span 2");
  });

  it("renders default nodes as direct grid children", () => {
    const { container } = render(
      <GridraCanvasArea
        nodes={[
          {
            id: "input",
            label: "Input",
            placement: { column: 2, row: 3 }
          }
        ]}
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area");
    const node = canvas?.firstElementChild;

    expect(node?.classList.contains("gridra-node")).toBe(true);
    expect(node?.textContent).toBe("Input");
    expect(node?.firstElementChild?.classList.contains("gridra-node__label")).toBe(true);
  });

  it("does not render implementation comments as canvas content", () => {
    const { container } = render(<GridraCanvasArea />);
    const canvas = container.querySelector(".gridra-canvas-area");

    expect(canvas?.textContent).not.toContain("Canvas");
  });

  it("keeps out-of-range nodes inside the configured grid", () => {
    render(
      <GridraCanvasArea
        gridColumns={4}
        gridRows={4}
        nodes={[
          {
            id: "overflow",
            placement: { column: 8, row: 12, columnSpan: 3, rowSpan: 5 }
          }
        ]}
      />
    );

    const node = document.querySelector(".gridra-node");

    expect(node?.getAttribute("style")).toContain("grid-column: 4 / span 1");
    expect(node?.getAttribute("style")).toContain("grid-row: 4 / span 1");
  });

  it("selects nodes inside a dragged selection rectangle", () => {
    const selectedIdGroups: string[][] = [];
    const { container } = render(
      <GridraCanvasArea
        gridColumns={4}
        gridRows={4}
        nodes={[
          {
            id: "inside",
            placement: { column: 1, row: 1 }
          },
          {
            id: "outside",
            placement: { column: 4, row: 4 }
          }
        ]}
        onSelectionIdsChange={(selectedIds) => selectedIdGroups.push(selectedIds)}
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;

    setCanvasGeometry(canvas, { width: 400, height: 400 });

    firePointerEvent(canvas, "pointerdown", {
      button: 0,
      clientX: 0,
      clientY: 0,
      pointerId: 1
    });
    firePointerEvent(canvas, "pointermove", {
      clientX: 120,
      clientY: 120,
      pointerId: 1
    });
    firePointerEvent(canvas, "pointerup", {
      clientX: 120,
      clientY: 120,
      pointerId: 1
    });

    expect(selectedIdGroups).toEqual([["inside"]]);
  });

  it("adds range-selected nodes when selectionMode is additive", () => {
    const selectedIdGroups: string[][] = [];
    const { container } = render(
      <GridraCanvasArea
        defaultSelectedIds={["outside"]}
        gridColumns={4}
        gridRows={4}
        nodes={[
          {
            id: "inside",
            placement: { column: 1, row: 1 }
          },
          {
            id: "outside",
            placement: { column: 4, row: 4 }
          }
        ]}
        onSelectionIdsChange={(selectedIds) => selectedIdGroups.push(selectedIds)}
        selectionMode="additive"
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;

    setCanvasGeometry(canvas, { width: 400, height: 400 });

    firePointerEvent(canvas, "pointerdown", {
      button: 0,
      clientX: 0,
      clientY: 0,
      pointerId: 14
    });
    firePointerEvent(canvas, "pointermove", {
      clientX: 120,
      clientY: 120,
      pointerId: 14
    });
    firePointerEvent(canvas, "pointerup", {
      clientX: 120,
      clientY: 120,
      pointerId: 14
    });

    expect(selectedIdGroups.at(-1)).toEqual(["outside", "inside"]);
  });

  it("toggles range-selected nodes when selectionMode is toggle", () => {
    const selectedIdGroups: string[][] = [];
    const { container } = render(
      <GridraCanvasArea
        defaultSelectedIds={["inside", "outside"]}
        gridColumns={4}
        gridRows={4}
        nodes={[
          {
            id: "inside",
            placement: { column: 1, row: 1 }
          },
          {
            id: "outside",
            placement: { column: 4, row: 4 }
          }
        ]}
        onSelectionIdsChange={(selectedIds) => selectedIdGroups.push(selectedIds)}
        selectionMode="toggle"
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;

    setCanvasGeometry(canvas, { width: 400, height: 400 });

    firePointerEvent(canvas, "pointerdown", {
      button: 0,
      clientX: 0,
      clientY: 0,
      pointerId: 15
    });
    firePointerEvent(canvas, "pointermove", {
      clientX: 120,
      clientY: 120,
      pointerId: 15
    });
    firePointerEvent(canvas, "pointerup", {
      clientX: 120,
      clientY: 120,
      pointerId: 15
    });

    expect(selectedIdGroups.at(-1)).toEqual(["outside"]);
  });

  it("uses selection modifier keys for range selection mode", () => {
    const selectedIdGroups: string[][] = [];
    const { container } = render(
      <GridraCanvasArea
        defaultSelectedIds={["outside"]}
        gridColumns={4}
        gridRows={4}
        nodes={[
          {
            id: "inside",
            placement: { column: 1, row: 1 }
          },
          {
            id: "outside",
            placement: { column: 4, row: 4 }
          }
        ]}
        onSelectionIdsChange={(selectedIds) => selectedIdGroups.push(selectedIds)}
        selectionModifierKeys={{ additive: "Shift", toggle: "Meta" }}
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;

    setCanvasGeometry(canvas, { width: 400, height: 400 });

    firePointerEvent(canvas, "pointerdown", {
      button: 0,
      clientX: 0,
      clientY: 0,
      pointerId: 16
    });
    firePointerEvent(canvas, "pointermove", {
      clientX: 120,
      clientY: 120,
      pointerId: 16
    });
    firePointerEvent(canvas, "pointerup", {
      clientX: 120,
      clientY: 120,
      pointerId: 16,
      shiftKey: true
    });

    expect(selectedIdGroups.at(-1)).toEqual(["outside", "inside"]);
  });

  it("renders the active selection box while dragging", () => {
    const { container } = render(<GridraCanvasArea />);
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;

    setCanvasGeometry(canvas, { width: 400, height: 400 });

    firePointerEvent(canvas, "pointerdown", {
      button: 0,
      clientX: 10,
      clientY: 20,
      pointerId: 1
    });
    firePointerEvent(canvas, "pointermove", {
      clientX: 60,
      clientY: 90,
      pointerId: 1
    });

    const selectionBox = container.querySelector(".gridra-selection-box");

    expect(selectionBox?.getAttribute("style")).toContain("left: 10px");
    expect(selectionBox?.getAttribute("style")).toContain("top: 20px");
    expect(selectionBox?.getAttribute("style")).toContain("width: 50px");
    expect(selectionBox?.getAttribute("style")).toContain("height: 70px");
  });

  it("does not render node drag handles until dragging is enabled", () => {
    const { container } = render(
      <GridraCanvasArea
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          }
        ]}
        selectedId="input"
      />
    );

    expect(container.querySelector(".gridra-drag-handle")).toBeNull();
  });

  it("moves a selected node through its drag handle", () => {
    const movedPlacements: Array<{ column: number; row: number }> = [];
    const { container } = render(
      <GridraCanvasArea
        enableNodeDragging
        gridColumns={4}
        gridRows={4}
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          }
        ]}
        onNodeMove={(_, placement) => movedPlacements.push(placement)}
        selectedId="input"
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;

    setCanvasGeometry(canvas, { width: 400, height: 400 });

    const handle = container.querySelector(".gridra-drag-handle") as HTMLElement;

    firePointerEvent(handle, "pointerdown", {
      button: 0,
      clientX: 20,
      clientY: 20,
      pointerId: 2
    });
    firePointerEvent(canvas, "pointermove", {
      clientX: 130,
      clientY: 230,
      pointerId: 2
    });
    firePointerEvent(canvas, "pointerup", {
      clientX: 130,
      clientY: 230,
      pointerId: 2
    });

    const node = container.querySelector(".gridra-node");

    expect(node?.getAttribute("style")).toContain("grid-column: 2 / span 1");
    expect(node?.getAttribute("style")).toContain("grid-row: 3 / span 1");
    expect(movedPlacements.at(-1)).toMatchObject({ column: 2, row: 3 });
  });

  it("renders snap guides while dragging a selected node", () => {
    const { container } = render(
      <GridraCanvasArea
        enableNodeDragging
        gridColumns={4}
        gridRows={4}
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          }
        ]}
        selectedId="input"
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;

    setCanvasGeometry(canvas, { width: 400, height: 400 });

    const handle = container.querySelector(".gridra-drag-handle") as HTMLElement;

    firePointerEvent(handle, "pointerdown", {
      button: 0,
      clientX: 20,
      clientY: 20,
      pointerId: 12
    });
    firePointerEvent(canvas, "pointermove", {
      clientX: 130,
      clientY: 230,
      pointerId: 12
    });

    expect(container.querySelectorAll(".gridra-snap-guide")).toHaveLength(2);
    expect(canvas.classList.contains("gridra-canvas-area--snap-guides-visible")).toBe(true);
    expect(container.querySelector(".gridra-snap-guide--vertical")).not.toBeNull();
    expect(container.querySelector(".gridra-snap-guide--horizontal")).not.toBeNull();

    firePointerEvent(canvas, "pointerup", {
      clientX: 130,
      clientY: 230,
      pointerId: 12
    });

    expect(container.querySelector(".gridra-snap-guide")).toBeNull();
    expect(canvas.classList.contains("gridra-canvas-area--snap-guides-visible")).toBe(false);
  });

  it("does not render node resize handles until resizing is enabled", () => {
    const { container } = render(
      <GridraCanvasArea
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          }
        ]}
        selectedId="input"
      />
    );

    expect(container.querySelector(".gridra-resize-handle")).toBeNull();
  });

  it("resizes a selected node through its resize handle", () => {
    const resizedPlacements: Array<{ columnSpan?: number; rowSpan?: number }> = [];
    const { container } = render(
      <GridraCanvasArea
        enableNodeResizing
        gridColumns={4}
        gridRows={4}
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1, columnSpan: 1, rowSpan: 1 }
          }
        ]}
        onNodeResize={(_, placement) => resizedPlacements.push(placement)}
        selectedId="input"
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;

    setCanvasGeometry(canvas, { width: 400, height: 400 });

    const handle = container.querySelector(".gridra-resize-handle") as HTMLElement;

    firePointerEvent(handle, "pointerdown", {
      button: 0,
      clientX: 20,
      clientY: 20,
      pointerId: 3
    });
    firePointerEvent(canvas, "pointermove", {
      clientX: 230,
      clientY: 130,
      pointerId: 3
    });
    firePointerEvent(canvas, "pointerup", {
      clientX: 230,
      clientY: 130,
      pointerId: 3
    });

    const node = container.querySelector(".gridra-node");

    expect(node?.getAttribute("style")).toContain("grid-column: 1 / span 3");
    expect(node?.getAttribute("style")).toContain("grid-row: 1 / span 2");
    expect(resizedPlacements.at(-1)).toMatchObject({
      columnSpan: 3,
      rowSpan: 2
    });
  });

  it("renders snap guides while resizing a selected node", () => {
    const { container } = render(
      <GridraCanvasArea
        enableNodeResizing
        gridColumns={4}
        gridRows={4}
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1, columnSpan: 1, rowSpan: 1 }
          }
        ]}
        selectedId="input"
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;

    setCanvasGeometry(canvas, { width: 400, height: 400 });

    const handle = container.querySelector(".gridra-resize-handle") as HTMLElement;

    firePointerEvent(handle, "pointerdown", {
      button: 0,
      clientX: 20,
      clientY: 20,
      pointerId: 13
    });
    firePointerEvent(canvas, "pointermove", {
      clientX: 230,
      clientY: 130,
      pointerId: 13
    });

    expect(container.querySelectorAll(".gridra-snap-guide")).toHaveLength(2);
    expect(canvas.classList.contains("gridra-canvas-area--snap-guides-visible")).toBe(true);
    expect(container.querySelector(".gridra-snap-guide--vertical")).not.toBeNull();
    expect(container.querySelector(".gridra-snap-guide--horizontal")).not.toBeNull();

    firePointerEvent(canvas, "pointerup", {
      clientX: 230,
      clientY: 130,
      pointerId: 13
    });

    expect(container.querySelector(".gridra-snap-guide")).toBeNull();
    expect(canvas.classList.contains("gridra-canvas-area--snap-guides-visible")).toBe(false);
  });

  it("keeps resized node spans inside the configured grid", () => {
    const { container } = render(
      <GridraCanvasArea
        enableNodeResizing
        gridColumns={4}
        gridRows={4}
        nodes={[
          {
            id: "input",
            placement: { column: 3, row: 3, columnSpan: 1, rowSpan: 1 }
          }
        ]}
        selectedId="input"
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;

    setCanvasGeometry(canvas, { width: 400, height: 400 });

    const handle = container.querySelector(".gridra-resize-handle") as HTMLElement;

    firePointerEvent(handle, "pointerdown", {
      button: 0,
      clientX: 20,
      clientY: 20,
      pointerId: 4
    });
    firePointerEvent(canvas, "pointermove", {
      clientX: 520,
      clientY: 520,
      pointerId: 4
    });
    firePointerEvent(canvas, "pointerup", {
      clientX: 520,
      clientY: 520,
      pointerId: 4
    });

    const node = container.querySelector(".gridra-node");

    expect(node?.getAttribute("style")).toContain("grid-column: 3 / span 2");
    expect(node?.getAttribute("style")).toContain("grid-row: 3 / span 2");
  });

  it("does not render node connection handles until connecting is enabled", () => {
    const { container } = render(
      <GridraCanvasArea
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          }
        ]}
      />
    );

    expect(container.querySelector(".gridra-connection-handle")).toBeNull();
  });

  it("connects an output handle to another node input handle", () => {
    const connections: Array<{ sourceId: string; targetId: string }> = [];
    const startedIds: string[] = [];
    const { container } = render(
      <GridraCanvasArea
        enableNodeConnecting
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          },
          {
            id: "output",
            placement: { column: 2, row: 1 }
          }
        ]}
        onNodeConnect={(connection) => connections.push(connection)}
        onNodeConnectionStart={(sourceId) => startedIds.push(sourceId)}
      />
    );
    const inputOutputHandle = container.querySelector(
      '[data-gridra-connection-node-id="input"].gridra-connection-handle--output'
    ) as HTMLElement;
    const outputInputHandle = container.querySelector(
      '[data-gridra-connection-node-id="output"].gridra-connection-handle--input'
    ) as HTMLElement;

    firePointerEvent(inputOutputHandle, "pointerdown", {
      button: 0,
      clientX: 10,
      clientY: 10,
      pointerId: 5
    });
    firePointerEvent(outputInputHandle, "pointerup", {
      clientX: 80,
      clientY: 10,
      pointerId: 5
    });

    expect(startedIds).toEqual(["input"]);
    expect(connections).toEqual([{ sourceId: "input", targetId: "output" }]);
  });

  it("connects an input handle to another node output handle by normalizing direction", () => {
    const connections: Array<{ sourceId: string; targetId: string }> = [];
    const { container } = render(
      <GridraCanvasArea
        enableNodeConnecting
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          },
          {
            id: "output",
            placement: { column: 2, row: 1 }
          }
        ]}
        onNodeConnect={(connection) => connections.push(connection)}
      />
    );
    const outputInputHandle = container.querySelector(
      '[data-gridra-connection-node-id="output"].gridra-connection-handle--input'
    ) as HTMLElement;
    const inputOutputHandle = container.querySelector(
      '[data-gridra-connection-node-id="input"].gridra-connection-handle--output'
    ) as HTMLElement;

    firePointerEvent(outputInputHandle, "pointerdown", {
      button: 0,
      clientX: 80,
      clientY: 10,
      pointerId: 15
    });
    firePointerEvent(inputOutputHandle, "pointerup", {
      clientX: 10,
      clientY: 10,
      pointerId: 15
    });

    expect(connections).toEqual([{ sourceId: "input", targetId: "output" }]);
  });

  it("renders configured node connections as SVG paths", () => {
    const { container } = render(
      <GridraCanvasArea
        gridColumns={4}
        gridRows={4}
        nodeConnections={[{ sourceId: "input", targetId: "output" }]}
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          },
          {
            id: "output",
            placement: { column: 3, row: 2 }
          }
        ]}
      />
    );
    const layer = container.querySelector(".gridra-connection-layer");
    const line = container.querySelector(".gridra-connection-line");

    expect(layer?.getAttribute("viewBox")).toBe("0 0 4 4");
    expect(line?.getAttribute("data-gridra-connection-source-id")).toBe("input");
    expect(line?.getAttribute("data-gridra-connection-target-id")).toBe("output");
    expect(line?.getAttribute("d")).toContain("M 1 0.5");
  });

  it("highlights a node connection when its line is clicked", () => {
    const { container } = render(
      <GridraCanvasArea
        nodeConnections={[{ sourceId: "input", targetId: "output" }]}
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          },
          {
            id: "output",
            placement: { column: 2, row: 1 }
          }
        ]}
      />
    );
    const line = container.querySelector(".gridra-connection-line") as SVGPathElement;

    fireEvent.click(line);

    expect(line.classList.contains("gridra-connection-line--selected")).toBe(true);
  });

  it("clears a highlighted node connection when the canvas background is pressed", () => {
    const { container } = render(
      <GridraCanvasArea
        nodeConnections={[{ sourceId: "input", targetId: "output" }]}
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          },
          {
            id: "output",
            placement: { column: 2, row: 1 }
          }
        ]}
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;
    const line = container.querySelector(".gridra-connection-line") as SVGPathElement;

    fireEvent.click(line);
    firePointerEvent(canvas, "pointerdown", {
      button: 0,
      clientX: 0,
      clientY: 0,
      pointerId: 8
    });

    expect(line.classList.contains("gridra-connection-line--selected")).toBe(false);
  });

  it("clears a highlighted node connection when a node is selected", () => {
    const { container } = render(
      <GridraCanvasArea
        nodeConnections={[{ sourceId: "input", targetId: "output" }]}
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          },
          {
            id: "output",
            placement: { column: 2, row: 1 }
          }
        ]}
      />
    );
    const line = container.querySelector(".gridra-connection-line") as SVGPathElement;
    const node = container.querySelector(".gridra-node") as HTMLButtonElement;

    fireEvent.click(line);
    fireEvent.click(node);

    expect(line.classList.contains("gridra-connection-line--selected")).toBe(false);
  });

  it("range selects multiple node connections", () => {
    const { container } = render(
      <GridraCanvasArea
        gridColumns={4}
        gridRows={4}
        nodeConnections={[
          { sourceId: "input-a", targetId: "output-a" },
          { sourceId: "input-b", targetId: "output-b" }
        ]}
        nodes={[
          {
            id: "input-a",
            placement: { column: 1, row: 1 }
          },
          {
            id: "output-a",
            placement: { column: 3, row: 1 }
          },
          {
            id: "input-b",
            placement: { column: 1, row: 3 }
          },
          {
            id: "output-b",
            placement: { column: 3, row: 3 }
          }
        ]}
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;

    setCanvasGeometry(canvas, { width: 400, height: 400 });

    firePointerEvent(canvas, "pointerdown", {
      button: 0,
      clientX: 0,
      clientY: 0,
      pointerId: 9
    });
    firePointerEvent(canvas, "pointermove", {
      clientX: 400,
      clientY: 400,
      pointerId: 9
    });
    firePointerEvent(canvas, "pointerup", {
      clientX: 400,
      clientY: 400,
      pointerId: 9
    });

    expect(document.activeElement).toBe(canvas);
    expect(container.querySelectorAll(".gridra-connection-line--selected")).toHaveLength(2);
  });

  it("deletes a highlighted node connection with the Delete key", () => {
    const changedConnections: Array<Array<{ sourceId: string; targetId: string }>> = [];
    const deletedConnections: Array<{ sourceId: string; targetId: string }> = [];
    const { container } = render(
      <GridraCanvasArea
        defaultNodeConnections={[{ sourceId: "input", targetId: "output" }]}
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          },
          {
            id: "output",
            placement: { column: 2, row: 1 }
          }
        ]}
        onNodeConnectionDelete={(connection) => deletedConnections.push(connection)}
        onNodeConnectionsChange={(connections) => changedConnections.push(connections)}
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;
    const line = container.querySelector(".gridra-connection-line") as SVGPathElement;

    fireEvent.click(line);
    fireEvent.keyDown(canvas, { key: "Delete" });

    expect(container.querySelector(".gridra-connection-line")).toBeNull();
    expect(changedConnections.at(-1)).toEqual([]);
    expect(deletedConnections).toEqual([{ sourceId: "input", targetId: "output" }]);
  });

  it("deletes range-selected node connections with the Delete key", () => {
    const deletedConnections: Array<{ sourceId: string; targetId: string }> = [];
    const { container } = render(
      <GridraCanvasArea
        defaultNodeConnections={[
          { sourceId: "input-a", targetId: "output-a" },
          { sourceId: "input-b", targetId: "output-b" }
        ]}
        gridColumns={4}
        gridRows={4}
        nodes={[
          {
            id: "input-a",
            placement: { column: 1, row: 1 }
          },
          {
            id: "output-a",
            placement: { column: 3, row: 1 }
          },
          {
            id: "input-b",
            placement: { column: 1, row: 3 }
          },
          {
            id: "output-b",
            placement: { column: 3, row: 3 }
          }
        ]}
        onNodeConnectionDelete={(connection) => deletedConnections.push(connection)}
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;

    setCanvasGeometry(canvas, { width: 400, height: 400 });

    firePointerEvent(canvas, "pointerdown", {
      button: 0,
      clientX: 0,
      clientY: 0,
      pointerId: 10
    });
    firePointerEvent(canvas, "pointermove", {
      clientX: 400,
      clientY: 400,
      pointerId: 10
    });
    firePointerEvent(canvas, "pointerup", {
      clientX: 400,
      clientY: 400,
      pointerId: 10
    });
    fireEvent.keyDown(document.activeElement ?? canvas, { key: "Delete" });

    expect(container.querySelector(".gridra-connection-line")).toBeNull();
    expect(deletedConnections).toEqual([
      { sourceId: "input-a", targetId: "output-a" },
      { sourceId: "input-b", targetId: "output-b" }
    ]);
  });

  it("deletes a highlighted node connection with the Backspace key", () => {
    const { container } = render(
      <GridraCanvasArea
        defaultNodeConnections={[{ sourceId: "input", targetId: "output" }]}
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          },
          {
            id: "output",
            placement: { column: 2, row: 1 }
          }
        ]}
      />
    );
    const canvas = container.querySelector(".gridra-canvas-area") as HTMLDivElement;
    const line = container.querySelector(".gridra-connection-line") as SVGPathElement;

    fireEvent.click(line);
    fireEvent.keyDown(canvas, { key: "Backspace" });

    expect(container.querySelector(".gridra-connection-line")).toBeNull();
  });

  it("maps connection line width to a CSS variable", () => {
    const { container, rerender } = render(
      <GridraCanvasArea connectionLineWidth={4} />
    );
    const canvas = container.querySelector(".gridra-canvas-area");

    expect(canvas?.getAttribute("style")).toContain("--gridra-connection-line-width: 4px");

    rerender(<GridraCanvasArea connectionLineWidth="0.2rem" />);

    expect(canvas?.getAttribute("style")).toContain("--gridra-connection-line-width: 0.2rem");
  });

  it("stores a completed connection when connections are uncontrolled", () => {
    const { container } = render(
      <GridraCanvasArea
        enableNodeConnecting
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          },
          {
            id: "output",
            placement: { column: 2, row: 1 }
          }
        ]}
      />
    );
    const inputOutputHandle = container.querySelector(
      '[data-gridra-connection-node-id="input"].gridra-connection-handle--output'
    ) as HTMLElement;
    const outputInputHandle = container.querySelector(
      '[data-gridra-connection-node-id="output"].gridra-connection-handle--input'
    ) as HTMLElement;

    firePointerEvent(inputOutputHandle, "pointerdown", {
      button: 0,
      clientX: 10,
      clientY: 10,
      pointerId: 7
    });
    firePointerEvent(outputInputHandle, "pointerup", {
      clientX: 80,
      clientY: 10,
      pointerId: 7
    });

    const line = container.querySelector(".gridra-connection-line");

    expect(line?.getAttribute("data-gridra-connection-source-id")).toBe("input");
    expect(line?.getAttribute("data-gridra-connection-target-id")).toBe("output");
  });

  it("skips connection lines when either endpoint is missing", () => {
    const { container } = render(
      <GridraCanvasArea
        nodeConnections={[{ sourceId: "input", targetId: "missing" }]}
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          }
        ]}
      />
    );

    expect(container.querySelector(".gridra-connection-line")).toBeNull();
  });

  it("cancels a connection when it ends on the source node", () => {
    const canceledIds: string[] = [];
    const connections: Array<{ sourceId: string; targetId: string }> = [];
    const { container } = render(
      <GridraCanvasArea
        enableNodeConnecting
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          }
        ]}
        onNodeConnect={(connection) => connections.push(connection)}
        onNodeConnectionCancel={(sourceId) => canceledIds.push(sourceId)}
      />
    );
    const outputHandle = container.querySelector(
      '[data-gridra-connection-node-id="input"].gridra-connection-handle--output'
    ) as HTMLElement;
    const inputHandle = container.querySelector(
      '[data-gridra-connection-node-id="input"].gridra-connection-handle--input'
    ) as HTMLElement;

    firePointerEvent(outputHandle, "pointerdown", {
      button: 0,
      clientX: 10,
      clientY: 10,
      pointerId: 6
    });
    firePointerEvent(inputHandle, "pointerup", {
      clientX: 20,
      clientY: 10,
      pointerId: 6
    });

    expect(connections).toEqual([]);
    expect(canceledIds).toEqual(["input"]);
  });

  it("does not fire onNodeConnect for an already-existing connection", () => {
    const connections: Array<{ sourceId: string; targetId: string }> = [];
    const { container } = render(
      <GridraCanvasArea
        defaultNodeConnections={[{ sourceId: "input", targetId: "output" }]}
        enableNodeConnecting
        nodes={[
          {
            id: "input",
            placement: { column: 1, row: 1 }
          },
          {
            id: "output",
            placement: { column: 2, row: 1 }
          }
        ]}
        onNodeConnect={(connection) => connections.push(connection)}
      />
    );
    const inputOutputHandle = container.querySelector(
      '[data-gridra-connection-node-id="input"].gridra-connection-handle--output'
    ) as HTMLElement;
    const outputInputHandle = container.querySelector(
      '[data-gridra-connection-node-id="output"].gridra-connection-handle--input'
    ) as HTMLElement;

    firePointerEvent(inputOutputHandle, "pointerdown", {
      button: 0,
      clientX: 10,
      clientY: 10,
      pointerId: 17
    });
    firePointerEvent(outputInputHandle, "pointerup", {
      clientX: 80,
      clientY: 10,
      pointerId: 17
    });

    expect(connections).toEqual([]);
  });
});

function setCanvasGeometry(
  canvas: HTMLDivElement,
  size: { width: number; height: number },
) {
  Object.defineProperty(canvas, "clientWidth", {
    configurable: true,
    value: size.width,
  });
  Object.defineProperty(canvas, "clientHeight", {
    configurable: true,
    value: size.height,
  });
  canvas.getBoundingClientRect = () =>
    ({
      bottom: size.height,
      height: size.height,
      left: 0,
      right: size.width,
      top: 0,
      width: size.width,
      x: 0,
      y: 0,
      toJSON: () => undefined,
    }) as DOMRect;
}

function firePointerEvent(
  target: HTMLElement,
  type: "pointerdown" | "pointermove" | "pointerup",
  init: MouseEventInit & { pointerId: number },
) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    ...init,
  });

  Object.defineProperty(event, "pointerId", {
    configurable: true,
    value: init.pointerId,
  });

  fireEvent(target, event);
}
