import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraSpinner } from "./GridraSpinner";

afterEach(() => {
  cleanup();
});

describe("GridraSpinner", () => {
  it("renders the default status contract", () => {
    render(<GridraSpinner />);
    const spinner = screen.getByRole("status", { name: "Loading" });

    expect(spinner.className).toContain("gridra-spinner");
    expect(spinner.className).toContain("gridra-spinner--md");
    expect(spinner.className).toContain("gridra-spinner--default");
    expect(spinner.className).toContain("gridra-spinner--normal");
    expect(spinner.querySelector(".gridra-spinner__track")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("supports label, preset size, tone, speed, className, and attributes", () => {
    render(<GridraSpinner className="custom-spinner" data-testid="spinner" label="Saving" size="lg" speed="fast" tone="accent" />);
    const spinner = screen.getByTestId("spinner");

    expect(spinner.getAttribute("aria-label")).toBe("Saving");
    expect(spinner.className).toContain("gridra-spinner--lg");
    expect(spinner.className).toContain("gridra-spinner--accent");
    expect(spinner.className).toContain("gridra-spinner--fast");
    expect(spinner.className).toContain("custom-spinner");
  });

  it("maps numeric and string custom sizes to a CSS variable", () => {
    const { rerender } = render(<GridraSpinner label="Syncing" size={32} />);

    expect(screen.getByRole("status", { name: "Syncing" }).getAttribute("style")).toContain(
      "--gridra-spinner-size: 32px"
    );

    rerender(<GridraSpinner label="Syncing" size="2rem" />);

    expect(screen.getByRole("status", { name: "Syncing" }).getAttribute("style")).toContain(
      "--gridra-spinner-size: 2rem"
    );
  });
});
