import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraInput } from "./GridraInput";

afterEach(() => {
  cleanup();
});

describe("GridraInput", () => {
  it("defaults to a text input and forwards changes", () => {
    const handleChange = vi.fn();

    render(<GridraInput aria-label="Name" defaultValue="A" onChange={handleChange} />);

    const input = screen.getByRole("textbox", { name: "Name" }) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "B" } });

    expect(input.type).toBe("text");
    expect(input.value).toBe("B");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("supports invalid state while preserving an explicit aria-invalid value", () => {
    render(
      <>
        <GridraInput aria-label="Invalid" invalid />
        <GridraInput aria-invalid="false" aria-label="Override" invalid />
      </>,
    );

    expect(screen.getByRole("textbox", { name: "Invalid" }).getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("textbox", { name: "Override" }).getAttribute("aria-invalid")).toBe("false");
  });

  it("forwards disabled state to the native input", () => {
    render(<GridraInput aria-label="Locked" disabled />);

    expect((screen.getByRole("textbox", { name: "Locked" }) as HTMLInputElement).disabled).toBe(true);
  });

  it("supports controlled value without mutating display before props change", () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <GridraInput aria-label="Token" onChange={handleChange} value="alpha" />,
    );
    const input = screen.getByRole("textbox", { name: "Token" }) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "beta" } });

    expect(input.value).toBe("alpha");
    expect(handleChange).toHaveBeenCalledTimes(1);

    rerender(<GridraInput aria-label="Token" onChange={handleChange} value="beta" />);

    expect(input.value).toBe("beta");
  });

  it("forwards native form metadata, className, size class, and aria-describedby", () => {
    render(
      <GridraInput
        aria-describedby="name-help"
        aria-label="Project name"
        autoComplete="off"
        className="custom-input"
        data-testid="name"
        name="project"
        placeholder="Untitled"
        readOnly
        required
        size="lg"
      />,
    );
    const input = screen.getByTestId("name") as HTMLInputElement;

    expect(input.getAttribute("aria-describedby")).toBe("name-help");
    expect(input.autocomplete).toBe("off");
    expect(input.name).toBe("project");
    expect(input.placeholder).toBe("Untitled");
    expect(input.readOnly).toBe(true);
    expect(input.required).toBe(true);
    expect(input.className).toContain("gridra-input--lg");
    expect(input.className).toContain("custom-input");
  });
});
