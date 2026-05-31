import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraList } from "./GridraList";

afterEach(() => {
  cleanup();
});

describe("GridraList", () => {
  it("renders an unordered list with item data", () => {
    render(<GridraList items={["Alpha", "Beta"]} />);
    const list = screen.getByRole("list");

    expect(list.tagName).toBe("UL");
    expect(list.className).toContain("gridra-list--md");
    expect(list.className).toContain("gridra-list--normal");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("supports ordered rendering, classes, and passthrough attributes", () => {
    render(
      <GridraList
        aria-label="Deploy steps"
        as="ol"
        className="custom-list"
        data-testid="list"
        dividers
        marker="none"
        size="sm"
        spacing="compact"
        style={{ maxHeight: 120 }}
      >
        <li>Build</li>
      </GridraList>
    );
    const list = screen.getByTestId("list");

    expect(list.tagName).toBe("OL");
    expect(list.getAttribute("aria-label")).toBe("Deploy steps");
    expect(list.className).toContain("custom-list");
    expect(list.className).toContain("gridra-list--dividers");
    expect(list.className).toContain("gridra-list--marker-none");
    expect(list.className).toContain("gridra-list--sm");
    expect((list as HTMLElement).style.maxHeight).toBe("120px");
  });

  it("does not add button or status semantics by default", () => {
    render(<GridraList items={["Passive"]} />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("prefers items over children when both are provided", () => {
    render(
      <GridraList items={["From items"]}>
        <li>From children</li>
      </GridraList>,
    );

    expect(screen.getByText("From items")).toBeDefined();
    expect(screen.queryByText("From children")).toBeNull();
  });

  it("keeps explicit child list items untouched", () => {
    render(
      <GridraList>
        <li data-testid="custom-item">Custom</li>
      </GridraList>,
    );

    expect(screen.getByTestId("custom-item").className).toBe("");
  });
});
