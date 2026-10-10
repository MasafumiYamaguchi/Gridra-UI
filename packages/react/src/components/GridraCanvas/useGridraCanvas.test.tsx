import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef, useState, type HTMLAttributes, type ButtonHTMLAttributes, type Ref } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useGridraCanvas } from "./useGridraCanvas";
import { GridraCanvasOverlay } from "./GridraCanvasOverlay";
import type { GridraCanvasState, GridraCanvasNode, UseGridraCanvasOptions } from "./types";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const initial: GridraCanvasState<GridraCanvasNode & { data?: string }> = {
  nodes: [
    { id: "a", label: "A", data: "retained", placement: { column: 1, row: 1 } },
    { id: "b", label: "B", placement: { column: 4, row: 4 } },
  ], connections: [], selectedIds: [], selectedConnections: [],
};
type State = typeof initial;
type Options = UseGridraCanvasOptions<State["nodes"][number]>;
function Fixture({ state: external, initialState = initial, onChange, interactions,
  containerProps, nodeProps, dragProps, grid = { columns: 4, rows: 4 }, name = "canvas", autoEnable = true, containerKey = "same" }: {
  autoEnable?: boolean; containerKey?: string; state?: State; initialState?: State; onChange?: Options["onStateChange"];
  interactions?: Options["interactions"]; grid?: Options["grid"]; name?: string;
  containerProps?: HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> };
  nodeProps?: ButtonHTMLAttributes<HTMLButtonElement>;
  dragProps?: HTMLAttributes<HTMLElement>;
}) {
  const [local, setLocal] = useState(initialState);
  const state = external ?? local;
  const canvas = useGridraCanvas({ state, grid, interactions: autoEnable ? {
    dragging: true, resizing: true, connecting: true, ...interactions,
  } : interactions, onStateChange: (next, previous) => { onChange?.(next, previous); if (!external) setLocal(next); } });
  return <section key={containerKey} {...canvas.getContainerProps({ ...containerProps, "aria-label": name })}>
    {canvas.nodes.map((node) => <button key={node.id} {...canvas.getNodeProps(node.id, nodeProps)}>
      {node.label}
      <span data-testid={`${name}-drag-${node.id}`} {...canvas.getDragHandleProps(node.id, dragProps)}>Drag</span>
      <span data-testid={`${name}-resize-${node.id}`} {...canvas.getResizeHandleProps(node.id)}>Resize</span>
      <span data-testid={`${name}-input-${node.id}`} {...canvas.getConnectionHandleProps(node.id, "input")}>Input</span>
      <span data-testid={`${name}-output-${node.id}`} {...canvas.getConnectionHandleProps(node.id, "output")}>Output</span>
    </button>)}
    <GridraCanvasOverlay {...canvas.overlayProps} />
  </section>;
}
function canvas(name = "canvas") { return screen.getByLabelText(name); }
function node(id: string, root = canvas()) { return root.querySelector(`[data-gridra-node-id="${id}"]`) as HTMLButtonElement; }
function size(element: HTMLElement, width = 400, height = 400) {
  Object.defineProperties(element, {
    clientWidth: { configurable: true, value: width }, clientHeight: { configurable: true, value: height },
    getBoundingClientRect: { configurable: true, value: () => ({ left: 0, top: 0, width, height, right: width, bottom: height }) },
  });
  act(() => { window.dispatchEvent(new Event("resize")); });
}
function pointer(element: Element, type: string, values: Record<string, unknown> = {}) {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.entries({ button: 0, pointerId: 1, clientX: 0, clientY: 0, ...values })
    .forEach(([key, value]) => Object.defineProperty(event, key, { value }));
  fireEvent(element, event);
}
function range(values: Record<string, unknown> = {}) {
  pointer(canvas(), "pointerdown", values);
  pointer(canvas(), "pointermove", { clientX: 120, clientY: 120, ...values });
  pointer(canvas(), "pointerup", { clientX: 120, clientY: 120, ...values });
}
function connect(source = "a", target = "b", from = "output", to = "input", name = "canvas") {
  pointer(screen.getByTestId(`${name}-${from}-${source}`), "pointerdown");
  pointer(screen.getByTestId(`${name}-${to}-${target}`), "pointerup");
}

