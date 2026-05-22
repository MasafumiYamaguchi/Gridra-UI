import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraCheckbox } from "./GridraCheckbox";

afterEach(() => {
  cleanup();
});

describe("GridraCheckbox", () => {
  it("associates label and description with the native checkbox", () => {
    render(
      <GridraCheckbox
        description="Aligns items to the grid"
        id="snap"
        label="Snap"
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Snap" });
    const description = screen.getByText("Aligns items to the grid");

    expect(checkbox.getAttribute("id")).toBe("snap");
    expect(checkbox.getAttribute("aria-describedby")).toBe("snap-description");
    expect(description.getAttribute("id")).toBe("snap-description");
    expect(description.getAttribute("aria-hidden")).toBe("true");
  });

  it("supports invalid state while preserving an explicit aria-invalid value", () => {
    render(
      <>
        <GridraCheckbox aria-label="Invalid" invalid />
        <GridraCheckbox aria-invalid="false" aria-label="Override" invalid />
      </>,
    );

    expect(screen.getByRole("checkbox", { name: "Invalid" }).getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("checkbox", { name: "Override" }).getAttribute("aria-invalid")).toBe("false");
  });

  it("forwards disabled state to the native checkbox", () => {
    render(<GridraCheckbox aria-label="Locked" disabled />);

    expect((screen.getByRole("checkbox", { name: "Locked" }) as HTMLInputElement).disabled).toBe(true);
  });
});
