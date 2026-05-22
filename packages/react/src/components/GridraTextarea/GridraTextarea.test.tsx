import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraTextarea } from "./GridraTextarea";

afterEach(() => {
  cleanup();
});

describe("GridraTextarea", () => {
  it("forwards changes and textarea attributes", () => {
    const handleChange = vi.fn();

    render(
      <GridraTextarea
        aria-label="Description"
        defaultValue="Draft"
        maxLength={20}
        onChange={handleChange}
        rows={4}
      />,
    );

    const textarea = screen.getByRole("textbox", { name: "Description" }) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "Updated" } });

    expect(textarea.value).toBe("Updated");
    expect(textarea.maxLength).toBe(20);
    expect(textarea.rows).toBe(4);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("supports invalid state while preserving an explicit aria-invalid value", () => {
    render(
      <>
        <GridraTextarea aria-label="Invalid" invalid />
        <GridraTextarea aria-invalid="false" aria-label="Override" invalid />
      </>,
    );

    expect(screen.getByRole("textbox", { name: "Invalid" }).getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByRole("textbox", { name: "Override" }).getAttribute("aria-invalid")).toBe("false");
  });

  it("forwards disabled state to the native textarea", () => {
    render(<GridraTextarea aria-label="Locked" disabled />);

    expect((screen.getByRole("textbox", { name: "Locked" }) as HTMLTextAreaElement).disabled).toBe(true);
  });
});
