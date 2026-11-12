import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { getGridraSwitchProps } from "./getGridraSwitchProps";

afterEach(cleanup);

it("emits the next controlled value without changing checked", () => {
  const change = vi.fn();
  render(
    <button
      {...getGridraSwitchProps({ checked: false, onCheckedChange: change })}
    >
      Toggle
    </button>,
  );

  fireEvent.click(screen.getByRole("switch"));

  expect(change).toHaveBeenCalledWith(true);
  expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("false");
});

it("honors cancellation and disabled", () => {
  const change = vi.fn();
  const { rerender } = render(
    <button
      {...getGridraSwitchProps({
        onCheckedChange: change,
        onClick: (e) => e.preventDefault(),
      })}
    />,
  );

  fireEvent.click(screen.getByRole("switch"));
  rerender(
    <button
      {...getGridraSwitchProps({ onCheckedChange: change, disabled: true })}
    />,
  );
  fireEvent.click(screen.getByRole("switch"));

  expect(change).not.toHaveBeenCalled();
});
