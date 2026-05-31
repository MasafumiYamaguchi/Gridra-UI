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

  it("supports controlled value without mutating display before props change", () => {
    const handleChange = vi.fn();
    const { rerender } = render(
      <GridraTextarea aria-label="Notes" onChange={handleChange} value="Draft" />,
    );
    const textarea = screen.getByRole("textbox", { name: "Notes" }) as HTMLTextAreaElement;

    fireEvent.change(textarea, { target: { value: "Published" } });

    expect(textarea.value).toBe("Draft");
    expect(handleChange).toHaveBeenCalledTimes(1);

    rerender(<GridraTextarea aria-label="Notes" onChange={handleChange} value="Published" />);

    expect(textarea.value).toBe("Published");
  });

  it("forwards className, size class, form metadata, and aria-describedby", () => {
    render(
      <GridraTextarea
        aria-describedby="description-help"
        aria-label="Description"
        className="custom-textarea"
        data-testid="description"
        name="description"
        placeholder="Explain changes"
        readOnly
        required
        size="lg"
      />,
    );
    const textarea = screen.getByTestId("description") as HTMLTextAreaElement;

    expect(textarea.getAttribute("aria-describedby")).toBe("description-help");
    expect(textarea.name).toBe("description");
    expect(textarea.placeholder).toBe("Explain changes");
    expect(textarea.readOnly).toBe(true);
    expect(textarea.required).toBe(true);
    expect(textarea.className).toContain("gridra-textarea--lg");
    expect(textarea.className).toContain("custom-textarea");
  });
});
