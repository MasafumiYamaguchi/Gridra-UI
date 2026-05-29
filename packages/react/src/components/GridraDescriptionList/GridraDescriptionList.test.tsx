import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraDescriptionList } from "./GridraDescriptionList";

afterEach(() => {
  cleanup();
});

describe("GridraDescriptionList", () => {
  it("renders terms and descriptions from items", () => {
    render(
      <GridraDescriptionList
        items={[
          { term: "Owner", description: "Design systems" },
          { term: "Status", description: "Ready" },
        ]}
      />
    );
    const list = screen.getByText("Owner").closest("dl");

    expect(list?.className).toContain("gridra-description-list");
    expect(list?.className).toContain("gridra-description-list--normal");
    expect(screen.getByText("Owner").tagName).toBe("DT");
    expect(screen.getByText("Design systems").tagName).toBe("DD");
  });

  it("supports custom children, density, className, and attributes", () => {
    render(
      <GridraDescriptionList
        aria-label="Metadata"
        className="custom-description-list"
        data-testid="description-list"
        density="compact"
        style={{ width: 240 }}
      >
        <dt>Region</dt>
        <dd>US</dd>
      </GridraDescriptionList>
    );
    const list = screen.getByTestId("description-list");

    expect(list.getAttribute("aria-label")).toBe("Metadata");
    expect(list.className).toContain("custom-description-list");
    expect(list.className).toContain("gridra-description-list--compact");
    expect((list as HTMLElement).style.width).toBe("240px");
  });

  it("does not add button or status semantics by default", () => {
    render(<GridraDescriptionList items={[{ term: "Mode", description: "Passive" }]} />);

    expect(screen.getByText("Mode").closest("dl")?.getAttribute("role")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });
});
