import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraPopover } from "./GridraPopover";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("GridraPopover", () => {
  it("renders content on trigger click with default placement and size", () => {
    render(
      <GridraPopover content="Popover content">
        <button type="button">Trigger</button>
      </GridraPopover>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 100,
        left: 100,
        width: 80,
        height: 32,
        right: 180,
        bottom: 132,
      }),
      configurable: true,
    });

    expect(screen.queryByText("Popover content")).toBeNull();

    fireEvent.click(trigger);
    const popover = screen.getByText("Popover content");
    expect(popover).toBeDefined();
    expect(popover.className).toContain("gridra-popover--bottom");
    expect(popover.className).toContain("gridra-popover--md");
  });

  it("closes on Escape key", () => {
    render(
      <GridraPopover content="Popover content">
        <button type="button">Trigger</button>
      </GridraPopover>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 100,
        left: 100,
        width: 80,
        height: 32,
        right: 180,
        bottom: 132,
      }),
      configurable: true,
    });

    fireEvent.click(trigger);
    expect(screen.getByText("Popover content")).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("Popover content")).toBeNull();
  });

  it("closes on outside pointerdown", () => {
    render(
      <GridraPopover content="Popover content">
        <button type="button">Trigger</button>
      </GridraPopover>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 100,
        left: 100,
        width: 80,
        height: 32,
        right: 180,
        bottom: 132,
      }),
      configurable: true,
    });

    fireEvent.click(trigger);
    expect(screen.getByText("Popover content")).toBeDefined();

    const outside = document.createElement("div");
    document.body.appendChild(outside);
    fireEvent.pointerDown(outside);
    expect(screen.queryByText("Popover content")).toBeNull();

    outside.remove();
  });

  it("removes document listeners after closing", () => {
    const addSpy = vi.spyOn(document, "addEventListener");
    const removeSpy = vi.spyOn(document, "removeEventListener");

    render(
      <GridraPopover content="Popover content" defaultOpen>
        <button type="button">Trigger</button>
      </GridraPopover>,
    );

    const keydownCall = addSpy.mock.calls.find(([type]) => type === "keydown");
    const pointerdownCall = addSpy.mock.calls.find(([type]) => type === "pointerdown");

    expect(keydownCall).toBeDefined();
    expect(pointerdownCall).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(removeSpy).toHaveBeenCalledWith("keydown", keydownCall![1], undefined);
    expect(removeSpy).toHaveBeenCalledWith("pointerdown", pointerdownCall![1], true);
  });

  it("does not close on pointerdown inside popover content", () => {
    render(
      <GridraPopover content={<span>Inside</span>}>
        <button type="button">Trigger</button>
      </GridraPopover>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 100,
        left: 100,
        width: 80,
        height: 32,
        right: 180,
        bottom: 132,
      }),
      configurable: true,
    });

    fireEvent.click(trigger);
    const popover = screen.getByText("Inside");
    fireEvent.pointerDown(popover);
    expect(screen.getByText("Inside")).toBeDefined();
  });

  it("supports controlled open state", () => {
    const onOpenChange = vi.fn();
    render(
      <GridraPopover
        content="Controlled"
        open={false}
        onOpenChange={onOpenChange}
      >
        <button type="button">Trigger</button>
      </GridraPopover>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 100,
        left: 100,
        width: 80,
        height: 32,
        right: 180,
        bottom: 132,
      }),
      configurable: true,
    });

    fireEvent.click(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true, false);
    expect(screen.queryByText("Controlled")).toBeNull();
  });

  it("does not open when disabled", () => {
    render(
      <GridraPopover content="Disabled" disabled>
        <button type="button">Trigger</button>
      </GridraPopover>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" });

    fireEvent.click(trigger);
    expect(screen.queryByText("Disabled")).toBeNull();
  });

  it("sets aria-expanded and aria-controls on trigger", () => {
    render(
      <GridraPopover content="Accessible">
        <button type="button">Trigger</button>
      </GridraPopover>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 100,
        left: 100,
        width: 80,
        height: 32,
        right: 180,
        bottom: 132,
      }),
      configurable: true,
    });

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("aria-controls")).toBeNull();

    fireEvent.click(trigger);
    const popover = screen.getByText("Accessible");
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(popover.id);
  });

  it("composes with existing trigger onClick", () => {
    const existingClick = vi.fn();
    render(
      <GridraPopover content="Composed">
        <button type="button" onClick={existingClick as unknown as React.MouseEventHandler}>
          Trigger
        </button>
      </GridraPopover>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 100,
        left: 100,
        width: 80,
        height: 32,
        right: 180,
        bottom: 132,
      }),
      configurable: true,
    });

    fireEvent.click(trigger);
    expect(existingClick).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Composed")).toBeDefined();
  });

  it("flips placement when out of viewport", () => {
    render(
      <GridraPopover content="Flipped" placement="top">
        <button type="button">Trigger</button>
      </GridraPopover>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 100,
        left: 100,
        width: 80,
        height: 32,
        right: 180,
        bottom: 132,
      }),
      configurable: true,
    });

    fireEvent.click(trigger);
    const popover = screen.getByText("Flipped");
    expect(popover.className).toContain("gridra-popover--top");

    Object.defineProperty(popover, "getBoundingClientRect", {
      value: () => ({
        top: -120,
        left: 100,
        width: 200,
        height: 200,
        right: 300,
        bottom: 80,
      }),
      configurable: true,
    });

    fireEvent(window, new Event("resize"));
    expect(popover.className).toContain("gridra-popover--bottom");
  });

  it("applies size class and maxWidth", () => {
    render(
      <GridraPopover content="Sized" size="lg" maxWidth={400}>
        <button type="button">Trigger</button>
      </GridraPopover>,
    );
    const trigger = screen.getByRole("button", { name: "Trigger" }) as HTMLElement;
    Object.defineProperty(trigger, "getBoundingClientRect", {
      value: () => ({
        top: 100,
        left: 100,
        width: 80,
        height: 32,
        right: 180,
        bottom: 132,
      }),
      configurable: true,
    });

    fireEvent.click(trigger);
    const popover = screen.getByText("Sized");
    expect(popover.className).toContain("gridra-popover--lg");
    expect(popover.style.getPropertyValue("--gridra-popover-max-width")).toBe("400px");
  });

  it("respects preventDefault on trigger onClick", () => {
    render(
      <GridraPopover content="Blocked content">
        <button
          onClick={(e) => e.preventDefault()}
          type="button"
        >
          Trigger
        </button>
      </GridraPopover>
    );

    const trigger = screen.getByRole("button", { name: "Trigger" }) as HTMLElement;
    fireEvent.click(trigger);
    expect(screen.queryByText("Blocked content")).toBeNull();
  });
});
