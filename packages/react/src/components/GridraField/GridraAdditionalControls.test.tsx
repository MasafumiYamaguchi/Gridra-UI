import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { MouseEvent } from "react";
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

  it("supports textarea size class", () => {
    render(<GridraTextarea aria-label="Large notes" invalid size="lg" />);
    const textarea = screen.getByRole("textbox", { name: "Large notes" });

    expect(textarea.className).toContain("gridra-textarea--lg");
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
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

  it("supports checkbox and radio description, size, and invalid state", () => {
    render(
      <>
        <GridraCheckbox description="Aligns to grid" invalid label="Snap" size="lg" />
        <GridraRadio description="Dense controls" invalid label="Compact" name="density" size="sm" />
      </>
    );
    const checkbox = screen.getByRole("checkbox", { name: "Snap" });
    const radio = screen.getByRole("radio", { name: "Compact" });
    const checkboxDescription = screen.getByText("Aligns to grid");
    const radioDescription = screen.getByText("Dense controls");

    expect(checkbox.getAttribute("aria-invalid")).toBe("true");
    expect(checkbox.getAttribute("aria-describedby")).toBe(checkboxDescription.id);
    expect(checkbox.closest(".gridra-checkbox")?.className).toContain("gridra-checkbox--lg");
    expect(checkbox.closest(".gridra-checkbox")?.className).toContain("gridra-checkbox--invalid");
    expect(radio.getAttribute("aria-invalid")).toBe("true");
    expect(radio.getAttribute("aria-describedby")).toBe(radioDescription.id);
    expect(radio.closest(".gridra-radio")?.className).toContain("gridra-radio--sm");
    expect(checkboxDescription.className).toContain("gridra-checkbox__description");
    expect(radioDescription.className).toContain("gridra-radio__description");
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

  it("reports switch checked changes and supports invalid description", () => {
    const onCheckedChange = vi.fn();
    const onPreventedClick = vi.fn((event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    });

    render(
      <>
        <GridraSwitch
          description="Shows temporary state"
          invalid
          label="Preview"
          onCheckedChange={onCheckedChange}
          size="lg"
        />
        <GridraSwitch checked label="Locked" onCheckedChange={onCheckedChange} onClick={onPreventedClick} />
      </>
    );

    const preview = screen.getByRole("switch", { name: "Preview Shows temporary state" });
    const locked = screen.getByRole("switch", { name: "Locked" });

    fireEvent.click(preview);
    fireEvent.click(locked);

    expect(preview.getAttribute("aria-invalid")).toBe("true");
    expect(preview.className).toContain("gridra-switch--lg");
    expect(preview.className).toContain("gridra-switch--invalid");
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(onPreventedClick).toHaveBeenCalledTimes(1);
  });

  it("renders slider value with a formatter", () => {
    render(
      <GridraSlider
        aria-label="Opacity"
        defaultValue="40"
        showValue
        size="lg"
        valueFormatter={(value) => `${value}%`}
      />
    );
    const slider = screen.getByRole("slider", { name: "Opacity" });

    fireEvent.change(slider, { target: { value: "72" } });

    expect(slider.className).toContain("gridra-slider--lg");
    expect(screen.getByText("72%").className).toContain("gridra-slider-field__value");
  });
});

describe("additional Gridra display primitives", () => {
  it("renders label, badge, avatar, spinner, and divider contracts", () => {
    render(
      <>
        <GridraLabel htmlFor="density">Density</GridraLabel>
        <GridraBadge shape="pill" size="sm" tone="success">Live</GridraBadge>
        <GridraAvatar fallback="AB" shape="circle" size="lg" />
        <GridraSpinner label="Saving" />
        <GridraDivider orientation="vertical" />
      </>
    );

    expect(screen.getByText("Density").className).toContain("gridra-label");
    expect(screen.getByText("Live").className).toContain("gridra-badge--success");
    expect(screen.getByText("Live").className).toContain("gridra-badge--pill");
    expect(screen.getByText("Live").className).toContain("gridra-badge--sm");
    expect(screen.getByText("AB").parentElement?.className).toContain("gridra-avatar--circle");
    expect(screen.getByText("AB").parentElement?.className).toContain("gridra-avatar--lg");
    expect(screen.getByRole("status", { name: "Saving" })).toBeTruthy();
    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("vertical");
  });

  it("supports spinner size, tone, speed, and divider options", () => {
    render(
      <>
        <GridraSpinner label="Syncing" size={32} speed="fast" tone="accent" />
        <GridraDivider inset spacing="lg" tone="strong" />
      </>
    );
    const spinner = screen.getByRole("status", { name: "Syncing" });
    const divider = screen.getByRole("separator");

    expect(spinner.className).toContain("gridra-spinner--accent");
    expect(spinner.className).toContain("gridra-spinner--fast");
    expect(spinner.getAttribute("style")).toContain("--gridra-spinner-size: 32px");
    expect(divider.className).toContain("gridra-divider--strong");
    expect(divider.className).toContain("gridra-divider--lg");
    expect(divider.className).toContain("gridra-divider--inset");
  });

  it("supports avatar image, custom size, and monochrome styling hooks", () => {
    render(
      <GridraAvatar
        alt="Profile"
        monochrome
        shape="rounded"
        size={36}
        src="https://example.com/avatar.png"
      />
    );
    const image = screen.getByRole("img", { name: "Profile" });
    const avatar = image.parentElement;

    expect(image.getAttribute("src")).toBe("https://example.com/avatar.png");
    expect(avatar?.className).toContain("gridra-avatar--rounded");
    expect(avatar?.className).toContain("gridra-avatar--monochrome");
    expect(avatar?.getAttribute("style")).toContain("--gridra-avatar-size: 36px");
  });
});
