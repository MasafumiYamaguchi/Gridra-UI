import { act, cleanup, render, screen } from "@testing-library/react";
import { useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useGridraPortalTheme } from "./portalTheme";
function Probe({ name = "probe", theme, token = "red", enabled = true, anchorKey = "same", extraToken = "" }: {
  name?: string; theme?: string; token?: string; enabled?: boolean; anchorKey?: string; extraToken?: string;
}) {
  const anchor = useRef<HTMLButtonElement>(null);
  const result = useGridraPortalTheme(anchor, theme, enabled);
  return <><button key={anchorKey} ref={anchor} data-testid={`${name}-anchor`}
    style={{ "--gridra-color-accent": token, "--gridra-space-md": "17px", "--gridra-new-custom-token": extraToken } as CSSProperties}>Anchor</button>
    {createPortal(<div data-testid={name} className={result.className} style={result.style} />, document.body)}</>;
}
afterEach(() => { cleanup(); vi.restoreAllMocks(); document.body.className = ""; document.documentElement.className = ""; });
describe("portal theme inheritance without a provider", () => {
  it("copies computed Gridra tokens and uses the closest ancestor palette", () => {
    render(<div className="gridra-theme-dark"><div className="gridra-theme-custom"><Probe /></div></div>);
    expect(screen.getByTestId("probe").className).toBe("gridra-theme-custom");
    expect(screen.getByTestId("probe").style.getPropertyValue("--gridra-color-accent")).toBe("red");
    expect(screen.getByTestId("probe").style.getPropertyValue("--gridra-space-md")).toBe("17px");
  });
  it("updates after ancestor class and source inline tokens change without a React rerender", async () => {
    render(<div data-testid="host" className="gridra-theme-dark"><Probe /></div>);
    await act(async () => {
      screen.getByTestId("host").className = "gridra-theme-forest";
      screen.getByTestId("probe-anchor").style.setProperty("--gridra-color-accent", "green");
    });
    expect(screen.getByTestId("probe").className).toBe("gridra-theme-forest");
    expect(screen.getByTestId("probe").style.getPropertyValue("--gridra-color-accent")).toBe("green");
  });
  it("isolates themed regions and does not select unrelated themes", () => {
    render(<><div className="gridra-theme-ember"><Probe name="one" /></div>
      <div><Probe name="two" /></div></>);
    expect(screen.getByTestId("one").className).toBe("gridra-theme-ember");
    expect(screen.getByTestId("two").className).toBe("");
  });
  it("an explicit theme keeps its palette while inheriting non-color tokens", () => {
    const { rerender } = render(<Probe theme="forest" />);
    const portal = screen.getByTestId("probe");
    expect(portal.className).toBe("gridra-theme-forest");
    expect(portal.style.getPropertyValue("--gridra-color-accent")).toBe("");
    expect(portal.style.getPropertyValue("--gridra-space-md")).toBe("17px");
    const observe = vi.spyOn(MutationObserver.prototype, "observe");
    rerender(<Probe theme="ember" />);
    expect(portal.className).toBe("gridra-theme-ember");
    expect(portal.style.getPropertyValue("--gridra-color-accent")).toBe("");
    rerender(<Probe />);
    expect(portal.className).toBe("");
    expect(portal.style.getPropertyValue("--gridra-color-accent")).toBe("red");
    expect(observe).not.toHaveBeenCalled();
  });
  it("collects new Gridra tokens without a second token-name registry", () => {
    render(<Probe extraToken="123px" />);
    expect(screen.getByTestId("probe").style.getPropertyValue("--gridra-new-custom-token")).toBe("123px");
  });
  it("does not collect styles or register observers while inactive", () => {
    const styles = vi.spyOn(window, "getComputedStyle");
    const observe = vi.spyOn(MutationObserver.prototype, "observe");
    const { rerender } = render(<Probe enabled={false} />);
    rerender(<Probe enabled={false} token="blue" />);
    expect(styles).not.toHaveBeenCalled(); expect(observe).not.toHaveBeenCalled();
    rerender(<Probe enabled token="blue" />);
    expect(screen.getByTestId("probe").style.getPropertyValue("--gridra-color-accent")).toBe("blue");
  });
  it("keeps existing subscriptions and snapshots through unrelated rerenders", () => {
    const styles = vi.spyOn(window, "getComputedStyle");
    const observe = vi.spyOn(MutationObserver.prototype, "observe");
    const disconnect = vi.spyOn(MutationObserver.prototype, "disconnect");
    const { rerender } = render(<Probe />);
    styles.mockClear(); observe.mockClear(); disconnect.mockClear();
    rerender(<Probe />);
    expect(styles).not.toHaveBeenCalled(); expect(observe).not.toHaveBeenCalled(); expect(disconnect).not.toHaveBeenCalled();
  });
  it("refreshes a replaced anchor and stops watching the removed one", async () => {
    const { rerender } = render(<Probe />);
    const oldAnchor = screen.getByTestId("probe-anchor");
    rerender(<Probe anchorKey="new" token="blue" />);
    expect(screen.getByTestId("probe").style.getPropertyValue("--gridra-color-accent")).toBe("blue");
    const styles = vi.spyOn(window, "getComputedStyle");
    await act(async () => { oldAnchor.style.setProperty("--gridra-color-accent", "green"); });
    expect(styles).not.toHaveBeenCalled();
  });
  it("disconnects on close and reads fresh tokens when reopened", () => {
    const disconnect = vi.spyOn(MutationObserver.prototype, "disconnect");
    const { rerender } = render(<Probe />);
    disconnect.mockClear(); rerender(<Probe enabled={false} token="blue" />);
    expect(disconnect).toHaveBeenCalled();
    rerender(<Probe enabled token="blue" />);
    expect(screen.getByTestId("probe").style.getPropertyValue("--gridra-color-accent")).toBe("blue");
  });

  it("applies React ancestor class changes at commit without rebuilding subscriptions", () => {
    const observe = vi.spyOn(MutationObserver.prototype, "observe");
    const { rerender } = render(<div className="gridra-theme-dark"><Probe /></div>);
    observe.mockClear();
    rerender(<div className="gridra-theme-forest"><Probe /></div>);
    expect(screen.getByTestId("probe").className).toBe("gridra-theme-forest");
    expect(observe).not.toHaveBeenCalled();
  });

});
