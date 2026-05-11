import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraDragHandle } from "../../components/GridraDragHandle";
import { GridraNode } from "../../components/GridraNode";

afterEach(() => {
  cleanup();
});

describe("GridraDragHandle", () => {
  it("renders a decorative grip at the default node corner", () => {
    const { container } = render(<GridraDragHandle />);
    const handle = container.querySelector(".gridra-drag-handle");

    expect(handle?.classList.contains("gridra-drag-handle--top-left")).toBe(true);
    expect(handle?.getAttribute("aria-hidden")).toBe("true");
    expect(handle?.querySelector(".gridra-drag-handle__grip")).not.toBeNull();
  });

  it("supports explicit position and pointer events", () => {
    const onPointerDown = vi.fn();
    const { container } = render(
      <GridraDragHandle onPointerDown={onPointerDown} position="bottom-right" />
    );
    const handle = container.querySelector(".gridra-drag-handle") as HTMLElement;

    fireEvent.pointerDown(handle);

    expect(handle.classList.contains("gridra-drag-handle--bottom-right")).toBe(true);
    expect(onPointerDown).toHaveBeenCalledTimes(1);
  });

  it("renders custom children as visible handle content", () => {
    render(<GridraDragHandle position="inline">Move</GridraDragHandle>);

    const handle = screen.getByText("Move");

    expect(handle.getAttribute("aria-hidden")).toBeNull();
    expect(handle.className).toContain("gridra-drag-handle--inline");
  });

  it("can be inserted into a node handle slot", () => {
    const { container } = render(
      <GridraNode
        dragHandle={<GridraDragHandle position="top-right" />}
        id="demo"
        placement={{ column: 1, row: 1 }}
      />
    );
    const node = container.querySelector(".gridra-node");

    expect(node?.firstElementChild?.classList.contains("gridra-drag-handle")).toBe(true);
    expect(node?.querySelector(".gridra-node__label")?.textContent).toBe("demo");
  });
});
