import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { MouseEvent } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraSwitch } from "./GridraSwitch";

afterEach(() => {
  cleanup();
});

describe("GridraSwitch", () => {
  it("reports the next checked value without mutating controlled state", () => {
    const handleCheckedChange = vi.fn();

    render(
      <GridraSwitch
        checked={false}
        label="Preview"
        onCheckedChange={handleCheckedChange}
      />,
    );

    const control = screen.getByRole("switch", { name: "Preview" });
    fireEvent.click(control);

    expect(control.getAttribute("aria-checked")).toBe("false");
    expect(handleCheckedChange).toHaveBeenCalledWith(true);
  });

  it("skips checked changes when click is prevented", () => {
    const handleCheckedChange = vi.fn();
    const handleClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    });

    render(
      <GridraSwitch
        checked
        label="Locked"
        onCheckedChange={handleCheckedChange}
        onClick={handleClick}
      />,
    );

    fireEvent.click(screen.getByRole("switch", { name: "Locked" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it("does not emit checked changes when disabled", () => {
    const handleCheckedChange = vi.fn();

    render(
      <GridraSwitch
        disabled
        label="Disabled"
        onCheckedChange={handleCheckedChange}
      />,
    );

    fireEvent.click(screen.getByRole("switch", { name: "Disabled" }));

    expect(handleCheckedChange).not.toHaveBeenCalled();
  });

  it("defaults to type button and preserves explicit type", () => {
    const { rerender } = render(<GridraSwitch label="Preview" />);

    expect((screen.getByRole("switch", { name: "Preview" }) as HTMLButtonElement).type).toBe("button");

    rerender(<GridraSwitch label="Preview" type="submit" />);

    expect((screen.getByRole("switch", { name: "Preview" }) as HTMLButtonElement).type).toBe("submit");
  });

  it("forwards button attributes, size class, invalid state, and checked styling", () => {
    render(
      <GridraSwitch
        aria-describedby="preview-help"
        checked
        className="custom-switch"
        data-testid="preview"
        invalid
        label="Preview"
        name="preview"
        size="lg"
        value="enabled"
      />,
    );
    const control = screen.getByTestId("preview") as HTMLButtonElement;

    expect(control.getAttribute("aria-checked")).toBe("true");
    expect(control.getAttribute("aria-describedby")).toBe("preview-help");
    expect(control.getAttribute("aria-invalid")).toBe("true");
    expect(control.name).toBe("preview");
    expect(control.value).toBe("enabled");
    expect(control.className).toContain("gridra-switch--lg");
    expect(control.className).toContain("gridra-switch--checked");
    expect(control.className).toContain("gridra-switch--invalid");
    expect(control.className).toContain("custom-switch");
  });
});
