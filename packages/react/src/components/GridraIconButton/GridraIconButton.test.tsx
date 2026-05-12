import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraIconButton } from "./GridraIconButton";

afterEach(() => {
  cleanup();
});

describe("GridraIconButton", () => {
  it("uses its label as the accessible name and title", () => {
    const onClick = vi.fn();

    render(
      <GridraIconButton label="Zoom in" onClick={onClick} pressed>
        +
      </GridraIconButton>
    );
    const button = screen.getByRole("button", { name: "Zoom in" });

    fireEvent.click(button);

    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("title")).toBe("Zoom in");
    expect(button.className).toContain("gridra-icon-button--pressed");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
