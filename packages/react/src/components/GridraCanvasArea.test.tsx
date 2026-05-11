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
