import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraCluster } from "./GridraCluster";

afterEach(() => {
  cleanup();
});

describe("GridraCluster", () => {
  it("renders children with default classes", () => {
    render(<GridraCluster>Content</GridraCluster>);
    const cluster = screen.getByText("Content");

    expect(cluster.tagName.toLowerCase()).toBe("div");
    expect(cluster.className).toContain("gridra-cluster");
    expect(cluster.className).toContain("gridra-cluster--gap-sm");
    expect(cluster.className).toContain("gridra-cluster--align-center");
    expect(cluster.className).toContain("gridra-cluster--justify-start");
    expect(cluster.className).toContain("gridra-box");
    expect(cluster.className).toContain("gridra-box--display-flex");
  });

  it("applies gap, rowGap, align, and justify classes", () => {
    render(
      <GridraCluster align="end" gap="lg" justify="between" rowGap="md">
        Configured
      </GridraCluster>
    );
    const cluster = screen.getByText("Configured");

    expect(cluster.className).toContain("gridra-cluster--gap-lg");
    expect(cluster.className).toContain("gridra-cluster--row-gap-md");
    expect(cluster.className).toContain("gridra-cluster--align-end");
    expect(cluster.className).toContain("gridra-cluster--justify-between");
  });

  it("forwards Box-derived props", () => {
    render(
      <GridraCluster
        border="default"
        fullWidth
        padding="sm"
        radius="md"
        surface="raised"
      >
        BoxProps
      </GridraCluster>
    );
    const cluster = screen.getByText("BoxProps");

    expect(cluster.className).toContain("gridra-box--padding-sm");
    expect(cluster.className).toContain("gridra-box--surface-raised");
    expect(cluster.className).toContain("gridra-box--border-default");
    expect(cluster.className).toContain("gridra-box--radius-md");
    expect(cluster.className).toContain("gridra-box--full-width");
  });

  it("supports semantic as prop", () => {
    render(<GridraCluster as="section">Section</GridraCluster>);
    const cluster = screen.getByText("Section");

    expect(cluster.tagName.toLowerCase()).toBe("section");
  });

  it("forwards className, id, aria-label, data-testid, and style", () => {
    render(
      <GridraCluster
        aria-label="cluster"
        className="custom-cluster"
        data-testid="my-cluster"
        id="cluster-id"
        style={{ color: "blue" }}
      >
        Styled
      </GridraCluster>
    );
    const cluster = screen.getByTestId("my-cluster");

    expect(cluster.className).toContain("gridra-cluster");
    expect(cluster.className).toContain("custom-cluster");
    expect(cluster.id).toBe("cluster-id");
    expect(cluster.getAttribute("aria-label")).toBe("cluster");
    expect((cluster as HTMLElement).style.color).toBe("blue");
  });
});
