import { act, cleanup, render, screen } from "@testing-library/react";
import type { CSSProperties, ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraPopover, GridraTooltip, GridraHoverCard, GridraDropdownMenu, GridraContextMenu, GridraDialog } from "../index";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });
const anchor = <button data-testid="anchor" style={{ "--gridra-color-accent": "red" } as CSSProperties}>Anchor</button>;
const cases: [string, ReactElement, string][] = [
  ["popover", <GridraPopover defaultOpen content="Content">{anchor}</GridraPopover>, ".gridra-popover"],
  ["tooltip", <GridraTooltip defaultOpen content="Content">{anchor}</GridraTooltip>, ".gridra-tooltip"],
  ["hover card", <GridraHoverCard defaultOpen content="Content">{anchor}</GridraHoverCard>, ".gridra-hover-card"],
  ["dropdown", <GridraDropdownMenu defaultOpen items={[{ id: "one", label: "One" }]}>{anchor}</GridraDropdownMenu>, ".gridra-dropdown-menu"],
  ["context menu", <GridraContextMenu defaultOpen items={[{ id: "one", label: "One" }]}>{anchor}</GridraContextMenu>, ".gridra-context-menu"],
  ["dialog", <GridraDialog defaultOpen title="Dialog">{anchor}</GridraDialog>, ".gridra-dialog__backdrop"],
];
describe("portal components preserve inherited token updates", () => {
  it.each(cases)("updates inline tokens in an open %s", async (_, element, selector) => {
    render(<div className="gridra-theme-custom">{element}</div>);
    const portal = document.querySelector(selector) as HTMLElement;
    expect(portal).not.toBeNull();
    expect(portal.style.getPropertyValue("--gridra-color-accent")).toBe("red");
    await act(async () => screen.getByTestId("anchor").style.setProperty("--gridra-color-accent", "blue"));
    expect(portal.style.getPropertyValue("--gridra-color-accent")).toBe("blue");
  });
  it.each(cases.slice(0, 4))("positions default-open %s after the first portal mount", (_, element, selector) => {
    render(element);
    const portal = document.querySelector(selector) as HTMLElement;
    expect(portal.style.top).not.toBe("-9999px");
    expect(portal.style.left).not.toBe("-9999px");
  });
  it("does not collect CSS or recreate observers for closed tooltips", () => {
    function Closed({ tick }: { tick: number }) {
      return <div><span>{tick}</span>{Array.from({ length: 20 }, (_, index) => (
        <GridraTooltip key={index} open={false} content="Closed"><button>{index}</button></GridraTooltip>
      ))}</div>;
    }
    const styles = vi.spyOn(window, "getComputedStyle");
    const observe = vi.spyOn(MutationObserver.prototype, "observe");
    const { rerender } = render(<Closed tick={0} />);
    rerender(<Closed tick={1} />);
    expect(styles).not.toHaveBeenCalled(); expect(observe).not.toHaveBeenCalled();
  });

});
