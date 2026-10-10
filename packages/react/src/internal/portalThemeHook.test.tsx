import { act, cleanup, render, screen } from "@testing-library/react";
import { useRef, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { afterEach, describe, expect, it } from "vitest";
import { useGridraPortalTheme } from "./portalTheme";
function Probe({ name = "probe", theme, token = "red" }: { name?: string; theme?: string; token?: string }) {
  const anchor = useRef<HTMLButtonElement>(null);
  const result = useGridraPortalTheme(anchor, theme);
  return <><button ref={anchor} data-testid={`${name}-anchor`}
    style={{ "--gridra-color-accent": token, "--gridra-space-md": "17px" } as CSSProperties}>Anchor</button>
    {createPortal(<div data-testid={name} className={result.className} style={result.style} />, document.body)}</>;
}
afterEach(() => { cleanup(); document.body.className = ""; document.documentElement.className = ""; });
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
    render(<Probe theme="forest" />);
    const portal = screen.getByTestId("probe");
    expect(portal.className).toBe("gridra-theme-forest");
    expect(portal.style.getPropertyValue("--gridra-color-accent")).toBe("");
    expect(portal.style.getPropertyValue("--gridra-space-md")).toBe("17px");
  });
});
