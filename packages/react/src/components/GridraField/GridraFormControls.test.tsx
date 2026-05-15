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
        <GridraInput
          aria-describedby="name-hint"
          aria-label="Name"
          className="custom-input"
          disabled
          invalid
          name="name"
          placeholder="Full name"
          required
          size="lg"
        />
        <GridraInput aria-invalid="false" aria-label="Override" invalid />
      </>
    );

    const input = screen.getByRole("textbox", { name: "Name" });
    const override = screen.getByRole("textbox", { name: "Override" });

    expect(input.className).toContain("gridra-input--lg");
    expect(input.className).toContain("custom-input");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe("name-hint");
    expect(input.getAttribute("name")).toBe("name");
    expect(input.getAttribute("placeholder")).toBe("Full name");
    expect((input as HTMLInputElement).disabled).toBe(true);
    expect((input as HTMLInputElement).required).toBe(true);
    expect(override.getAttribute("aria-invalid")).toBe("false");
  });

  it("omits aria-invalid when invalid is false", () => {
    render(<GridraInput aria-label="Name" invalid={false} />);

    expect(screen.getByRole("textbox", { name: "Name" }).hasAttribute("aria-invalid")).toBe(false);
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
      <GridraSelect aria-label="Status" className="custom-select" disabled invalid name="status" required size="sm">
        <option value="ready">Ready</option>
      </GridraSelect>
    );
    const select = screen.getByRole("combobox", { name: "Status" });

    expect(select.className).toContain("gridra-select--sm");
    expect(select.className).toContain("custom-select");
    expect(select.getAttribute("aria-invalid")).toBe("true");
    expect(select.getAttribute("name")).toBe("status");
    expect((select as HTMLSelectElement).disabled).toBe(true);
    expect((select as HTMLSelectElement).required).toBe(true);
  });

  it("supports controlled value and multiple selection contracts", () => {
    const { rerender } = render(
      <GridraSelect aria-label="Modes" multiple onChange={() => {}} value={["pan"]}>
        <option value="select">Select</option>
        <option value="pan">Pan</option>
        <option value="draw">Draw</option>
      </GridraSelect>
    );
    const select = screen.getByRole("listbox", { name: "Modes" }) as HTMLSelectElement;

    expect(select.multiple).toBe(true);
    expect(Array.from(select.selectedOptions).map((option) => option.value)).toEqual(["pan"]);

    rerender(
      <GridraSelect aria-label="Modes" multiple onChange={() => {}} value={["select", "draw"]}>
        <option value="select">Select</option>
        <option value="pan">Pan</option>
        <option value="draw">Draw</option>
      </GridraSelect>
    );

    expect(Array.from(select.selectedOptions).map((option) => option.value)).toEqual(["select", "draw"]);
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

  it("forwards root attributes and marks invalid fields by error state", () => {
    render(
      <GridraField
        className="custom-field"
        data-testid="field"
        error="Broken"
        htmlFor="name"
        label={<span>Name</span>}
        role="group"
      >
        <GridraInput id="name" />
      </GridraField>
    );
    const field = screen.getByTestId("field");

    expect(field.getAttribute("role")).toBe("group");
    expect(field.className).toContain("gridra-field--invalid");
    expect(field.className).toContain("custom-field");
    expect(screen.getByLabelText("Name")).toBeTruthy();
  });

  it("does not automatically wire hint ids or disabled state into child controls", () => {
    render(
      <GridraField disabled hint="Useful hint" hintId="name-hint" htmlFor="name" label="Name">
        <GridraInput id="name" />
      </GridraField>
    );
    const input = screen.getByLabelText("Name");

    expect(input.hasAttribute("aria-describedby")).toBe(false);
    expect((input as HTMLInputElement).disabled).toBe(false);
  });
});
