import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraSelectableGrid } from "./GridraSelectableGrid";

afterEach(() => {
  cleanup();
});

describe("GridraSelectableGrid", () => {
  it("renders items as buttons", () => {
    render(
      <GridraSelectableGrid
        items={[
          { id: "a", label: "Alpha" },
          { id: "b", label: "Beta" }
        ]}
      />
    );

    expect(screen.getByRole("button", { name: "Alpha" })).not.toBeNull();
    expect(screen.getByRole("button", { name: "Beta" })).not.toBeNull();
  });

  it("supports uncontrolled selection", () => {
    render(<GridraSelectableGrid items={[{ id: "a", label: "Alpha" }]} />);

    const item = screen.getByRole("button", { name: "Alpha" });
    fireEvent.click(item);

    expect(item.getAttribute("aria-selected")).toBe("true");
  });

  it("reports controlled selection changes", () => {
    const changes: Array<string | null> = [];

    render(
      <GridraSelectableGrid
        items={[{ id: "a", label: "Alpha" }]}
        onSelectionChange={(selectedId) => changes.push(selectedId)}
        selectedId={null}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Alpha" }));

    expect(changes).toEqual(["a"]);
  });

  it("keeps gridra-grid root class in empty state", () => {
    const { container } = render(<GridraSelectableGrid items={[]} />);
    const grid = container.querySelector(".gridra-grid");
    const empty = container.querySelector(".gridra-grid__empty");

    expect(grid).not.toBeNull();
    expect(empty).not.toBeNull();
    expect(empty?.parentElement?.classList.contains("gridra-grid")).toBe(true);
  });

  it("passes selected state to renderItem", () => {
    const states: boolean[] = [];

    render(
      <GridraSelectableGrid
        defaultSelectedId="a"
        items={[{ id: "a", label: "Alpha" }]}
        renderItem={(item, state) => {
          states.push(state.selected);
          return item.label;
        }}
      />
    );

    expect(states).toContain(true);
  });
});
