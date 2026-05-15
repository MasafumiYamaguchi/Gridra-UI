import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraInput } from "../GridraInput";
import { GridraLabel } from "./GridraLabel";

afterEach(() => {
  cleanup();
});

describe("GridraLabel", () => {
  it("associates htmlFor with a control", () => {
    render(
      <>
        <GridraLabel htmlFor="name">Name</GridraLabel>
        <GridraInput id="name" />
      </>
    );

    expect(screen.getByLabelText("Name")).toBeTruthy();
  });

  it("supports custom className, data attributes, and ReactNode children", () => {
    render(
      <GridraLabel className="custom-label" data-testid="label">
        <span>Density</span>
      </GridraLabel>
    );
    const label = screen.getByTestId("label");

    expect(label.className).toContain("gridra-label");
    expect(label.className).toContain("custom-label");
    expect(screen.getByText("Density")).toBeTruthy();
  });
});
