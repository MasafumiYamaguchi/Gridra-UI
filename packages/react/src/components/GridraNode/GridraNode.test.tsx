import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraNode } from "./GridraNode";
afterEach(cleanup);
describe("GridraNode", () => {
  it("renders standalone with ordinary button props, style, ref and slots", () => {
    const ref = createRef<HTMLButtonElement>();
    const click = vi.fn();
    render(<GridraNode ref={ref} aria-pressed className="custom" onClick={click}
      style={{ gridColumn: "2 / span 3" }} dragHandle={<span>Drag</span>}
      resizeHandle={<span>Resize</span>} connectionHandles={<span>Connect</span>}>Title</GridraNode>);
    const button = screen.getByRole("button");
    expect(ref.current).toBe(button);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.style.gridColumn).toBe("2 / span 3");
    expect(button.className).toContain("custom");
    expect(button.textContent).toBe("DragTitleConnectResize");
    expect(button.getAttribute("type")).toBe("button");
    fireEvent.click(button);
    expect(click).toHaveBeenCalledOnce();
  });
  it("passes through standard id, disabled and type attributes", () => {
    const click = vi.fn();
    render(<GridraNode id="standalone" disabled type="submit" onClick={click}>Submit</GridraNode>);
    const button = screen.getByRole("button");
    expect(button.id).toBe("standalone");
    expect(button.getAttribute("type")).toBe("submit");
    fireEvent.click(button);
    expect(click).not.toHaveBeenCalled();
  });
});
