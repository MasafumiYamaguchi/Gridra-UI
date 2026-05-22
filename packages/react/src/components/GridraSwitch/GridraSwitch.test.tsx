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
});
