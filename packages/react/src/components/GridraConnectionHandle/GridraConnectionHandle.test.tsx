import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraConnectionHandle } from "./GridraConnectionHandle";
import { GridraNode } from "../GridraNode";

afterEach(() => {
  cleanup();
});

describe("GridraConnectionHandle", () => {
  it("renders a decorative output handle at the default position", () => {
    const { container } = render(<GridraConnectionHandle />);
    const handle = container.querySelector(".gridra-connection-handle");

    expect(handle?.classList.contains("gridra-connection-handle--output")).toBe(true);
    expect(handle?.classList.contains("gridra-connection-handle--right")).toBe(true);
    expect(handle?.getAttribute("aria-hidden")).toBe("true");
    expect(handle?.getAttribute("data-gridra-connection-kind")).toBe("output");
    expect(handle?.querySelector(".gridra-connection-handle__dot")).not.toBeNull();
  });

  it("supports input kind, explicit position, and active state", () => {
    const { container } = render(
      <GridraConnectionHandle active kind="input" position="left" />
    );
    const handle = container.querySelector(".gridra-connection-handle");

    expect(handle?.classList.contains("gridra-connection-handle--input")).toBe(true);
    expect(handle?.classList.contains("gridra-connection-handle--left")).toBe(true);
    expect(handle?.classList.contains("gridra-connection-handle--active")).toBe(true);
    expect(handle?.getAttribute("data-gridra-connection-kind")).toBe("input");
  });

  it("renders custom children as visible handle content", () => {
    render(<GridraConnectionHandle position="inline">Port</GridraConnectionHandle>);

    const handle = screen.getByText("Port");

    expect(handle.getAttribute("aria-hidden")).toBeNull();
    expect(handle.className).toContain("gridra-connection-handle--inline");
  });

  it("forwards pointer events to the handle element", () => {
    const onPointerDown = vi.fn();
    const { container } = render(
      <GridraConnectionHandle onPointerDown={onPointerDown} />
    );
    const handle = container.querySelector(".gridra-connection-handle") as HTMLElement;

    fireEvent.pointerDown(handle);

    expect(onPointerDown).toHaveBeenCalledTimes(1);
  });

  it("can be inserted into a node handle slot", () => {
    const { container } = render(
      <GridraNode
        connectionHandles={<GridraConnectionHandle />}
        id="demo"
        placement={{ column: 1, row: 1 }}
      />
    );
    const node = container.querySelector(".gridra-node");

    expect(node?.querySelector(".gridra-connection-handle")).not.toBeNull();
    expect(node?.querySelector(".gridra-node__label")?.textContent).toBe("demo");
  });
});
