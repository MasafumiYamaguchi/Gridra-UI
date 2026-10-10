import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it } from "vitest";
import { GridraStepper } from "@gridra-ui/react";
import * as ts from "typescript";

const cssRelativePath = "../../../../packages/theme/src/base.css";
const cssUrl = new URL(/* @vite-ignore */ cssRelativePath, import.meta.url);
const cssPath = decodeURIComponent(cssUrl.pathname).replace(/^\/([A-Za-z]:\/)/, "$1");
const baseCss = ts.sys.readFile(cssPath);
if (baseCss === undefined) throw new Error(`Could not read ${cssUrl.href}`);

let stylesheet: HTMLStyleElement;
beforeEach(() => {
  stylesheet = document.createElement("style");
  stylesheet.textContent = baseCss;
  document.head.append(stylesheet);
});
afterEach(() => {
  cleanup();
  stylesheet.remove();
});

it.each(["cards", "ruler", "line", "boxes"] as const)("keeps disabled %s states distinct without compounding opacity", (variant) => {
  render(<GridraStepper variant={variant} disabled currentId="current" items={[
    { id: "done", label: "Done" }, { id: "current", label: "Current" },
    { id: "pending", label: "Pending" }, { id: "locked", label: "Locked", disabled: true },
  ]} />);
  expect(getComputedStyle(screen.getByRole("button", { name: "Completed: 1 Done" })).opacity).toBe("0.6");
  expect(getComputedStyle(screen.getByRole("button", { name: "2 Current" })).opacity).toBe("0.6");
  expect(getComputedStyle(screen.getByRole("button", { name: "3 Pending" })).opacity).toBe("0.5");
  expect(getComputedStyle(screen.getByRole("button", { name: "Locked: 4 Locked" })).opacity).toBe("0.4");
  expect(["", "1"]).toContain(getComputedStyle(screen.getByRole("navigation")).opacity);
});

it("gives a single ruler label the full flex width", () => {
  const { rerender } = render(<GridraStepper variant="ruler" items={[{ id: "only", label: "Only" }]} />);
  expect(getComputedStyle(screen.getByRole("listitem")).flexGrow).toBe("1");
  expect(getComputedStyle(screen.getByRole("button")).alignItems).toBe("flex-end");
  rerender(<GridraStepper variant="ruler" items={[{ id: "first", label: "First" }, { id: "last", label: "Last" }]} />);
  expect(getComputedStyle(screen.getAllByRole("listitem")[0]).flexGrow).toBe("0.5");
});

it.each(["cards", "line"] as const)("contains a long %s sequence in a local scroll area", (variant) => {
  render(<GridraStepper variant={variant} style={{ width: 600 }} items={Array.from({ length: 8 }, (_, index) => ({
    id: String(index), label: `Workflow step ${index + 1}`,
  }))} />);
  const navStyle = getComputedStyle(screen.getByRole("navigation"));
  expect(navStyle.overflowX).toBe("auto");
  expect(navStyle.width).toBe("600px");
  expect(navStyle.getPropertyValue("--gridra-stepper-column-width")).toBe("140px");
  expect(getComputedStyle(screen.getByRole("list")).gridTemplateColumns).toContain("minmax(var(--gridra-stepper-column-width), 1fr)");
});
