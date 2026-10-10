import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GRIDRA_BUILT_IN_THEME_NAMES } from "@gridra-ui/react";
import { ComponentDocsPage } from "./ui";
import { componentDocs } from "./data";

vi.mock("./code-block", () => ({
  CodeBlock: ({ code }: { code: string }) => <pre>{code}</pre>,
}));

afterEach(() => {
  cleanup();
  window.history.replaceState(null, "", "/");
});

function renderDocs(hash = "") {
  window.history.replaceState(null, "", `/docs${hash}`);
  render(<ComponentDocsPage theme={GRIDRA_BUILT_IN_THEME_NAMES[0]} onThemeChange={vi.fn()} />);
  return within(screen.getByRole("navigation", { name: "Component documentation" }));
}

function heading() {
  return screen.getByRole("heading", { level: 2 }).textContent;
}

describe("documentation navigation", () => {
  it("puts every category in the tree and expands branches without changing the document", () => {
    const nav = renderDocs();
    const initialHeading = heading();
    for (const category of new Set(componentDocs.map((doc) => doc.category))) {
      expect(nav.getByText(category)).toBeTruthy();
    }
    fireEvent.click(nav.getByText("Controls"));
    expect(nav.getByText("GridraButton")).toBeTruthy();
    expect(heading()).toBe(initialHeading);
    expect(window.location.hash).toBe("");
    fireEvent.click(nav.getByText("GridraButton"));
    expect(heading()).toBe("GridraButton");
    expect(window.location.hash).toBe("#docs-GridraButton");
    expect(nav.getByText("GridraButton").closest("[aria-current]")?.getAttribute("aria-current")).toBe("page");
  });

  it("opens the category containing a directly linked document", () => {
    const nav = renderDocs("#docs-GridraButton");
    expect(heading()).toBe("GridraButton");
    expect(nav.getByText("GridraButton")).toBeTruthy();
    expect(nav.getByText("Controls").closest("[role=treeitem]")?.getAttribute("aria-expanded")).toBe("true");
  });

  it("reveals search results across categories and restores browsing expansion after clearing search", () => {
    const nav = renderDocs();
    const search = screen.getByRole("searchbox", { name: "Search components" });
    fireEvent.change(search, { target: { value: "button" } });
    expect(nav.getByText("GridraButton")).toBeTruthy();
    expect(nav.getByText("GridraIconButton")).toBeTruthy();
    expect(nav.queryByText("Layout")).toBeNull();
    expect(heading()).toBe("GridraBox");
    fireEvent.change(search, { target: { value: "Overlays" } });
    expect(nav.getByText("GridraDialog")).toBeTruthy();
    fireEvent.change(search, { target: { value: "no-such-component" } });
    expect(nav.getByText("No matches")).toBeTruthy();
    expect(heading()).toBe("GridraBox");
    fireEvent.change(search, { target: { value: "" } });
    expect(nav.getByText("GridraBox")).toBeTruthy();
    expect(nav.queryByText("GridraButton")).toBeNull();
  });

  it("expands and collapses all categories and supports keyboard activation", () => {
    const nav = renderDocs();
    fireEvent.click(nav.getByRole("button", { name: "Expand all" }));
    for (const doc of componentDocs) expect(nav.getByText(doc.name)).toBeTruthy();
    fireEvent.click(nav.getByRole("button", { name: "Collapse all" }));
    expect(nav.queryByText("GridraBox")).toBeNull();
    fireEvent.keyDown(nav.getByText("Controls").closest(".gridra-tree-view__row")!, { key: "Enter" });
    fireEvent.keyDown(nav.getByText("GridraButton").closest(".gridra-tree-view__row")!, { key: " " });
    expect(heading()).toBe("GridraButton");
  });

  it("closes mobile navigation after choosing a component", () => {
    const nav = renderDocs();
    fireEvent.click(screen.getByRole("button", { name: "Browse components" }));
    expect(screen.getByRole("button", { name: "Hide navigation" }).getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(nav.getByText("Controls"));
    fireEvent.click(nav.getByText("GridraButton"));
    expect(screen.getByRole("button", { name: "Browse components" }).getAttribute("aria-expanded")).toBe("false");
  });
});
