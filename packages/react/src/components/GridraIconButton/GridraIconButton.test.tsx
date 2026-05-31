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

  it("supports size and loading state", () => {
    const onClick = vi.fn();

    render(
      <GridraIconButton label="Refresh" loading onClick={onClick} size="sm" />
    );
    const button = screen.getByRole("button", { name: "Refresh" });

    fireEvent.click(button);

    expect(button.getAttribute("aria-busy")).toBe("true");
    expect((button as HTMLButtonElement).disabled).toBe(true);
    expect(button.className).toContain("gridra-icon-button--sm");
    expect(button.className).toContain("gridra-icon-button--loading");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("uses a label initial when no icon children are provided", () => {
    render(<GridraIconButton label="Zoom" />);
    const button = screen.getByRole("button", { name: "Zoom" });

    expect(button.textContent).toBe("Z");
    expect((button as HTMLButtonElement).type).toBe("button");
  });

  it("preserves explicit title, forwards attributes, and omits pressed semantics by default", () => {
    render(
      <GridraIconButton
        aria-controls="viewport"
        className="custom-icon-button"
        data-testid="fit"
        label="Fit view"
        name="tool"
        title="Zoom to fit"
        value="fit"
        variant="primary"
      />,
    );
    const button = screen.getByTestId("fit") as HTMLButtonElement;

    expect(button.getAttribute("aria-controls")).toBe("viewport");
    expect(button.getAttribute("aria-pressed")).toBeNull();
    expect(button.getAttribute("title")).toBe("Zoom to fit");
    expect(button.name).toBe("tool");
    expect(button.value).toBe("fit");
    expect(button.className).toContain("gridra-icon-button--primary");
    expect(button.className).toContain("custom-icon-button");
  });

  it("does not report clicks while disabled", () => {
    const onClick = vi.fn();

    render(<GridraIconButton disabled label="Delete" onClick={onClick} />);

    fireEvent.click(screen.getByRole("button", { name: "Delete" }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
