import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useGridraCanvas, type GridraCanvasState } from "../index";

afterEach(cleanup);
const initial: GridraCanvasState = {
  nodes: [{ id: "a", placement: { column: 1, row: 1 } }],
  connections: [], selectedIds: [], selectedConnections: [],
};
function Fixture({ onChange, cancel = false, controlled = false }: {
  onChange: (next: GridraCanvasState, previous: GridraCanvasState) => void;
  cancel?: boolean; controlled?: boolean;
}) {
  const [local, setLocal] = useState(initial);
  const canvas = useGridraCanvas({ state: controlled ? initial : local, onStateChange: (next, previous) => {
    onChange(next, previous);
    if (!controlled) setLocal(next);
  } });
  return <section {...canvas.getContainerProps({ "aria-label": "Custom canvas" })}>
    <button {...canvas.getNodeProps("a", { onClick: event => { if (cancel) event.preventDefault(); } })}>Custom node</button>
  </section>;
}
describe("standalone headless Canvas", () => {
  it("selects caller-owned nodes without a styled overlay or theme CSS", () => {
    const onChange = vi.fn();
    const { container } = render(<Fixture onChange={onChange} />);
    const button = screen.getByRole("button", { name: "Custom node" });
    fireEvent.click(button);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(onChange.mock.calls[0][1]).toBe(initial);
    expect(container.querySelector("[class]")).toBeNull();
    expect(screen.getByLabelText("Custom canvas").style.display).toBe("grid");
  });

  it("emits controlled changes without mutating the input", () => {
    const onChange = vi.fn();
    render(<Fixture onChange={onChange} controlled />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(initial.selectedIds).toEqual([]);
    expect(onChange.mock.calls[0][0].selectedIds).toEqual(["a"]);
  });

  it("honors cancellation from a consumer handler", () => {
    const onChange = vi.fn();
    render(<Fixture onChange={onChange} cancel />);
    fireEvent.click(screen.getByRole("button"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
