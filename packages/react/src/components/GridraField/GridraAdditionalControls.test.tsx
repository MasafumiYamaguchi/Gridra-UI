import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraAvatar } from "../GridraAvatar";
import { GridraBadge } from "../GridraBadge";
import { GridraCheckbox } from "../GridraCheckbox";
import { GridraDivider } from "../GridraDivider";
import { GridraLabel } from "../GridraLabel";
import { GridraRadio } from "../GridraRadio";
import { GridraSlider } from "../GridraSlider";
import { GridraSpinner } from "../GridraSpinner";
import { GridraSwitch } from "../GridraSwitch";
import { GridraTextarea } from "../GridraTextarea";

afterEach(() => {
  cleanup();
});

describe("additional Gridra form controls", () => {
  it("renders textarea changes and invalid state", () => {
    const onChange = vi.fn();

    render(
      <GridraTextarea
        aria-invalid="true"
        aria-label="Description"
        defaultValue="Draft"
        onChange={onChange}
      />
    );
    const textarea = screen.getByRole("textbox", { name: "Description" });

    fireEvent.change(textarea, { target: { value: "Updated" } });

    expect(textarea.getAttribute("aria-invalid")).toBe("true");
    expect((textarea as HTMLTextAreaElement).value).toBe("Updated");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("supports checkbox and radio labels", () => {
    render(
      <>
        <GridraCheckbox defaultChecked label="Snap" />
        <GridraRadio label="Grid" name="mode" value="grid" />
      </>
    );

    expect((screen.getByRole("checkbox", { name: "Snap" }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole("radio", { name: "Grid" }) as HTMLInputElement).checked).toBe(false);
  });

  it("reports switch and slider interaction", () => {
    const onSwitchClick = vi.fn();
    const onSliderChange = vi.fn();

    render(
      <>
        <GridraSwitch checked label="Guides" onClick={onSwitchClick} />
        <GridraSlider
          aria-label="Opacity"
          defaultValue="40"
          max={100}
          onChange={onSliderChange}
        />
      </>
    );

    const switchControl = screen.getByRole("switch", { name: "Guides" });
    const slider = screen.getByRole("slider", { name: "Opacity" });

    fireEvent.click(switchControl);
    fireEvent.change(slider, { target: { value: "75" } });

    expect(switchControl.getAttribute("aria-checked")).toBe("true");
    expect((slider as HTMLInputElement).value).toBe("75");
    expect(onSwitchClick).toHaveBeenCalledTimes(1);
    expect(onSliderChange).toHaveBeenCalledTimes(1);
  });
});

describe("additional Gridra display primitives", () => {
  it("renders label, badge, avatar, spinner, and divider contracts", () => {
    render(
      <>
        <GridraLabel htmlFor="density">Density</GridraLabel>
        <GridraBadge tone="accent">Live</GridraBadge>
        <GridraAvatar fallback="AB" />
        <GridraSpinner label="Saving" />
        <GridraDivider orientation="vertical" />
      </>
    );

    expect(screen.getByText("Density").className).toContain("gridra-label");
    expect(screen.getByText("Live").className).toContain("gridra-badge--accent");
    expect(screen.getByText("AB").className).toContain("gridra-avatar__fallback");
    expect(screen.getByRole("status", { name: "Saving" })).toBeTruthy();
    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("vertical");
  });
});
