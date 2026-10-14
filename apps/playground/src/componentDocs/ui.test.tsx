import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GRIDRA_BUILT_IN_THEME_NAMES } from "@gridra-ui/react";
import { ComponentDocsPage } from "./ui";
import { componentDocs } from "./data";

vi.mock("./code-block", () => ({
  CodeBlock: ({ code }: { code: string }) => <pre>{code}</pre>,
}));

const scrollTo = vi.fn();
beforeEach(() => {
  scrollTo.mockClear();
  Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: scrollTo });
});

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
  return within(screen.getByRole("article")).getByRole("heading", { level: 2 }).textContent;
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

  it("switches between preview and code with the keyboard", () => {
    renderDocs();
    const preview = screen.getByRole("tab", { name: "preview" });
    expect(screen.getByRole("tabpanel", { name: "preview" })).toBeTruthy();
    fireEvent.keyDown(preview, { key: "ArrowRight" });
    const code = screen.getByRole("tab", { name: "code" });
    expect(code.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(code);
    expect(screen.getByRole("tabpanel", { name: "code" })).toBeTruthy();
    expect(screen.queryByRole("tabpanel", { name: "preview" })).toBeNull();
    fireEvent.click(preview);
    expect(screen.getByRole("tabpanel", { name: "preview" })).toBeTruthy();
  });

  it("changes the preview palette independently of the documentation theme", () => {
    renderDocs();
    fireEvent.click(screen.getByRole("button", { name: "forest preview theme" }));
    const panel = screen.getByRole("tabpanel", { name: "preview" });
    expect(panel.querySelector(".docs-preview__stage")?.classList.contains("gridra-theme-forest")).toBe(true);
    expect(document.querySelector(".docs-root")?.classList.contains("gridra-theme-dark")).toBe(true);
    expect(screen.getByRole("button", { name: "forest preview theme" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("scrolls the reader from the page outline and preserves the component in the URL", () => {
    renderDocs();
    const reader = screen.getByRole("main");
    const props = reader.querySelector<HTMLElement>('[data-section="props"]')!;
    vi.spyOn(reader, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 40, 800, 600));
    vi.spyOn(props, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 640, 700, 500));
    reader.scrollTop = 100;
    fireEvent.click(within(screen.getByRole("navigation", { name: "On this page" })).getByRole("link", { name: "Props" }));
    expect(scrollTo).toHaveBeenCalledWith({ top: 668, behavior: "smooth" });
    expect(window.location.hash).toBe("#docs-GridraBox/props");
    expect(heading()).toBe("GridraBox");
  });

  it("restores a component and section from a direct link", () => {
    renderDocs("#docs-GridraButton/props");
    expect(heading()).toBe("GridraButton");
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "instant" });
    expect(within(screen.getByRole("navigation", { name: "On this page" }))
      .getByRole("link", { name: "Props" }).getAttribute("aria-current")).toBe("location");
  });

  it("moves to the next component and focuses search with Ctrl K", () => {
    renderDocs();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(document.activeElement).toBe(screen.getByRole("searchbox", { name: "Search components" }));
    fireEvent.click(within(screen.getByRole("navigation", { name: "Previous and next components" }))
      .getByRole("button", { name: /Next/ }));
    expect(heading()).toBe("GridraStack");
    expect(window.location.hash).toBe("#docs-GridraStack");
  });
});
