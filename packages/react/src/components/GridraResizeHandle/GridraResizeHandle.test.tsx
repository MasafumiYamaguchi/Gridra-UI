import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraResizeHandle } from "./GridraResizeHandle";
import { GridraNode } from "../GridraNode";

afterEach(() => {
  cleanup();
});

describe("GridraResizeHandle", () => {
  it("renders a decorative corner handle at the default position", () => {
    const { container } = render(<GridraResizeHandle />);
    const handle = container.querySelector(".gridra-resize-handle");

    expect(handle?.classList.contains("gridra-resize-handle--bottom-right")).toBe(true);
    expect(handle?.getAttribute("aria-hidden")).toBe("true");
    expect(handle?.querySelector(".gridra-resize-handle__corner")).not.toBeNull();
  });

  it("supports explicit resize handle positions", () => {
    const positions = ["right", "bottom", "inline"] as const;

    for (const position of positions) {
      const { container, unmount } = render(<GridraResizeHandle position={position} />);
      const handle = container.querySelector(".gridra-resize-handle");

      expect(handle?.classList.contains(`gridra-resize-handle--${position}`)).toBe(true);

      unmount();
    }
  });

  it("renders custom children as visible handle content", () => {
    render(<GridraResizeHandle position="inline">Resize</GridraResizeHandle>);

    const handle = screen.getByText("Resize");

    expect(handle.getAttribute("aria-hidden")).toBeNull();
    expect(handle.className).toContain("gridra-resize-handle--inline");
  });

  it("forwards pointer events to the handle element", () => {
    const onPointerDown = vi.fn();
    const { container } = render(<GridraResizeHandle onPointerDown={onPointerDown} />);
    const handle = container.querySelector(".gridra-resize-handle") as HTMLElement;

    fireEvent.pointerDown(handle);

    expect(onPointerDown).toHaveBeenCalledTimes(1);
  });

  it("can be inserted into a node handle slot", () => {
    const { container } = render(
      <GridraNode
        id="demo"
        placement={{ column: 1, row: 1 }}
        resizeHandle={<GridraResizeHandle />}
      />
    );
    const node = container.querySelector(".gridra-node");

    expect(node?.lastElementChild?.classList.contains("gridra-resize-handle")).toBe(true);
    expect(node?.querySelector(".gridra-node__label")?.textContent).toBe("demo");
  });
});
