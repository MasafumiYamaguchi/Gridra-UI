import { createRef } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraSidebarToggle } from "../../index";

afterEach(cleanup);

describe("GridraSidebarToggle", () => {
  it("toggles uncontrolled state and reports next and previous values", () => {
    const onOpenChange = vi.fn();
    render(<GridraSidebarToggle onOpenChange={onOpenChange} />);
    const button = screen.getByRole("button", { name: "Open sidebar" });
    expect(button.getAttribute("type")).toBe("button");
    fireEvent.click(button);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.getAttribute("aria-label")).toBe("Close sidebar");
    expect(onOpenChange).toHaveBeenLastCalledWith(true, false);
    fireEvent.click(button);
    expect(onOpenChange).toHaveBeenLastCalledWith(false, true);
    expect(button.querySelectorAll('[aria-hidden="true"]')).toHaveLength(3);
  });

  it("uses defaultOpen only to initialize state", () => {
    const { rerender } = render(<GridraSidebarToggle defaultOpen />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    rerender(<GridraSidebarToggle defaultOpen />);
    expect(button.getAttribute("aria-expanded")).toBe("false");
  });

  it("waits for the owner to accept a controlled update", () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<GridraSidebarToggle open={false} onOpenChange={onOpenChange} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(onOpenChange).toHaveBeenCalledWith(true, false);
    expect(button.getAttribute("aria-expanded")).toBe("false");
    rerender(<GridraSidebarToggle open onOpenChange={onOpenChange} />);
    expect(button.getAttribute("aria-expanded")).toBe("true");
  });

  it("forwards native button attributes, styles, events and refs", () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn();
    render(<GridraSidebarToggle ref={ref} aria-label="Navigation" aria-controls="navigation"
      title="Browse" id="toggle" data-testid="toggle" className="custom" style={{ margin: 4 }} onClick={onClick} />);
    const button = screen.getByRole("button", { name: "Navigation" });
    expect(ref.current).toBe(button);
    expect(button.id).toBe("toggle");
    expect(button.getAttribute("aria-controls")).toBe("navigation");
    expect(button.classList.contains("gridra-sidebar-toggle")).toBe(true);
    expect(button.classList.contains("custom")).toBe(true);
    expect(button.style.margin).toBe("4px");
    button.focus();
    fireEvent.click(button);
    expect(document.activeElement).toBe(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not toggle when the caller prevents the click", () => {
    const onOpenChange = vi.fn();
    render(<GridraSidebarToggle onClick={(event) => event.preventDefault()} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("keeps a disabled toggle inert", () => {
    const onOpenChange = vi.fn();
    const onClick = vi.fn();
    render(<GridraSidebarToggle disabled onClick={onClick} onOpenChange={onOpenChange} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(onClick).not.toHaveBeenCalled();
  });
});
