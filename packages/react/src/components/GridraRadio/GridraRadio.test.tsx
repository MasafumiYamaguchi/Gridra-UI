import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
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
});
