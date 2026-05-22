import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraSlider } from "./GridraSlider";

afterEach(() => {
  cleanup();
});

describe("GridraSlider", () => {
  it("updates the displayed uncontrolled value", () => {
    render(<GridraSlider aria-label="Opacity" defaultValue="25" showValue />);

    const slider = screen.getByRole("slider", { name: "Opacity" });
    fireEvent.change(slider, { target: { value: "75" } });

    expect((slider as HTMLInputElement).value).toBe("75");
    expect(screen.getByText("75")).toBeTruthy();
  });

  it("derives initial display from min and omits wrapper when showValue is false", () => {
    const { unmount } = render(<GridraSlider aria-label="Columns" min={2} showValue />);

    expect(screen.getByText("2")).toBeTruthy();

    unmount();
    render(<GridraSlider aria-label="Columns" />);

    expect(document.querySelector(".gridra-slider-field")).toBeNull();
  });

  it("keeps controlled value display stable until value changes", () => {
    const formatter = vi.fn((value: number) => `${value}%`);
    const { rerender } = render(
      <GridraSlider
        aria-label="Opacity"
        onChange={() => {}}
        showValue
        value={40}
        valueFormatter={formatter}
      />,
    );

    const slider = screen.getByRole("slider", { name: "Opacity" });
    fireEvent.change(slider, { target: { value: "90" } });

    expect(screen.getByText("40%")).toBeTruthy();
    expect(formatter).toHaveBeenLastCalledWith(40);

    rerender(
      <GridraSlider
        aria-label="Opacity"
        showValue
        value={90}
        valueFormatter={formatter}
      />,
    );

    expect(screen.getByText("90%")).toBeTruthy();
  });
});
