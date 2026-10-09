import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraField } from "./GridraField";
import { GridraInput } from "../GridraInput";
import { GridraSelect } from "../GridraSelect";
import { GridraTextarea } from "../GridraTextarea";
import { GridraSwitch } from "../GridraSwitch";
import { GridraCheckbox } from "../GridraCheckbox";

afterEach(cleanup);

describe("GridraField control composition", () => {
  it("automatically associates labels and passes field state to the control", () => {
    render(<GridraField label="Name" disabled required error="Required value" control={<GridraInput />} />);
    const input = screen.getByRole("textbox", { name: "Name" }) as HTMLInputElement;
    expect(input.disabled).toBe(true);
    expect(input.required).toBe(true);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.getAttribute("aria-describedby")).toBe(screen.getByText("Required value").closest(".gridra-field__error")?.id);
  });

  it("keeps generated ids stable and unique across fields", () => {
    const { rerender } = render(<>
      <GridraField label="First" hint="First hint" control={<GridraInput />} />
      <GridraField label="Second" hint="Second hint" control={<GridraInput />} />
    </>);
    const firstId = screen.getByLabelText("First").id;
    expect(firstId).toBeTruthy();
    expect(firstId).not.toBe(screen.getByLabelText("Second").id);
    rerender(<>
      <GridraField label="First" hint="First hint" control={<GridraInput defaultValue="Updated" />} />
      <GridraField label="Second" hint="Second hint" control={<GridraInput />} />
    </>);
    expect(screen.getByLabelText("First").id).toBe(firstId);
  });

  it("merges external descriptions and replaces generated hint links when errors change", () => {
    const { rerender } = render(<>
      <span id="external">External description</span>
      <GridraField label="Name" hint="Helpful" control={<GridraInput aria-describedby="external external" />} />
    </>);
    const input = screen.getByLabelText("Name");
    const hintId = screen.getByText("Helpful").id;
    expect(input.getAttribute("aria-describedby")).toBe(`external ${hintId}`);
    rerender(<>
      <span id="external">External description</span>
      <GridraField label="Name" hint="Helpful" error="Broken" control={<GridraInput aria-describedby="external" />} />
    </>);
    const errorId = screen.getByText("Broken").closest(".gridra-field__error")?.id;
    expect(input.getAttribute("aria-describedby")).toBe(`external ${errorId}`);
    expect(screen.queryByText("Helpful")).toBeNull();
    rerender(<GridraField label="Name" control={<GridraInput />} />);
    expect(screen.getByLabelText("Name").hasAttribute("aria-describedby")).toBe(false);
    expect(screen.getByLabelText("Name").hasAttribute("aria-invalid")).toBe(false);
  });

  it("preserves explicit control ids, states, ARIA, refs and change handlers", () => {
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    render(<GridraField label="Override" htmlFor="fallback" disabled required error="Broken"
      control={<GridraInput id="explicit" disabled={false} required={false} invalid={false} aria-invalid="false" ref={ref} onChange={onChange} />} />);
    const input = screen.getByLabelText("Override") as HTMLInputElement;
    expect(input.id).toBe("explicit");
    expect(input.disabled).toBe(false);
    expect(input.required).toBe(false);
    expect(input.getAttribute("aria-invalid")).toBe("false");
    expect(ref.current).toBe(input);
    fireEvent.change(input, { target: { value: "Changed" } });
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("supports select, textarea, switches and native inputs without leaking invalid props", () => {
    render(<>
      <GridraField label="Mode" error="Choose mode" control={<GridraSelect defaultValue="a"><option value="a">A</option></GridraSelect>} />
      <GridraField label="Notes" required control={<GridraTextarea />} />
      <GridraField label="Enabled" required control={<GridraSwitch />} />
      <GridraField label="Native" htmlFor="native" error="Invalid native" control={<input />} />
    </>);
    expect(screen.getByRole("combobox", { name: "Mode" }).getAttribute("aria-invalid")).toBe("true");
    expect((screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement).required).toBe(true);
    expect(screen.getByRole("switch", { name: "Enabled" }).getAttribute("aria-required")).toBe("true");
    const native = screen.getByRole("textbox", { name: "Native" });
    expect(native.id).toBe("native");
    expect(native.getAttribute("aria-invalid")).toBe("true");
    expect(native.hasAttribute("invalid")).toBe(false);
  });

  it("preserves the checkbox's own description alongside the field hint", () => {
    render(<GridraField label="Accept" hint="Field hint" control={<GridraCheckbox description="Control description" />} />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept" });
    expect(checkbox.getAttribute("aria-describedby")?.split(" ")).toEqual([
      screen.getByText("Control description").id,
      screen.getByText("Field hint").id,
    ]);
  });

  it("respects explicit string false for aria-required on switches", () => {
    const { container } = render(<GridraField label="Optional" required control={<GridraSwitch aria-required="false" />} />);
    expect(screen.getByRole("switch", { name: "Optional" }).getAttribute("aria-required")).toBe("false");
    expect(container.querySelector(".gridra-field__required")).toBeNull();
  });
});
