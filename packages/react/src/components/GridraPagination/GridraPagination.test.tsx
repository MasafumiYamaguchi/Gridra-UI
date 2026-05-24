import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraPagination } from "./GridraPagination";

afterEach(() => cleanup());

describe("GridraPagination", () => {
  it("renders a navigation landmark with aria-label", () => {
    render(<GridraPagination totalItems={100} />);
    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav.tagName).toBe("NAV");
  });

  it("respects custom aria-label", () => {
    render(<GridraPagination totalItems={100} aria-label="Custom" />);
    expect(screen.getByRole("navigation", { name: "Custom" })).toBeDefined();
  });

  it("renders size class on root", () => {
    render(<GridraPagination totalItems={100} size="sm" />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("gridra-pagination--sm");
  });

  it("passes className to root", () => {
    render(<GridraPagination totalItems={100} className="my-custom" />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("my-custom");
  });

  it("adds classes to major pagination slots", () => {
    const { container } = render(<GridraPagination totalItems={100} />);

    expect(container.querySelector(".gridra-pagination")).toBeTruthy();
    expect(container.querySelector(".gridra-pagination__controls")).toBeTruthy();
    expect(container.querySelector(".gridra-pagination__button")).toBeTruthy();
    expect(container.querySelector(".gridra-pagination__info")).toBeTruthy();
    expect(container.querySelector(".gridra-pagination__page-size")).toBeTruthy();
    expect(container.querySelector(".gridra-pagination__summary")).toBeTruthy();
  });

  it("marks current page with aria-current", () => {
    render(<GridraPagination totalItems={100} defaultPage={3} />);
    const button = screen.getByRole("button", { name: "Page 3" });
    expect(button.getAttribute("aria-current")).toBe("page");
  });

  it("does not mark other pages with aria-current", () => {
    render(<GridraPagination totalItems={100} defaultPage={2} />);
    const button = screen.getByRole("button", { name: "Page 1" });
    expect(button.hasAttribute("aria-current")).toBe(false);
  });

  it("disables previous button on first page", () => {
    render(<GridraPagination totalItems={100} defaultPage={1} />);
    const prev = screen.getByRole("button", { name: "Previous page" }) as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
  });

  it("disables next button on last page", () => {
    render(<GridraPagination totalItems={100} pageSize={10} defaultPage={10} />);
    const next = screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement;
    expect(next.disabled).toBe(true);
  });

  it("disables first button on first page", () => {
    render(<GridraPagination totalItems={100} defaultPage={1} />);
    const first = screen.getByRole("button", { name: "First page" }) as HTMLButtonElement;
    expect(first.disabled).toBe(true);
  });

  it("disables last button on last page", () => {
    render(<GridraPagination totalItems={100} pageSize={10} defaultPage={10} />);
    const last = screen.getByRole("button", { name: "Last page" }) as HTMLButtonElement;
    expect(last.disabled).toBe(true);
  });

  it("calls onPageChange with next and previous on page click", () => {
    const onPageChange = vi.fn();
    render(<GridraPagination totalItems={100} defaultPage={1} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Page 3" }));
    expect(onPageChange).toHaveBeenCalledWith(3, 1);
  });

  it("does not call onPageChange when clicking the current page", () => {
    const onPageChange = vi.fn();
    render(<GridraPagination totalItems={100} defaultPage={3} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Page 3" }));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("calls onPageChange on previous button click", () => {
    const onPageChange = vi.fn();
    render(<GridraPagination totalItems={100} defaultPage={3} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    expect(onPageChange).toHaveBeenCalledWith(2, 3);
  });

  it("calls onPageChange on next button click", () => {
    const onPageChange = vi.fn();
    render(<GridraPagination totalItems={100} defaultPage={2} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenCalledWith(3, 2);
  });

  it("calls onPageChange on first button click", () => {
    const onPageChange = vi.fn();
    render(<GridraPagination totalItems={100} defaultPage={3} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "First page" }));
    expect(onPageChange).toHaveBeenCalledWith(1, 3);
  });

  it("calls onPageChange on last button click", () => {
    const onPageChange = vi.fn();
    render(<GridraPagination totalItems={100} pageSize={10} defaultPage={3} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Last page" }));
    expect(onPageChange).toHaveBeenCalledWith(10, 3);
  });

  it("supports controlled page", () => {
    const onPageChange = vi.fn();
    render(<GridraPagination totalItems={500} page={3} onPageChange={onPageChange} />);
    expect(screen.getByRole("button", { name: "Page 3" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(screen.getByRole("button", { name: "Page 4" }));
    expect(onPageChange).toHaveBeenCalledWith(4, 3);
  });

  it("uses the clamped controlled page as previous when page exceeds pageCount", () => {
    const onPageChange = vi.fn();
    render(<GridraPagination totalItems={50} pageSize={10} page={999} onPageChange={onPageChange} />);

    expect(screen.getByRole("button", { name: "Page 5" }).getAttribute("aria-current")).toBe("page");
    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));

    expect(onPageChange).toHaveBeenCalledWith(4, 5);
  });

  it.each([0, NaN, Infinity])(
    "uses page 1 as previous when controlled page is invalid: %s",
    (invalidPage) => {
      const onPageChange = vi.fn();
      render(<GridraPagination totalItems={100} page={invalidPage} onPageChange={onPageChange} />);

      expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe("page");
      fireEvent.click(screen.getByRole("button", { name: "Page 2" }));

      expect(onPageChange).toHaveBeenCalledWith(2, 1);
    },
  );

  it("supports uncontrolled defaultPage", () => {
    render(<GridraPagination totalItems={100} defaultPage={3} />);
    expect(screen.getByRole("button", { name: "Page 3" }).getAttribute("aria-current")).toBe("page");
  });

  it("clamps page 0 to 1", () => {
    render(<GridraPagination totalItems={100} defaultPage={0} />);
    expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe("page");
  });

  it("clamps negative page to 1", () => {
    render(<GridraPagination totalItems={100} defaultPage={-5} />);
    expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe("page");
  });

  it("clamps page exceeding pageCount to last page", () => {
    render(<GridraPagination totalItems={50} pageSize={10} defaultPage={999} />);
    expect(screen.getByRole("button", { name: "Page 5" }).getAttribute("aria-current")).toBe("page");
  });

  it("does not fire onPageChange when an out-of-range defaultPage clamps to the current page", () => {
    const onPageChange = vi.fn();
    render(<GridraPagination totalItems={50} pageSize={10} defaultPage={999} onPageChange={onPageChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Page 5" }));

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("floors decimal page", () => {
    render(<GridraPagination totalItems={100} defaultPage={3.7} />);
    expect(screen.getByRole("button", { name: "Page 3" }).getAttribute("aria-current")).toBe("page");
  });

  it("handles NaN page", () => {
    render(<GridraPagination totalItems={100} defaultPage={NaN} />);
    expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe("page");
  });

  it("handles Infinity page", () => {
    render(<GridraPagination totalItems={100} defaultPage={Infinity} />);
    expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe("page");
  });

  it("handles page as -Infinity", () => {
    render(<GridraPagination totalItems={100} defaultPage={-Infinity} />);
    expect(screen.getByRole("button", { name: "Page 1" }).getAttribute("aria-current")).toBe("page");
  });

  it("handles negative totalItems", () => {
    render(<GridraPagination totalItems={-10} />);
    const prev = screen.getByRole("button", { name: "Previous page" }) as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
  });

  it("handles NaN totalItems", () => {
    render(<GridraPagination totalItems={NaN} />);
    const prev = screen.getByRole("button", { name: "Previous page" }) as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
  });

  it("handles Infinity totalItems", () => {
    render(<GridraPagination totalItems={Infinity} />);
    const prev = screen.getByRole("button", { name: "Previous page" }) as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
  });

  it("floors decimal totalItems", () => {
    render(<GridraPagination totalItems={100.9} pageSize={25} />);
    const summary = screen.getByText("1\u201325 of 100");
    expect(summary).toBeDefined();
  });

  it("clamps current page when totalItems shrinks after render", () => {
    const { rerender } = render(<GridraPagination totalItems={100} pageSize={10} defaultPage={9} />);

    rerender(<GridraPagination totalItems={30} pageSize={10} defaultPage={9} />);

    expect(screen.getByRole("button", { name: "Page 3" }).getAttribute("aria-current")).toBe("page");
    expect(screen.getByText("21\u201330 of 30")).toBeDefined();
    expect((screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("handles pageSize 0 by falling back to default", () => {
    render(<GridraPagination totalItems={100} defaultPageSize={0} />);
    expect(screen.getByRole("button", { name: "Page 1" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Page 4" })).toBeDefined();
  });

  it("handles negative pageSize by falling back to default", () => {
    render(<GridraPagination totalItems={100} defaultPageSize={-5} />);
    expect(screen.getByRole("button", { name: "Page 4" })).toBeDefined();
  });

  it("handles NaN pageSize by falling back to default", () => {
    render(<GridraPagination totalItems={100} defaultPageSize={NaN} />);
    expect(screen.getByRole("button", { name: "Page 4" })).toBeDefined();
  });

  it("handles Infinity pageSize by falling back to default", () => {
    render(<GridraPagination totalItems={100} defaultPageSize={Infinity} />);
    expect(screen.getByRole("button", { name: "Page 4" })).toBeDefined();
  });

  it("floors decimal pageSize", () => {
    render(<GridraPagination totalItems={105} defaultPageSize={10.9} />);
    expect(screen.getByRole("button", { name: "Page 11" })).toBeDefined();
  });

  it("uses the normalized pageSize prop as previous on pageSize change", () => {
    const onPageSizeChange = vi.fn();
    render(
      <GridraPagination
        totalItems={100}
        pageSize={0}
        onPageSizeChange={onPageSizeChange}
      />,
    );

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "50" } });

    expect(onPageSizeChange).toHaveBeenCalledWith(50, 25);
  });

  it("filters invalid pageSizeOptions", () => {
    render(
      <GridraPagination
        totalItems={100}
        defaultPageSize={25}
        pageSizeOptions={[0, -1, 10, NaN, Infinity, 25, 50]}
      />,
    );
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option"));
    const values = options.map((o) => Number(o.value));
    expect(values).toEqual([10, 25, 50]);
  });

  it("deduplicates pageSizeOptions", () => {
    render(
      <GridraPagination
        totalItems={100}
        defaultPageSize={25}
        pageSizeOptions={[10, 25, 25, 50, 10]}
      />,
    );
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option"));
    const values = options.map((o) => Number(o.value));
    expect(values).toEqual([10, 25, 50]);
  });

  it("deduplicates pageSizeOptions after flooring decimal values", () => {
    render(
      <GridraPagination
        totalItems={100}
        defaultPageSize={25}
        pageSizeOptions={[10.9, 10, 25.2, 25, 50]}
      />,
    );
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option"));
    const values = options.map((o) => Number(o.value));
    expect(values).toEqual([10, 25, 50]);
  });

  it("falls back to default pageSizeOptions when empty after filtering", () => {
    render(
      <GridraPagination
        totalItems={100}
        defaultPageSize={25}
        pageSizeOptions={[0, -1, NaN, Infinity]}
      />,
    );
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option"));
    const values = options.map((o) => Number(o.value));
    expect(values).toEqual([10, 25, 50, 100]);
  });

  it("calls onPageSizeChange and resets page to 1", () => {
    const onPageChange = vi.fn();
    const onPageSizeChange = vi.fn();
    render(
      <GridraPagination
        totalItems={200}
        defaultPage={3}
        defaultPageSize={25}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />,
    );
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "50" } });
    expect(onPageSizeChange).toHaveBeenCalledWith(50, 25);
    expect(onPageChange).toHaveBeenCalledWith(1, 3);
  });

  it("does not fire onPageChange when page is already 1 on pageSize change", () => {
    const onPageChange = vi.fn();
    render(
      <GridraPagination
        totalItems={200}
        defaultPage={1}
        defaultPageSize={25}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />,
    );
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "50" } });
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("supports controlled pageSize", () => {
    render(
      <GridraPagination
        totalItems={200}
        pageSize={50}
        defaultPageSize={25}
      />,
    );
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("50");
  });

  it("shows summary with correct range", () => {
    render(<GridraPagination totalItems={95} pageSize={10} defaultPage={3} />);
    expect(screen.getByText("21\u201330 of 95")).toBeDefined();
  });

  it("shows summary at page boundary", () => {
    render(<GridraPagination totalItems={100} pageSize={25} defaultPage={4} />);
    expect(screen.getByText("76\u2013100 of 100")).toBeDefined();
  });

  it("shows 'No items' when totalItems is 0", () => {
    render(<GridraPagination totalItems={0} />);
    expect(screen.getByText("No items")).toBeDefined();
  });

  it("shows page 1 and boundaries disabled when totalItems is 0", () => {
    render(<GridraPagination totalItems={0} />);
    expect(screen.getByRole("button", { name: "Page 1" })).toBeDefined();
    expect((screen.getByRole("button", { name: "Previous page" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Next page" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("displays ellipsis for large page counts", () => {
    render(<GridraPagination totalItems={500} pageSize={25} defaultPage={10} />);
    const ellipsisElements = document.querySelectorAll(".gridra-pagination__ellipsis");
    expect(ellipsisElements.length).toBeGreaterThan(0);
  });

  it("disables all buttons when disabled prop is true", () => {
    render(<GridraPagination totalItems={100} disabled={true} defaultPage={3} />);
    const buttons = screen.getAllByRole("button");
    for (const button of buttons) {
      expect((button as HTMLButtonElement).disabled).toBe(true);
    }
  });

  it("disables select when disabled prop is true", () => {
    render(<GridraPagination totalItems={100} disabled={true} />);
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.disabled).toBe(true);
  });

  it("does not fire onPageChange when disabled", () => {
    const onPageChange = vi.fn();
    render(<GridraPagination totalItems={100} disabled={true} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Page 2" }));
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("does not fire onPageSizeChange when disabled", () => {
    const onPageSizeChange = vi.fn();
    render(<GridraPagination totalItems={100} disabled={true} onPageSizeChange={onPageSizeChange} />);

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "50" } });

    expect(onPageSizeChange).not.toHaveBeenCalled();
  });

  it("hides first and last buttons when showFirstLast is false", () => {
    render(<GridraPagination totalItems={100} showFirstLast={false} />);
    expect(screen.queryByRole("button", { name: "First page" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Last page" })).toBeNull();
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDefined();
  });

  it("hides page size selector when showPageSize is false", () => {
    render(<GridraPagination totalItems={100} showPageSize={false} />);
    expect(screen.queryByRole("combobox")).toBeNull();
  });

  it("keeps summary based on pageSize when showPageSize is false", () => {
    render(<GridraPagination totalItems={95} pageSize={10} defaultPage={3} showPageSize={false} />);

    expect(screen.queryByRole("combobox")).toBeNull();
    expect(screen.getByText("21\u201330 of 95")).toBeDefined();
  });

  it("hides summary when showSummary is false", () => {
    render(<GridraPagination totalItems={100} showSummary={false} />);
    expect(document.querySelector(".gridra-pagination__summary")).toBeNull();
  });

  it("hides info section when both showPageSize and showSummary are false", () => {
    render(<GridraPagination totalItems={100} showPageSize={false} showSummary={false} />);
    expect(document.querySelector(".gridra-pagination__info")).toBeNull();
  });

  it("accepts a pageSize outside pageSizeOptions", () => {
    render(
      <GridraPagination
        totalItems={300}
        defaultPageSize={30}
        pageSizeOptions={[10, 25, 50, 100]}
      />,
    );
    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option"));
    const values = options.map((o) => Number(o.value));
    expect(values).toContain(30);
  });

  it("computes correct pageCount from totalItems and pageSize", () => {
    render(<GridraPagination totalItems={95} pageSize={10} />);
    expect(screen.getByRole("button", { name: "Page 10" })).toBeDefined();
  });

  it("uses siblingCount and boundaryCount", () => {
    render(<GridraPagination totalItems={500} pageSize={10} siblingCount={0} boundaryCount={1} defaultPage={25} />);
    expect(screen.getByRole("button", { name: "Page 1" })).toBeDefined();
    expect(screen.getByRole("button", { name: "Page 50" })).toBeDefined();
  });

  it("falls back from invalid siblingCount and boundaryCount without breaking pagination", () => {
    render(<GridraPagination totalItems={500} pageSize={10} siblingCount={NaN} boundaryCount={-1} defaultPage={25} />);

    expect(screen.getByRole("button", { name: "Page 25" }).getAttribute("aria-current")).toBe("page");
    expect(document.querySelectorAll(".gridra-pagination__ellipsis").length).toBeGreaterThan(0);
  });
});
