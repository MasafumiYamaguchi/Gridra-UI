import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraField } from "./GridraField";
import { GridraInput } from "../GridraInput";
import { GridraSelect } from "../GridraSelect";

afterEach(() => {
  cleanup();
});

describe("GridraInput", () => {
  it("forwards type, value changes, and invalid state", () => {
    const onChange = vi.fn();

    render(
      <GridraInput
        aria-invalid="true"
        aria-label="Amount"
        defaultValue="3"
        onChange={onChange}
        type="number"
      />
    );
    const input = screen.getByRole("spinbutton", { name: "Amount" });

    fireEvent.change(input, { target: { value: "4" } });

    expect(input.getAttribute("type")).toBe("number");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect((input as HTMLInputElement).value).toBe("4");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("supports size and invalid while preserving explicit aria-invalid", () => {
    render(
      <>
        <GridraInput aria-label="Name" invalid size="lg" />
        <GridraInput aria-invalid="false" aria-label="Override" invalid />
      </>
    );

    const input = screen.getByRole("textbox", { name: "Name" });
    const override = screen.getByRole("textbox", { name: "Override" });

    expect(input.className).toContain("gridra-input--lg");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(override.getAttribute("aria-invalid")).toBe("false");
  });
});

describe("GridraSelect", () => {
  it("renders options and reports changes", () => {
    const onChange = vi.fn();

    render(
      <GridraSelect aria-label="Mode" defaultValue="select" onChange={onChange}>
        <option value="select">Select</option>
        <option value="pan">Pan</option>
      </GridraSelect>
    );
    const select = screen.getByRole("combobox", { name: "Mode" });

    fireEvent.change(select, { target: { value: "pan" } });

    expect((select as HTMLSelectElement).value).toBe("pan");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("supports size and invalid state", () => {
    render(
      <GridraSelect aria-label="Status" invalid size="sm">
        <option value="ready">Ready</option>
      </GridraSelect>
    );
    const select = screen.getByRole("combobox", { name: "Status" });

    expect(select.className).toContain("gridra-select--sm");
    expect(select.getAttribute("aria-invalid")).toBe("true");
  });
});

describe("GridraField", () => {
  it("associates its label with a control and renders hint text", () => {
    render(
      <GridraField hint="Minimum is 1" htmlFor="columns" label="Columns">
        <GridraInput id="columns" />
      </GridraField>
    );

    expect(screen.getByLabelText("Columns").className).toContain("gridra-input");
    expect(screen.getByText("Minimum is 1").className).toContain("gridra-field__hint");
  });

  it("renders errors instead of hints", () => {
    render(
      <GridraField error="Required" hint="Optional hint" htmlFor="name" label="Name">
        <GridraInput id="name" />
      </GridraField>
    );

    expect(screen.getByText("Required").className).toContain("gridra-field__error");
    expect(screen.queryByText("Optional hint")).toBeNull();
  });

  it("supports required, disabled, orientation, and hint/error ids", () => {
    const { rerender } = render(
      <GridraField
        disabled
        hint="Useful hint"
        hintId="columns-hint"
        htmlFor="columns"
        label="Columns"
        orientation="horizontal"
        required
      >
        <GridraInput id="columns" />
      </GridraField>
    );
    const field = screen.getByText("Columns").closest(".gridra-field");

    expect(field?.className).toContain("gridra-field--horizontal");
    expect(field?.className).toContain("gridra-field--disabled");
    expect(field?.className).toContain("gridra-field--required");
    expect(screen.getByText("Useful hint").getAttribute("id")).toBe("columns-hint");
    expect(screen.getByText("*")).toBeTruthy();

    rerender(
      <GridraField error="Required" errorId="columns-error" htmlFor="columns" label="Columns">
        <GridraInput id="columns" />
      </GridraField>
    );

    expect(screen.getByText("Required").getAttribute("id")).toBe("columns-error");
  });
});
