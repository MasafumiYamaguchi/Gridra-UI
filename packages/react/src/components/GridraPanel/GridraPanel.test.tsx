import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraPanel } from "./GridraPanel";

afterEach(() => {
  cleanup();
});

describe("GridraPanel", () => {
  it("renders heading, custom header content, children, and forwarded attributes", () => {
    render(
      <GridraPanel
        aria-label="Inspector"
        className="custom-panel"
        data-testid="panel"
        heading="Details"
        header={<button type="button">Close</button>}
      >
        Body content
      </GridraPanel>
    );
    const panel = screen.getByTestId("panel");

    expect(panel.tagName).toBe("ASIDE");
    expect(panel.className).toContain("gridra-panel");
    expect(panel.className).toContain("gridra-panel--left");
    expect(panel.className).toContain("custom-panel");
    expect(screen.getByRole("heading", { name: "Details", level: 2 }).className).toContain(
      "gridra-panel__title"
    );
    expect(screen.getByRole("button", { name: "Close" }).parentElement?.className).toContain(
      "gridra-panel__header"
    );
    expect(screen.getByText("Body content").className).toContain("gridra-panel__body");
  });

  it("supports right position and omits the header wrapper when no heading or header is provided", () => {
    render(
      <GridraPanel data-testid="panel" position="right">
        Plain body
      </GridraPanel>
    );
    const panel = screen.getByTestId("panel");

    expect(panel.className).toContain("gridra-panel--right");
    expect(panel.querySelector(".gridra-panel__header")).toBeNull();
    expect(screen.getByText("Plain body").className).toContain("gridra-panel__body");
  });

  it("renders custom header content without forcing a heading", () => {
    render(
      <GridraPanel header={<button type="button">Close</button>}>
        Body
      </GridraPanel>,
    );

    expect(screen.getByRole("button", { name: "Close" })).toBeTruthy();
    expect(screen.queryByRole("heading")).toBeNull();
  });
});
