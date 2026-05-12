import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraButton } from "./GridraButton";

afterEach(() => {
  cleanup();
});

describe("GridraButton", () => {
  it("reports clicks", () => {
    const onClick = vi.fn();

    render(<GridraButton onClick={onClick}>Run</GridraButton>);
    fireEvent.click(screen.getByRole("button", { name: "Run" }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("supports disabled and pressed states", () => {
    const onClick = vi.fn();

    render(
      <GridraButton disabled onClick={onClick} pressed>
        Select
      </GridraButton>
    );
    const button = screen.getByRole("button", { name: "Select" });

    fireEvent.click(button);

    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.className).toContain("gridra-button--pressed");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("supports size, full width, and loading state", () => {
    const onClick = vi.fn();

    render(
      <GridraButton fullWidth loading onClick={onClick} size="lg">
        Save
      </GridraButton>
    );
    const button = screen.getByRole("button", { name: "Save" });

    fireEvent.click(button);

    expect(button.getAttribute("aria-busy")).toBe("true");
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.className).toContain("gridra-button--lg");
    expect(button.className).toContain("gridra-button--full-width");
    expect(button.className).toContain("gridra-button--loading");
    expect(onClick).not.toHaveBeenCalled();
  });
});
