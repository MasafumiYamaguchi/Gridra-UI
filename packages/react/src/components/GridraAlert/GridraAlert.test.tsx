import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraAlert } from "./GridraAlert";

afterEach(() => {
  cleanup();
});

describe("GridraAlert", () => {
  it("renders the default info status contract", () => {
    render(<GridraAlert>Connection saved.</GridraAlert>);
    const alert = screen.getByRole("status");

    expect(alert.className).toContain("gridra-alert");
    expect(alert.className).toContain("gridra-alert--info");
    expect(alert.textContent).toContain("Connection saved.");
  });

  it("uses alert semantics for danger tone", () => {
    render(<GridraAlert tone="danger">Connection failed.</GridraAlert>);
    const alert = screen.getByRole("alert");

    expect(alert.className).toContain("gridra-alert--danger");
  });

  it("lets an explicit role override the default tone role", () => {
    render(
      <GridraAlert role="note" tone="danger">
        Destructive action disabled.
      </GridraAlert>
    );

    expect(screen.getByRole("note").className).toContain("gridra-alert--danger");
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("renders heading, icon, action, and body slots", () => {
    render(
      <GridraAlert
        action={<button type="button">Retry</button>}
        heading="Sync interrupted"
        icon={<span data-testid="alert-icon">!</span>}
      >
        Check the source node and retry.
      </GridraAlert>
    );
    const alert = screen.getByRole("status");

    expect(screen.getByText("Sync interrupted")).toBeTruthy();
    expect(screen.getByText("Check the source node and retry.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Retry" })).toBeTruthy();
    expect(screen.getByTestId("alert-icon")).toBeTruthy();
    expect(alert.querySelector(".gridra-alert__icon")?.getAttribute("aria-hidden")).toBe("true");
    expect(alert.className).toContain("gridra-alert--with-icon");
    expect(alert.className).toContain("gridra-alert--with-action");
  });

  it("passes through className, data attributes, and aria attributes", () => {
    render(
      <GridraAlert
        aria-label="Canvas warning"
        className="custom-alert"
        data-testid="alert"
        tone="warning"
      >
        Snap guide unavailable.
      </GridraAlert>
    );
    const alert = screen.getByTestId("alert");

    expect(alert.getAttribute("aria-label")).toBe("Canvas warning");
    expect(alert.className).toContain("gridra-alert--warning");
    expect(alert.className).toContain("custom-alert");
  });
});
