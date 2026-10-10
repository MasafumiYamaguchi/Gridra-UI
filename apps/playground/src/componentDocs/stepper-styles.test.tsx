import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, it } from "vitest";
import { GridraStepper } from "@gridra-ui/react";
import * as ts from "typescript";

const baseCss = ts.sys.readFile(ts.sys.resolvePath("../../packages/theme/src/base.css")) ?? "";

let stylesheet: HTMLStyleElement;
beforeEach(() => {
  stylesheet = document.createElement("style");
  const start = baseCss.indexOf(".gridra-stepper {");
  expect(start).toBeGreaterThanOrEqual(0);
  stylesheet.textContent = baseCss.slice(start, baseCss.indexOf(".gridra-breadcrumb {", start));
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
  rerender(<GridraStepper variant="ruler" items={[{ id: "first", label: "First" }, { id: "last", label: "Last" }]} />);
  expect(getComputedStyle(screen.getAllByRole("listitem")[0]).flexGrow).toBe("0.5");
});
