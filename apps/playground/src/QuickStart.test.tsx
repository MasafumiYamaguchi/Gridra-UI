import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import QuickStart from "./QuickStart";

afterEach(cleanup);

it("updates the controlled quick-start slider and split panes", () => {
  render(<QuickStart />);
  const slider = screen.getByRole("slider", { name: "Opacity" });
  fireEvent.change(slider, { target: { value: "80" } });
  expect((slider as HTMLInputElement).value).toBe("80");
  expect(screen.getByText("80%")).toBeTruthy();
  const [first, second] = screen.getAllByRole("separator");
  first.focus();
  fireEvent.keyDown(first, { key: "ArrowRight" });
  expect(first.getAttribute("aria-valuenow")).toBe("32");
  expect(second.getAttribute("aria-valuenow")).toBe("70");
  expect(document.activeElement).toBe(first);
});
