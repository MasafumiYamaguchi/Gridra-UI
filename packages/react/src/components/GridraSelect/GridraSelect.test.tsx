import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraSelect } from "./GridraSelect";

afterEach(() => {
  cleanup();
});

describe("GridraSelect", () => {
  it("renders options and reports valid changes", () => {
    const handleChange = vi.fn();

    render(
      <GridraSelect aria-label="Mode" defaultValue="select" onChange={handleChange}>
        <option value="select">Select</option>
        <option value="pan">Pan</option>
      </GridraSelect>,
    );

    const select = screen.getByRole("combobox", { name: "Mode" }) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "pan" } });

    expect(select.value).toBe("pan");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("supports multiple controlled selection", () => {
    const { rerender } = render(
      <GridraSelect aria-label="Tools" multiple onChange={() => {}} value={["pan"]}>
        <option value="select">Select</option>
        <option value="pan">Pan</option>
        <option value="draw">Draw</option>
      </GridraSelect>,
    );

    const select = screen.getByRole("listbox", { name: "Tools" }) as HTMLSelectElement;
    expect(Array.from(select.selectedOptions).map((option) => option.value)).toEqual(["pan"]);

    rerender(
      <GridraSelect aria-label="Tools" multiple onChange={() => {}} value={["select", "draw"]}>
        <option value="select">Select</option>
        <option value="pan">Pan</option>
        <option value="draw">Draw</option>
      </GridraSelect>,
    );

    expect(Array.from(select.selectedOptions).map((option) => option.value)).toEqual(["select", "draw"]);
  });

  it("forwards disabled state to the native select", () => {
    render(
      <GridraSelect aria-label="Locked" defaultValue="a" disabled>
        <option value="a">A</option>
        <option value="b">B</option>
      </GridraSelect>,
    );

    expect((screen.getByRole("combobox", { name: "Locked" }) as HTMLSelectElement).disabled).toBe(true);
  });

  it("supports invalid state while preserving an explicit aria-invalid value", () => {
    render(
      <>
        <GridraSelect aria-label="Invalid" invalid>
          <option>One</option>
        </GridraSelect>
        <GridraSelect aria-invalid="false" aria-label="Override" invalid>
          <option>Two</option>
        </GridraSelect>
      </>,
    );

    expect(screen.getByRole("combobox", { name: "Invalid" }).getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("combobox", { name: "Override" }).getAttribute("aria-invalid")).toBe("false");
  });

  it("forwards form metadata, className, size class, required, and aria-describedby", () => {
    render(
      <GridraSelect
        aria-describedby="tool-help"
        aria-label="Tool"
        className="custom-select"
        data-testid="tool"
        name="tool"
        required
        size="lg"
      >
        <option value="select">Select</option>
      </GridraSelect>,
    );
    const select = screen.getByTestId("tool") as HTMLSelectElement;

    expect(select.getAttribute("aria-describedby")).toBe("tool-help");
    expect(select.name).toBe("tool");
    expect(select.required).toBe(true);
    expect(select.className).toContain("gridra-select--lg");
    expect(select.className).toContain("custom-select");
  });
});
