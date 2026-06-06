import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
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

  it("toggles through the native checkbox contract and forwards change events", () => {
    const handleChange = vi.fn();
    render(<GridraCheckbox label="Snap" onChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox", { name: "Snap" }) as HTMLInputElement;

    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("preserves controlled checked state until props change", () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <GridraCheckbox checked={false} label="Visible" onChange={handleChange} />,
    );
    const checkbox = screen.getByRole("checkbox", { name: "Visible" }) as HTMLInputElement;

    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(false);
    expect(handleChange).toHaveBeenCalledTimes(1);

    rerender(<GridraCheckbox checked label="Visible" onChange={handleChange} />);

    expect(checkbox.checked).toBe(true);
  });

  it("forwards className, size class, form metadata, and data attributes", () => {
    render(
      <GridraCheckbox
        className="custom-checkbox"
        data-testid="snap"
        label="Snap"
        name="snap"
        required
        size="lg"
        value="enabled"
      />,
    );
    const wrapper = screen.getByText("Snap").closest("label");
    const checkbox = screen.getByTestId("snap") as HTMLInputElement;

    expect(wrapper?.className).toContain("gridra-checkbox--lg");
    expect(wrapper?.className).toContain("custom-checkbox");
    expect(checkbox.name).toBe("snap");
    expect(checkbox.required).toBe(true);
    expect(checkbox.value).toBe("enabled");
  });
});
