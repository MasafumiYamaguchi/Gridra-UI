import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GRIDRA_BUILT_IN_THEME_NAMES } from "@gridra-ui/react";
import { ComponentDocsPage } from "./ui";
import { componentDocs } from "./data";

vi.mock("./code-block", () => ({
  CodeBlock: ({ code }: { code: string }) => <pre>{code}</pre>,
}));

const scrollTo = vi.fn();
let mobile = false;
const mediaListeners = new Set<() => void>();
function resizeMobile(matches: boolean) {
  act(() => { mobile = matches; mediaListeners.forEach((listener) => listener()); });
}

beforeEach(() => {
  mobile = false;
  mediaListeners.clear();
  vi.stubGlobal("matchMedia", (query: string) => ({
    get matches() { return query === "(max-width: 760px)" && mobile; },
    addEventListener: (_: string, listener: () => void) => mediaListeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => mediaListeners.delete(listener),
  }));
  // jsdomにはnative dialogの操作がないため、開閉属性と初期focusだけを補う。
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value: function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
    this.querySelector<HTMLButtonElement>("button")?.focus();
  } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: function (this: HTMLDialogElement) { this.removeAttribute("open"); } });
  scrollTo.mockClear();
  Object.defineProperty(HTMLElement.prototype, "scrollTo", { configurable: true, value: scrollTo });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  document.body.style.overflow = "";
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

function renderMobileDocs() {
  mobile = true;
  window.history.replaceState(null, "", "/docs#docs-GridraButton");
  return render(<ComponentDocsPage theme="dark" onThemeChange={vi.fn()} />);
}

function openNavigation() {
  const trigger = screen.getByRole("button", { name: "Open navigation" });
  trigger.focus();
  fireEvent.click(trigger);
  return screen.getByRole("dialog", { name: "Documentation navigation" });
}

describe("mobile documentation drawer", () => {
  it("opens and closes repeatedly, restoring focus and the previous scroll style", () => {
    document.body.style.overflow = "clip";
    renderMobileDocs();
    const trigger = screen.getByRole("button", { name: "Open navigation" });
    expect(screen.queryByRole("navigation", { name: "Component documentation" })).toBeNull();
    for (let count = 0; count < 3; count++) {
      const dialog = openNavigation();
      expect(trigger.getAttribute("aria-expanded")).toBe("true");
      expect(trigger.getAttribute("aria-controls")).toBe(dialog.id);
      expect(document.body.style.overflow).toBe("hidden");
      expect(document.activeElement).toBe(screen.getByRole("button", { name: "Close navigation" }));
      fireEvent.click(screen.getByRole("button", { name: "Close navigation" }));
      expect(screen.queryByRole("dialog")).toBeNull();
      expect(trigger.getAttribute("aria-expanded")).toBe("false");
      expect(document.body.style.overflow).toBe("clip");
      expect(document.activeElement).toBe(trigger);
    }
  });

  it.each(["backdrop", "Escape"])("dismisses via %s", (method) => {
    renderMobileDocs();
    const dialog = openNavigation();
    if (method === "backdrop") fireEvent.click(dialog);
    else fireEvent(dialog, new Event("cancel", { bubbles: false, cancelable: true }));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Open navigation" }));
  });

  it("closes searched navigation, focuses the destination, and retains the query when reopened", () => {
    renderMobileDocs();
    openNavigation();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "splitpane" } });
    fireEvent.click(within(screen.getByRole("navigation", { name: "Component documentation" })).getByText("GridraSplitPane"));
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.activeElement).toBe(within(screen.getByRole("article")).getByRole("heading", { level: 2 }));
    expect(window.location.hash).toBe("#docs-GridraSplitPane");
    expect(document.body.style.overflow).toBe("");
    openNavigation();
    expect((screen.getByRole("searchbox") as HTMLInputElement).value).toBe("splitpane");
  });

  it("unlocks scrolling on unmount", () => {
    const { unmount } = renderMobileDocs();
    openNavigation();
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("cleans up on desktop resize and stays closed when returning to mobile", () => {
    renderMobileDocs();
    openNavigation();
    resizeMobile(false);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("navigation", { name: "Component documentation" })).toBeTruthy();
    expect(document.body.style.overflow).toBe("");
    expect(document.activeElement).toBe(within(screen.getByRole("article")).getByRole("heading", { level: 2 }));
    resizeMobile(true);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByRole("button", { name: "Open navigation" }).getAttribute("aria-expanded")).toBe("false");
  });

  it("follows hash navigation and closes any open drawer", () => {
    renderMobileDocs();
    openNavigation();
    window.history.replaceState(null, "", "#docs-GridraSlider/props");
    fireEvent(window, new Event("hashchange"));
    expect(heading()).toBe("GridraSlider");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: "instant" });
    expect(document.body.style.overflow).toBe("");
  });

  it("opens and focuses search with Ctrl K", () => {
    renderMobileDocs();
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });
});

it("cycles Tab at the drawer boundaries without focusing the background", () => {
  renderMobileDocs();
  const dialog = openNavigation();
  const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button, input, select, textarea, a[href], [tabindex]'))
    .filter((element) => element.tabIndex >= 0 && !element.matches(":disabled"));
  for (const control of controls) vi.spyOn(control, "getClientRects").mockReturnValue([new DOMRect(0, 0, 44, 44)] as unknown as DOMRectList);
  controls[0].focus();
  fireEvent.keyDown(controls[0], { key: "Tab", shiftKey: true });
  expect(document.activeElement).toBe(controls[controls.length - 1]);
  fireEvent.keyDown(controls[controls.length - 1], { key: "Tab" });
  expect(document.activeElement).toBe(controls[0]);
});

it("returns to the document heading when a hash drops its section", () => {
  renderDocs("#docs-GridraButton/props");
  const reader = screen.getByRole("main");
  reader.scrollTop = 500;
  window.history.replaceState(null, "", "#docs-GridraButton");
  fireEvent(window, new Event("hashchange"));
  expect(reader.scrollTop).toBe(0);
});
