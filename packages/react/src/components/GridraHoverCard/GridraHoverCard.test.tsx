import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraHoverCard, type GridraHoverCardProps } from "./GridraHoverCard";

const typeCheckChild = <button type="button">Anchor</button>;
const validSizingProps: GridraHoverCardProps = {
  children: typeCheckChild,
  content: "Valid",
  width: "320px",
  maxWidth: "80vw",
};
// @ts-expect-error width must be a CSS length string, including px values.
const invalidWidthProps: GridraHoverCardProps = { ...validSizingProps, width: 320 };
// @ts-expect-error maxWidth must be a CSS length string, including px values.
const invalidMaxWidthProps: GridraHoverCardProps = { ...validSizingProps, maxWidth: 400 };

void invalidMaxWidthProps;
void invalidWidthProps;
void validSizingProps;

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("GridraHoverCard", () => {
  it("renders with default placement and size after hover delay", () => {
    vi.useFakeTimers();
    render(
      <GridraHoverCard content="Card content">
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({ top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132 }),
      configurable: true,
    });

    expect(screen.queryByText("Card content")).toBeNull();

    fireEvent.mouseEnter(anchor);
    act(() => vi.advanceTimersByTime(120));
    const card = screen.getByText("Card content");
    expect(card).toBeDefined();
    expect(card.className).toContain("gridra-hover-card--bottom");
    expect(card.className).toContain("gridra-hover-card--md");
  });

  it("stays open while hovering the card", () => {
    vi.useFakeTimers();
    render(
      <GridraHoverCard content="Interactive card">
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({ top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132 }),
      configurable: true,
    });

    fireEvent.mouseEnter(anchor);
    act(() => vi.advanceTimersByTime(120));
    const card = screen.getByText("Interactive card");

    fireEvent.mouseLeave(anchor);
    fireEvent.mouseEnter(card);

    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByText("Interactive card")).toBeDefined();
  });

  it("closes after hideDelay when leaving card", () => {
    vi.useFakeTimers();
    render(
      <GridraHoverCard content="Will close" hideDelay={300}>
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({ top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132 }),
      configurable: true,
    });

    fireEvent.mouseEnter(anchor);
    act(() => vi.advanceTimersByTime(120));
    const card = screen.getByText("Will close");

    fireEvent.mouseLeave(anchor);
    fireEvent.mouseEnter(card);
    fireEvent.mouseLeave(card);

    act(() => vi.advanceTimersByTime(150));
    expect(screen.getByText("Will close")).toBeDefined();

    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText("Will close")).toBeNull();
  });

  it("opens on focus and closes on blur", () => {
    vi.useFakeTimers();
    render(
      <GridraHoverCard content="Focus card" showDelay={0} hideDelay={0}>
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({ top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132 }),
      configurable: true,
    });

    fireEvent.focus(anchor);
    act(() => vi.advanceTimersByTime(10));
    expect(screen.getByText("Focus card")).toBeDefined();

    fireEvent.blur(anchor);
    act(() => vi.advanceTimersByTime(10));
    expect(screen.queryByText("Focus card")).toBeNull();
  });

  it("closes on Escape", () => {
    vi.useFakeTimers();
    render(
      <GridraHoverCard content="Escapable" showDelay={0}>
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({ top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132 }),
      configurable: true,
    });

    fireEvent.mouseEnter(anchor);
    act(() => vi.advanceTimersByTime(10));
    expect(screen.getByText("Escapable")).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByText("Escapable")).toBeNull();
  });

  it("supports controlled open state", () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    render(
      <GridraHoverCard content="Controlled" open={false} onOpenChange={onOpenChange}>
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" });

    fireEvent.mouseEnter(anchor);
    act(() => vi.advanceTimersByTime(120));
    expect(onOpenChange).toHaveBeenCalledWith(true, false);
    expect(screen.queryByText("Controlled")).toBeNull();
  });

  it("does not open when disabled", () => {
    vi.useFakeTimers();
    render(
      <GridraHoverCard content="Disabled" disabled>
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" });

    fireEvent.mouseEnter(anchor);
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText("Disabled")).toBeNull();
  });

  it("sets aria-expanded and aria-controls", () => {
    vi.useFakeTimers();
    render(
      <GridraHoverCard content="Accessible">
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({ top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132 }),
      configurable: true,
    });

    expect(anchor.getAttribute("aria-expanded")).toBe("false");
    expect(anchor.getAttribute("aria-controls")).toBeNull();

    fireEvent.mouseEnter(anchor);
    act(() => vi.advanceTimersByTime(120));
    const card = screen.getByText("Accessible");
    expect(anchor.getAttribute("aria-expanded")).toBe("true");
    expect(anchor.getAttribute("aria-controls")).toBe(card.id);
    expect(anchor.getAttribute("aria-haspopup")).toBe("dialog");
    expect(card.getAttribute("role")).toBe("dialog");
  });

  it("stays open when focus moves from anchor into the card", () => {
    vi.useFakeTimers();
    render(
      <GridraHoverCard
        content={<button type="button">Inside action</button>}
        showDelay={0}
        hideDelay={0}
      >
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({ top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132 }),
      configurable: true,
    });

    fireEvent.focus(anchor);
    act(() => vi.advanceTimersByTime(10));

    const insideButton = screen.getByRole("button", { name: "Inside action" });
    const card = insideButton.closest(".gridra-hover-card");

    fireEvent.blur(anchor, { relatedTarget: insideButton });
    fireEvent.focus(insideButton);

    expect(screen.getByRole("button", { name: "Inside action" })).toBeDefined();
    expect(card).not.toBeNull();
  });

  it("composes with existing trigger handlers", () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    render(
      <GridraHoverCard content="Composed" showDelay={0} hideDelay={0}>
        <button
          type="button"
          onMouseEnter={onMouseEnter as unknown as React.MouseEventHandler}
          onMouseLeave={onMouseLeave as unknown as React.MouseEventHandler}
        >
          Anchor
        </button>
      </GridraHoverCard>,
    );

    const anchor = screen.getByRole("button", { name: "Anchor" });
    fireEvent.mouseEnter(anchor);
    expect(onMouseEnter).toHaveBeenCalledTimes(1);

    fireEvent.mouseLeave(anchor);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
  });

  it("composes with existing card handlers", () => {
    vi.useFakeTimers();
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();
    const onFocus = vi.fn();
    const onBlur = vi.fn();

    render(
      <GridraHoverCard
        content="Composed card"
        hideDelay={0}
        onBlur={onBlur}
        onFocus={onFocus}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        showDelay={0}
      >
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({ top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132 }),
      configurable: true,
    });

    fireEvent.mouseEnter(anchor);
    act(() => vi.advanceTimersByTime(10));

    const card = screen.getByText("Composed card");
    fireEvent.mouseEnter(card);
    fireEvent.focus(card);
    fireEvent.mouseLeave(card);
    fireEvent.blur(card);

    expect(onMouseEnter).toHaveBeenCalledTimes(1);
    expect(onMouseLeave).toHaveBeenCalledTimes(1);
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it("applies size class and string maxWidth", () => {
    vi.useFakeTimers();
    render(
      <GridraHoverCard content="Sized" size="lg" maxWidth="400px">
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({ top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132 }),
      configurable: true,
    });

    fireEvent.mouseEnter(anchor);
    act(() => vi.advanceTimersByTime(120));
    const card = screen.getByText("Sized");
    expect(card.className).toContain("gridra-hover-card--lg");
    expect(card.style.getPropertyValue("--gridra-hover-card-max-width")).toBe("400px");
  });

  it("applies CSS length sizing variables", () => {
    vi.useFakeTimers();
    render(
      <GridraHoverCard
        content="Custom size"
        height="40vh"
        maxHeight="calc(100vh - 48px)"
        maxWidth="80vw"
        minHeight="120px"
        minWidth="50%"
        width="320px"
      >
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({ top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132 }),
      configurable: true,
    });

    fireEvent.mouseEnter(anchor);
    act(() => vi.advanceTimersByTime(120));
    const card = screen.getByText("Custom size");
    expect(card.style.getPropertyValue("--gridra-hover-card-width")).toBe("320px");
    expect(card.style.getPropertyValue("--gridra-hover-card-min-width")).toBe("50%");
    expect(card.style.getPropertyValue("--gridra-hover-card-max-width")).toBe("80vw");
    expect(card.style.getPropertyValue("--gridra-hover-card-height")).toBe("40vh");
    expect(card.style.getPropertyValue("--gridra-hover-card-min-height")).toBe("120px");
    expect(card.style.getPropertyValue("--gridra-hover-card-max-height")).toBe("calc(100vh - 48px)");
  });

  it("flips placement when out of viewport", () => {
    vi.useFakeTimers();
    render(
      <GridraHoverCard content="Flipped" placement="top">
        <button type="button">Anchor</button>
      </GridraHoverCard>,
    );
    const anchor = screen.getByRole("button", { name: "Anchor" }) as HTMLElement;
    Object.defineProperty(anchor, "getBoundingClientRect", {
      value: () => ({ top: 100, left: 100, width: 80, height: 32, right: 180, bottom: 132 }),
      configurable: true,
    });

    fireEvent.mouseEnter(anchor);
    act(() => vi.advanceTimersByTime(120));
    const card = screen.getByText("Flipped");
    expect(card.className).toContain("gridra-hover-card--top");

    Object.defineProperty(card, "getBoundingClientRect", {
      value: () => ({ top: -120, left: 100, width: 200, height: 200, right: 300, bottom: 80 }),
      configurable: true,
    });
    fireEvent(window, new Event("resize"));
    expect(card.className).toContain("gridra-hover-card--bottom");
  });
});
