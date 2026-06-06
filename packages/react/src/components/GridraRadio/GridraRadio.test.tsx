import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraRadio } from "./GridraRadio";

afterEach(() => {
  cleanup();
});

describe("GridraRadio", () => {
  it("associates label and description with the native radio", () => {
    render(
      <GridraRadio
        description="Use grid placement"
        id="grid-mode"
        label="Grid"
        name="mode"
      />,
    );

    const radio = screen.getByRole("radio", { name: "Grid" });
    const description = screen.getByText("Use grid placement");

    expect(radio.getAttribute("id")).toBe("grid-mode");
    expect(radio.getAttribute("aria-describedby")).toBe("grid-mode-description");
    expect(description.getAttribute("id")).toBe("grid-mode-description");
    expect(description.getAttribute("aria-hidden")).toBe("true");
  });

  it("lets the native radio group enforce exclusive selection", () => {
    render(
      <>
        <GridraRadio label="Select" name="tool" value="select" />
        <GridraRadio label="Pan" name="tool" value="pan" />
      </>,
    );

    const select = screen.getByRole("radio", { name: "Select" }) as HTMLInputElement;
    const pan = screen.getByRole("radio", { name: "Pan" }) as HTMLInputElement;

    fireEvent.click(select);
    fireEvent.click(pan);

    expect(select.checked).toBe(false);
    expect(pan.checked).toBe(true);
  });

  it("forwards disabled state to the native radio", () => {
    render(<GridraRadio aria-label="Locked" disabled />);

    expect((screen.getByRole("radio", { name: "Locked" }) as HTMLInputElement).disabled).toBe(true);
  });

  it("supports invalid state while preserving an explicit aria-invalid value", () => {
    render(
      <>
        <GridraRadio aria-label="Invalid" invalid />
        <GridraRadio aria-invalid="false" aria-label="Override" invalid />
      </>,
    );

    expect(screen.getByRole("radio", { name: "Invalid" }).getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("radio", { name: "Override" }).getAttribute("aria-invalid")).toBe("false");
  });

  it("preserves controlled checked state until props change", () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <GridraRadio checked={false} label="Select" name="tool" onChange={handleChange} />,
    );
    const radio = screen.getByRole("radio", { name: "Select" }) as HTMLInputElement;

    fireEvent.click(radio);

    expect(radio.checked).toBe(false);
    expect(handleChange).toHaveBeenCalledTimes(1);

    rerender(<GridraRadio checked label="Select" name="tool" onChange={handleChange} />);

    expect(radio.checked).toBe(true);
  });

  it("forwards className, size class, form metadata, and data attributes", () => {
    render(
      <GridraRadio
        className="custom-radio"
        data-testid="pan"
        label="Pan"
        name="tool"
        required
        size="lg"
        value="pan"
      />,
    );
    const wrapper = screen.getByText("Pan").closest("label");
    const radio = screen.getByTestId("pan") as HTMLInputElement;

    expect(wrapper?.className).toContain("gridra-radio--lg");
    expect(wrapper?.className).toContain("custom-radio");
    expect(radio.name).toBe("tool");
    expect(radio.required).toBe(true);
    expect(radio.value).toBe("pan");
  });
});
