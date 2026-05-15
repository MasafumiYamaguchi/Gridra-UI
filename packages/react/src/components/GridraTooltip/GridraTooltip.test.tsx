import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraTooltip } from "./GridraTooltip";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("GridraTooltip", () => {
  it("renders with default placement and size", () => {
    vi.useFakeTimers();
    render(
      <GridraTooltip content="Help">
        <button type="button">Anchor</button>
      </GridraTooltip>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({
        x: 100,
        y: 200,
        left: 100,
        top: 200,
        width: 40,
        height: 20,
        right: 140,
        bottom: 220,
        toJSON: () => ({}),
      }),
    });

    fireEvent.mouseEnter(anchor);
    act(() => {
      vi.advanceTimersByTime(120);
    });
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toContain("gridra-tooltip--top");
    expect(tooltip.className).toContain("gridra-tooltip--md");
  });

  it("applies size and maxWidth", () => {
    vi.useFakeTimers();
    render(
      <GridraTooltip content="Help" maxWidth={320} size="lg">
        <button type="button">Anchor</button>
      </GridraTooltip>,
    );

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Anchor" }));
    act(() => {
      vi.advanceTimersByTime(120);
    });
    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.className).toContain("gridra-tooltip--lg");
    expect(tooltip.getAttribute("style")).toContain("--gridra-tooltip-max-width: 320px");
  });

  it("shows and hides on hover and blur", () => {
    vi.useFakeTimers();
    render(
      <GridraTooltip content="Help">
        <button type="button">Anchor</button>
      </GridraTooltip>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" });

    fireEvent.mouseEnter(anchor);
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(screen.getByRole("tooltip")).toBeTruthy();

    fireEvent.mouseLeave(anchor);
    expect(screen.queryByRole("tooltip")).toBeNull();

    fireEvent.focus(anchor);
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(screen.getByRole("tooltip")).toBeTruthy();

    fireEvent.blur(anchor);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("respects showDelay", () => {
    vi.useFakeTimers();
    render(
      <GridraTooltip content="Help" showDelay={300}>
        <button type="button">Anchor</button>
      </GridraTooltip>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" });

    fireEvent.mouseEnter(anchor);
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(screen.queryByRole("tooltip")).toBeNull();
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(screen.getByRole("tooltip")).toBeTruthy();
  });

  it("supports controlled open state callbacks", () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    render(
      <GridraTooltip content="Help" onOpenChange={onOpenChange} open={false}>
        <button type="button">Anchor</button>
      </GridraTooltip>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" });
    fireEvent.focus(anchor);
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(onOpenChange).toHaveBeenCalledWith(true, false);
  });

  it("does not open when disabled", () => {
    vi.useFakeTimers();
    render(
      <GridraTooltip content="Help" disabled>
        <button type="button">Anchor</button>
      </GridraTooltip>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" });
    fireEvent.mouseEnter(anchor);
    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("wires aria-describedby to tooltip id", () => {
    vi.useFakeTimers();
    render(
      <GridraTooltip content="Help">
        <button type="button">Anchor</button>
      </GridraTooltip>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" });
    fireEvent.focus(anchor);
    act(() => {
      vi.advanceTimersByTime(120);
    });
    const tooltip = screen.getByRole("tooltip");
    expect(anchor.getAttribute("aria-describedby")).toBe(tooltip.id);
  });

  it("flips to opposite placement when out of viewport", () => {
    vi.useFakeTimers();
    render(
      <GridraTooltip content="Help" placement="top">
        <button type="button">Anchor</button>
      </GridraTooltip>,
    );

    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({
        x: 10,
        y: 2,
        left: 10,
        top: 2,
        width: 40,
        height: 20,
        right: 50,
        bottom: 22,
        toJSON: () => ({}),
      }),
    });

    fireEvent.mouseEnter(anchor);
    act(() => {
      vi.advanceTimersByTime(120);
    });
    const tooltip = screen.getByRole("tooltip") as HTMLElement;
    Object.defineProperty(tooltip, "getBoundingClientRect", {
      value: () => ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        width: 80,
        height: 36,
        right: 80,
        bottom: 36,
        toJSON: () => ({}),
      }),
    });
    fireEvent(window, new Event("resize"));

    expect(tooltip.className).toContain("gridra-tooltip--bottom");
  });
});