describe("useGridraCanvas", () => {
  it("uses an ordinary section and buttons with no library class or provider", () => {
    render(<Fixture />);
    expect(canvas().tagName).toBe("SECTION");
    expect(canvas().className).toBe("");
    expect(canvas().style.gridTemplateColumns).toBe("repeat(4, minmax(0, 1fr))");
    expect(node("b").style.gridColumn).toBe("4 / span 1");
    fireEvent.click(node("a"));
    expect(node("a").getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(node("a"));
    expect(node("a").getAttribute("aria-pressed")).toBe("false");
  });
  it("defaults to 12 columns and 6 rows and clamps invalid placement", () => {
    render(<Fixture grid={{}} initialState={{ ...initial, nodes: [{ id: "a", placement: { column: 99, row: -5, columnSpan: 9 } }] }} />);
    expect(canvas().style.gridTemplateColumns).toBe("repeat(12, minmax(0, 1fr))");
    expect(canvas().style.gridTemplateRows).toBe("repeat(6, minmax(0, 1fr))");
    expect(node("a").style.gridColumn).toBe("12 / span 1");
    expect(node("a").style.gridRow).toBe("1 / span 1");
  });
  it("only notifies in controlled mode and accepts external restoration", () => {
    const onChange = vi.fn();
    const { rerender } = render(<Fixture state={initial} onChange={onChange} />);
    fireEvent.click(node("a"));
    const [next, previous] = onChange.mock.calls[0];
    expect(previous).toBe(initial);
    expect(next.selectedIds).toEqual(["a"]);
    expect(initial.selectedIds).toEqual([]);
    expect(node("a").getAttribute("aria-pressed")).toBe("false");
    rerender(<Fixture state={next} onChange={onChange} />);
    expect(node("a").getAttribute("aria-pressed")).toBe("true");
    rerender(<Fixture state={initial} onChange={onChange} />);
    expect(node("a").getAttribute("aria-pressed")).toBe("false");
  });
  it("composes refs, styles and user click handlers", () => {
    const ref = createRef<HTMLElement>(); const click = vi.fn();
    render(<Fixture containerProps={{ ref, style: { gap: 10, padding: 20 } }} nodeProps={{ onClick: click }} />);
    expect(ref.current).toBe(canvas()); expect(canvas().style.gap).toBe("10px");
    fireEvent.click(node("a")); expect(click).toHaveBeenCalledOnce();
    expect(node("a").getAttribute("aria-pressed")).toBe("true");
  });
  it("respects prevented clicks and disabled buttons", () => {
    const onChange = vi.fn();
    const { rerender } = render(<Fixture onChange={onChange} nodeProps={{ onClick: (event) => event.preventDefault() }} />);
    fireEvent.click(node("a")); expect(onChange).not.toHaveBeenCalled();
    rerender(<Fixture onChange={onChange} nodeProps={{ disabled: true }} />);
    fireEvent.click(node("a")); expect(onChange).not.toHaveBeenCalled();
  });
  it("range-selects nodes and renders a transient rectangle", () => {
    render(<Fixture />); size(canvas());
    pointer(canvas(), "pointerdown"); pointer(canvas(), "pointermove", { clientX: 120, clientY: 120 });
    expect(canvas().querySelector(".gridra-selection-box")).not.toBeNull();
    pointer(canvas(), "pointerup", { clientX: 120, clientY: 120 });
    expect(node("a").getAttribute("aria-pressed")).toBe("true");
    expect(node("b").getAttribute("aria-pressed")).toBe("false");
    expect(canvas().querySelector(".gridra-selection-box")).toBeNull();
  });
  it.each(["additive", "toggle"] as const)("supports %s range selection", (selectionMode) => {
    render(<Fixture initialState={{ ...initial, selectedIds: ["b"] }} interactions={{ selectionMode }} />);
    size(canvas()); range();
    expect(node("a").getAttribute("aria-pressed")).toBe("true");
    expect(node("b").getAttribute("aria-pressed")).toBe("true");
    if (selectionMode === "toggle") { range(); expect(node("a").getAttribute("aria-pressed")).toBe("false"); }
  });
  it("supports Shift and Control selection modifiers", () => {
    render(<Fixture initialState={{ ...initial, selectedIds: ["b"] }}
      interactions={{ selectionModifierKeys: { additive: "Shift", toggle: "Control" } }} />);
    size(canvas()); range({ shiftKey: true });
    expect(node("a").getAttribute("aria-pressed")).toBe("true");
    expect(node("b").getAttribute("aria-pressed")).toBe("true");
    range({ ctrlKey: true }); expect(node("a").getAttribute("aria-pressed")).toBe("false");
  });
  it("ignores secondary buttons, child pointerdowns and mismatched pointers", () => {
    const onChange = vi.fn(); render(<Fixture onChange={onChange} />); size(canvas());
    range({ button: 2 }); expect(onChange).not.toHaveBeenCalled();
    pointer(node("a"), "pointerdown"); pointer(canvas(), "pointerup", { clientX: 120, clientY: 120 });
    expect(onChange).not.toHaveBeenCalled();
    pointer(canvas(), "pointerdown"); pointer(canvas(), "pointerup", { pointerId: 2, clientX: 120, clientY: 120 });
    expect(node("a").getAttribute("aria-pressed")).toBe("false");
    pointer(canvas(), "pointercancel");
    expect(canvas().querySelector(".gridra-selection-box")).toBeNull();
  });
  it.each(["drag", "resize"])("updates %s placement and retains node data", (kind) => {
    const onChange = vi.fn(); render(<Fixture onChange={onChange} />); size(canvas());
    pointer(screen.getByTestId(`canvas-${kind}-a`), "pointerdown");
    pointer(canvas(), "pointermove", { clientX: 100, clientY: 100 });
    const latest = onChange.mock.calls.at(-1)![0];
    expect(latest.nodes[0].data).toBe("retained");
    expect(initial.nodes[0].placement).toEqual({ column: 1, row: 1 });
    expect(kind === "drag" ? node("a").style.gridColumn : node("a").style.gridRow)
      .toBe(kind === "drag" ? "2 / span 1" : "1 / span 2");
    expect(canvas().querySelector(".gridra-snap-guide")).not.toBeNull();
    pointer(canvas(), "pointerup", { clientX: 100, clientY: 100 });
    expect(canvas().querySelector(".gridra-snap-guide")).toBeNull();
  });
  it("clamps dragged spans to grid boundaries", () => {
    render(<Fixture initialState={{ ...initial, nodes: [{ id: "a", placement: { column: 1, row: 1, columnSpan: 2, rowSpan: 2 } }] }} />);
    size(canvas()); pointer(screen.getByTestId("canvas-drag-a"), "pointerdown");
    pointer(canvas(), "pointerup", { clientX: 900, clientY: 900 });
    expect(node("a").style.gridColumn).toBe("3 / span 2");
    expect(node("a").style.gridRow).toBe("3 / span 2");
  });
  it("does not optimistically move a controlled node", () => {
    const onChange = vi.fn(); render(<Fixture state={initial} onChange={onChange} />); size(canvas());
    pointer(screen.getByTestId("canvas-drag-a"), "pointerdown");
    pointer(canvas(), "pointerup", { clientX: 100, clientY: 100 });
    expect(onChange.mock.calls.at(-1)![0].nodes[0].placement.column).toBe(2);
    expect(node("a").style.gridColumn).toBe("1 / span 1");
  });
  it("honors disabled operations and prevented pointer handlers", () => {
    const onChange = vi.fn(); const { rerender } = render(<Fixture onChange={onChange}
      interactions={{ dragging: false, resizing: false, connecting: false, rangeSelection: false }} />);
    size(canvas()); pointer(screen.getByTestId("canvas-drag-a"), "pointerdown"); range(); connect();
    expect(onChange).not.toHaveBeenCalled();
    rerender(<Fixture onChange={onChange} dragProps={{ onPointerDown: (event) => event.preventDefault() }}
      containerProps={{ onPointerDown: (event) => event.preventDefault() }} />);
    pointer(screen.getByTestId("canvas-drag-a"), "pointerdown"); range();
    expect(onChange).not.toHaveBeenCalled();
  });
  it.each(["pointercancel", "lostpointercapture"])("clears operations on %s", (event) => {
    const onChange = vi.fn(); render(<Fixture onChange={onChange} />); size(canvas());
    pointer(screen.getByTestId("canvas-drag-a"), "pointerdown"); pointer(canvas(), event);
    onChange.mockClear(); pointer(canvas(), "pointermove", { clientX: 100, clientY: 100 });
    expect(onChange).not.toHaveBeenCalled(); expect(canvas().querySelector(".gridra-snap-guide")).toBeNull();
  });
  it("releases pointer capture on unmount and node removal", () => {
    const { rerender, unmount } = render(<Fixture state={initial} />); size(canvas());
    const release = vi.fn(); Object.assign(canvas(), { setPointerCapture: vi.fn(), hasPointerCapture: () => true, releasePointerCapture: release });
    pointer(screen.getByTestId("canvas-drag-a"), "pointerdown");
    rerender(<Fixture state={{ ...initial, nodes: [] }} />);
    expect(release).toHaveBeenCalledWith(1);
    rerender(<Fixture state={initial} />);
    pointer(screen.getByTestId("canvas-drag-a"), "pointerdown"); unmount();
    expect(release).toHaveBeenCalledTimes(2);
  });
  it("creates a connection from either direction and rejects duplicates", () => {
    const onChange = vi.fn(); render(<Fixture onChange={onChange} />); size(canvas());
    connect(); expect(onChange.mock.calls.at(-1)![0].connections).toEqual([{ sourceId: "a", targetId: "b" }]);
    connect("b", "a", "input", "output");
    expect(onChange.mock.calls.filter(([next, previous]) => next.connections !== previous.connections)).toHaveLength(1);
    expect(canvas().querySelectorAll(".gridra-connection-line")).toHaveLength(1);
  });
  it("rejects self connections and same-kind endpoints", () => {
    const onChange = vi.fn(); render(<Fixture onChange={onChange} />); size(canvas());
    connect("a", "a"); connect("a", "b", "output", "output");
    expect(onChange.mock.calls.every(([next]) => next.connections.length === 0)).toBe(true);
    expect(canvas().querySelector(".gridra-connection-line--preview")).toBeNull();
  });
  it("hit-tests the drop point when pointer capture retargets pointerup", () => {
    const onChange = vi.fn(); render(<Fixture onChange={onChange} />); size(canvas());
    Object.defineProperty(document, "elementFromPoint", { configurable: true, value: () => screen.getByTestId("canvas-input-b") });
    pointer(screen.getByTestId("canvas-output-a"), "pointerdown");
    pointer(canvas(), "pointerup", { clientX: 350, clientY: 350 });
    expect(onChange.mock.calls.at(-1)![0].connections).toHaveLength(1);
    delete (document as unknown as { elementFromPoint?: unknown }).elementFromPoint;
  });
  it("isolates two containers even with matching node ids", () => {
    const one = vi.fn(); const two = vi.fn(); render(<><Fixture name="one" onChange={one} /><Fixture name="two" onChange={two} /></>);
    size(canvas("one")); size(canvas("two"));
    pointer(screen.getByTestId("one-output-a"), "pointerdown");
    Object.defineProperty(document, "elementFromPoint", { configurable: true, value: () => screen.getByTestId("two-input-b") });
    pointer(canvas("one"), "pointerup");
    expect(one.mock.calls.every(([next]) => next.connections.length === 0)).toBe(true);
    expect(two).not.toHaveBeenCalled();
    delete (document as unknown as { elementFromPoint?: unknown }).elementFromPoint;
  });
  it("selects and deletes connections through controlled state", () => {
    const onChange = vi.fn(); render(<Fixture onChange={onChange} initialState={{ ...initial,
      connections: [{ sourceId: "a", targetId: "b" }] }} />); size(canvas());
    const path = canvas().querySelector(".gridra-connection-line")!; fireEvent.click(path);
    expect(onChange.mock.calls.at(-1)![0].selectedConnections).toHaveLength(1);
    fireEvent.keyDown(canvas(), { key: "Delete" });
    expect(canvas().querySelector(".gridra-connection-line")).toBeNull();
  });
  it("does not delete connections while editing a field or when keydown is prevented", () => {
    const onChange = vi.fn(); const connection = { sourceId: "a", targetId: "b" };
    const { rerender } = render(<Fixture onChange={onChange} initialState={{ ...initial, connections: [connection], selectedConnections: [connection] }}
      containerProps={{ onKeyDown: (event) => event.preventDefault() }} />); size(canvas());
    fireEvent.keyDown(canvas(), { key: "Backspace" }); expect(onChange).not.toHaveBeenCalled();
    rerender(<Fixture onChange={onChange} initialState={{ ...initial, connections: [connection], selectedConnections: [connection] }} />);
    const input = document.createElement("input"); canvas().append(input);
    fireEvent.keyDown(input, { key: "Delete" }); expect(onChange).not.toHaveBeenCalled();
  });
  it("aligns overlay paths with padding, gaps and scroll-aware placement", () => {
    render(<Fixture containerProps={{ style: { padding: 20, gap: 10 } }} initialState={{ ...initial,
      connections: [{ sourceId: "a", targetId: "b" }] }} />); size(canvas());
    // content 360px minus 3 gaps = 330px; cell width 82.5px.
    const path = canvas().querySelector("path")!;
    expect(path.getAttribute("d")).toContain("M 102.5 61.25");
    expect(path.getAttribute("d")).toContain("297.5 338.75");
    Object.defineProperty(canvas(), "scrollLeft", { configurable: true, value: 50 });
    pointer(screen.getByTestId("canvas-drag-a"), "pointerdown", { clientX: 20 });
    Object.defineProperty(canvas(), "scrollLeft", { configurable: true, value: 142.5 });
    pointer(canvas(), "pointerup", { clientX: 20 });
    expect(node("a").style.gridColumn).toBe("2 / span 1");
  });
  it("defaults to range selection while other operations remain opt-in", () => {
    const onChange = vi.fn(); render(<Fixture autoEnable={false} onChange={onChange} />); size(canvas());
    pointer(screen.getByTestId("canvas-drag-a"), "pointerdown");
    pointer(screen.getByTestId("canvas-resize-a"), "pointerdown"); connect();
    expect(onChange).not.toHaveBeenCalled();
    range(); expect(node("a").getAttribute("aria-pressed")).toBe("true");
  });
  it("composes React 19 callback-ref cleanup", () => {
    const cleanupRef = vi.fn(); const ref = vi.fn(() => cleanupRef);
    const { unmount } = render(<Fixture containerProps={{ ref }} />);
    expect(ref).toHaveBeenCalledWith(canvas());
    unmount(); expect(cleanupRef).toHaveBeenCalled();
  });
  it("ends a drag when the caller replaces its container", () => {
    const onChange = vi.fn(); const { rerender } = render(<Fixture onChange={onChange} />); size(canvas());
    pointer(screen.getByTestId("canvas-drag-a"), "pointerdown");
    rerender(<Fixture onChange={onChange} containerKey="replacement" />); size(canvas()); onChange.mockClear();
    pointer(canvas(), "pointermove", { clientX: 120, clientY: 120 });
    expect(onChange).not.toHaveBeenCalled(); expect(canvas().querySelector(".gridra-snap-guide")).toBeNull();
  });
  it("range-selects connections and deletes them with Backspace", () => {
    const onChange = vi.fn(); render(<Fixture onChange={onChange} initialState={{ ...initial,
      connections: [{ sourceId: "a", targetId: "b" }] }} />); size(canvas());
    range(); expect(onChange.mock.calls.at(-1)![0].selectedConnections).toHaveLength(1);
    fireEvent.keyDown(canvas(), { key: "Backspace" });
    expect(canvas().querySelector(".gridra-connection-line")).toBeNull();
  });
  it("ignores prevented move/up handlers until cancellation", () => {
    const onChange = vi.fn(); render(<Fixture onChange={onChange} containerProps={{
      onPointerMove: event => event.preventDefault(), onPointerUp: event => event.preventDefault(),
    }} />); size(canvas()); pointer(screen.getByTestId("canvas-drag-a"), "pointerdown"); onChange.mockClear();
    pointer(canvas(), "pointermove", { clientX: 120, clientY: 120 });
    pointer(canvas(), "pointerup", { clientX: 120, clientY: 120 });
    expect(onChange).not.toHaveBeenCalled(); pointer(canvas(), "pointercancel");
    expect(canvas().querySelector(".gridra-snap-guide")).toBeNull();
  });

  it("supports any string ID, including the empty string", () => {
    render(<Fixture initialState={{ ...initial, nodes: [{ id: "", label: "Empty", placement: { column: 1, row: 1 } }] }} />);
    size(canvas()); pointer(screen.getByTestId("canvas-drag-"), "pointerdown");
    pointer(canvas(), "pointerup", { clientX: 100, clientY: 100 });
    expect(node("").style.gridColumn).toBe("2 / span 1");
    expect(node("").getAttribute("aria-pressed")).toBe("true");
  });

});
