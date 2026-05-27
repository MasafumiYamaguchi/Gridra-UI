import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraEmptyState } from "./GridraEmptyState";

afterEach(() => {
  cleanup();
});

describe("GridraEmptyState", () => {
  it("renders heading and description", () => {
    render(
      <GridraEmptyState
        description="No results found."
        heading="Nothing here"
      />,
    );
    expect(screen.getByText("Nothing here")).toBeTruthy();
    expect(screen.getByText("No results found.")).toBeTruthy();
  });

  it("renders icon with aria-hidden", () => {
    render(<GridraEmptyState icon={<span>🔍</span>} />);
    const wrapper = document.querySelector(
      ".gridra-empty-state__icon",
    );
    expect(wrapper).toBeTruthy();
    expect(wrapper!.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders primary and secondary action slots", () => {
    render(
      <GridraEmptyState
        primaryAction={<button key="a">Create</button>}
        secondaryAction={<button key="b">Learn more</button>}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Create" }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Learn more" }),
    ).toBeTruthy();
  });

  it("renders children in the body slot", () => {
    render(
      <GridraEmptyState>
        <span>Extra detail</span>
      </GridraEmptyState>,
    );
    expect(screen.getByText("Extra detail")).toBeTruthy();
  });

  it("applies size class", () => {
    const { container } = render(
      <GridraEmptyState size="sm" />,
    );
    expect(container.firstElementChild!.className).toContain(
      "gridra-empty-state--sm",
    );
  });

  it("passes through className and data attributes", () => {
    const { container } = render(
      <GridraEmptyState
        className="custom-empty"
        data-testid="empty"
      />,
    );
    const el = container.firstElementChild!;
    expect(el.className).toContain("custom-empty");
    expect(el.getAttribute("data-testid")).toBe("empty");
  });

  it("does not render actions container when neither action is provided", () => {
    const { container } = render(<GridraEmptyState />);
    expect(
      container.querySelector(".gridra-empty-state__actions"),
    ).toBeNull();
  });
});
