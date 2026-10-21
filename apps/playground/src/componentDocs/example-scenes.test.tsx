import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { componentDocs } from "./data";
import { ExampleCard } from "./preview";

vi.mock("./code-block", () => ({
  CodeBlock: ({ code }: { code: string }) => <pre>{code}</pre>,
}));

afterEach(cleanup);

function renderExample(name: string, title: string) {
  const example = componentDocs
    .find((doc) => doc.name === name)
    ?.examples.find((example) => example.title === title);
  if (!example) throw new Error(`Unknown example: ${name} / ${title}`);

  render(<ExampleCard example={example} number="1.1" theme="dark" />);

  return within(screen.getByRole("region", { name: `Live preview: ${title}` }));
}

describe.each(componentDocs)("$name live examples", (doc) => {
  it.each(doc.examples)("renders $title above its code", (example) => {
    expect(example.preview).toBeTruthy();

    render(<ExampleCard example={example} number="1.1" theme="dark" />);
    const stage = screen.getByRole("region", {
      name: `Live preview: ${example.title}`,
    });
    const content = stage.querySelector(".docs-example-content") ?? stage;

    expect(content.childElementCount).toBeGreaterThan(0);

    const code = screen.getByText(example.code, {
      exact: true,
      normalizer: (text) => text,
    });

    expect(
      stage.compareDocumentPosition(code) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

describe("interactive example scenes", () => {
  it("runs headless GridraBreadcrumb through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraBreadcrumb",
      "Custom markup with headless hook",
    );

    expect(
      preview.getByRole("link", { name: "Home" }).getAttribute("href"),
    ).toBe("#home");
    expect(preview.getByText("Current page").getAttribute("aria-current")).toBe(
      "page",
    );
  });
  it("runs headless GridraIconButton through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraIconButton",
      "Custom markup with headless hook",
    );

    expect(
      preview
        .getByRole("button", { name: "Custom save" })
        .getAttribute("title"),
    ).toBe("Custom save");
  });
  it("runs headless GridraButton through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraButton",
      "Custom markup with headless hook",
    );
    const button = preview.getByRole("button", { name: "Custom busy button" });

    expect(button.hasAttribute("disabled")).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
  });
  it("runs headless GridraSlider through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraSlider",
      "Custom markup with headless hook",
    );

    fireEvent.change(preview.getByRole("slider"), { target: { value: "60" } });

    expect(preview.getByText("60")).toBeTruthy();
  });
  it("runs headless GridraSwitch through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraSwitch",
      "Custom markup with headless hook",
    );
    const button = preview.getByRole("switch", { name: "Custom switch" });

    fireEvent.click(button);

    expect(button.getAttribute("aria-checked")).toBe("true");
  });
  it("runs headless GridraRadio through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraRadio",
      "Custom markup with headless hook",
    );
    const input = preview.getByRole("radio", { name: "Custom radio" });

    expect(input.getAttribute("aria-describedby")).toBe(
      preview.getByText("Custom description").id,
    );

    fireEvent.click(input);

    expect((input as HTMLInputElement).checked).toBe(true);
  });
  it("runs headless GridraCheckbox through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraCheckbox",
      "Custom markup with headless hook",
    );
    const input = preview.getByRole("checkbox", { name: "Custom checkbox" });

    expect(input.getAttribute("aria-describedby")).toBe(
      preview.getByText("Custom description").id,
    );

    fireEvent.click(input);

    expect((input as HTMLInputElement).checked).toBe(true);
  });
  it("runs headless GridraField through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraField",
      "Custom markup with headless hook",
    );
    const input = preview.getByRole("textbox", { name: "Custom field" });

    expect(input.getAttribute("aria-describedby")).toBe(
      preview.getByText("A helpful description").id,
    );
    expect(input.hasAttribute("required")).toBe(true);
  });
  it("runs headless GridraToast through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraToast",
      "Custom markup with headless hook",
    );

    fireEvent.click(preview.getByRole("button", { name: "Show custom toast" }));

    expect(preview.getByRole("status").textContent).toContain(
      "Custom notification",
    );
  });
  it("runs headless GridraCommandPalette through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraCommandPalette",
      "Custom markup with headless hook",
    );

    fireEvent.click(
      preview.getByRole("button", { name: "Open custom palette" }),
    );
    fireEvent.change(preview.getByRole("textbox"), {
      target: { value: "Second" },
    });

    expect(preview.queryByRole("button", { name: "First command" })).toBeNull();

    fireEvent.click(preview.getByRole("button", { name: "Second command" }));

    expect(preview.queryByRole("dialog")).toBeNull();
  });
  it("runs headless GridraContextMenu through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraContextMenu",
      "Custom markup with headless hook",
    );

    fireEvent.contextMenu(
      preview.getByRole("button", { name: "Custom context target" }),
      { clientX: 20, clientY: 20 },
    );

    expect(preview.getByRole("menuitem", { name: "Action" })).toBeTruthy();

    fireEvent.click(preview.getByRole("menuitem", { name: "Action" }));

    expect(preview.queryByRole("menu")).toBeNull();
  });
  it("runs headless GridraDropdownMenu through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraDropdownMenu",
      "Custom markup with headless hook",
    );

    fireEvent.click(preview.getByRole("button", { name: "Open custom menu" }));

    expect(preview.getByRole("menuitem", { name: "Action" })).toBeTruthy();

    fireEvent.click(preview.getByRole("menuitem", { name: "Action" }));

    expect(preview.queryByRole("menu")).toBeNull();
  });
  it("runs headless GridraDialog through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraDialog",
      "Custom markup with headless hook",
    );

    fireEvent.click(
      preview.getByRole("button", { name: "Open custom dialog" }),
    );

    expect(preview.getByRole("dialog")).toBeTruthy();

    fireEvent.click(
      preview.getByRole("button", { name: "Close custom dialog" }),
    );

    expect(preview.queryByRole("dialog")).toBeNull();
  });
  it("runs headless GridraHoverCard through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraHoverCard",
      "Custom markup with headless hook",
    );
    vi.useFakeTimers();

    fireEvent.focus(preview.getByRole("button", { name: "Custom hover card" }));
    fireEvent.blur(preview.getByRole("button", { name: "Custom hover card" }));

    vi.runAllTimers();

    expect(preview.queryByRole("dialog")).toBeNull();

    vi.useRealTimers();
  });
  it("runs headless GridraTooltip through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraTooltip",
      "Custom markup with headless hook",
    );
    vi.useFakeTimers();

    fireEvent.focus(preview.getByRole("button", { name: "Custom help" }));
    fireEvent.blur(preview.getByRole("button", { name: "Custom help" }));

    vi.runAllTimers();

    expect(preview.queryByRole("tooltip")).toBeNull();

    vi.useRealTimers();
  });
  it("runs headless GridraPopover through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraPopover",
      "Custom markup with headless hook",
    );

    fireEvent.click(
      preview.getByRole("button", { name: "Open custom popover" }),
    );

    expect(preview.getByText("Custom popover content")).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(preview.queryByText("Custom popover content")).toBeNull();
  });
  it("runs headless GridraSplitPane through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraSplitPane",
      "Custom markup with headless hook",
    );

    fireEvent.keyDown(preview.getByRole("separator"), { key: "ArrowRight" });

    expect(preview.getByRole("status").textContent).toBe("First pane 52%");
  });
  it("runs headless GridraSidebar through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraSidebar",
      "Custom markup with headless hook",
    );
    const toggle = preview.getByRole("button", { name: "Toggle" });

    fireEvent.click(toggle);

    expect(toggle.getAttribute("aria-expanded")).toBe("false");
  });
  it("runs headless GridraTreeView through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraTreeView",
      "Custom markup with headless hook",
    );

    fireEvent.click(preview.getByText("Parent"));

    expect(preview.getByText("Child")).toBeTruthy();
  });
  it("runs headless GridraMenu through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraMenu",
      "Custom markup with headless hook",
    );
    const button = preview.getByRole("button", { name: "B" });

    fireEvent.click(button);

    expect(button.getAttribute("aria-current")).toBe("page");
  });
  it("runs headless GridraStepper through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraStepper",
      "Custom markup with headless hook",
    );
    const first = preview.getByRole("button", { name: "First" });

    fireEvent.click(first);

    expect(first.getAttribute("aria-current")).toBe("step");
  });
  it("runs headless GridraPagination through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraPagination",
      "Custom markup with headless hook",
    );

    fireEvent.click(preview.getByRole("button", { name: "Next" }));

    expect(preview.getByRole("status").textContent).toBe("Page 2");
  });
  it("runs headless GridraSelectableGrid through caller-owned DOM", () => {
    const preview = renderExample(
      "GridraSelectableGrid",
      "Custom markup with headless hook",
    );
    const button = preview.getByRole("button", { name: "B" });

    fireEvent.click(button);

    expect(button.getAttribute("aria-selected")).toBe("true");
  });
  it("runs custom Accordion headings and panels with headless open state", () => {
    const preview = renderExample(
      "GridraAccordion",
      "Custom markup with headless hook",
    );

    expect(preview.getByRole("region").textContent).toBe(
      "Custom general content",
    );

    fireEvent.click(preview.getByRole("button", { name: "Account" }));

    expect(preview.getByRole("region").textContent).toBe(
      "Custom account content",
    );

    fireEvent.click(preview.getByRole("button", { name: "Account" }));

    expect(preview.queryByRole("region")).toBeNull();

    fireEvent.keyDown(preview.getByRole("button", { name: "Account" }), {
      key: "Home",
    });

    expect(document.activeElement).toBe(
      preview.getByRole("button", { name: "General" }),
    );
    expect(
      preview.getByRole("article").querySelector(".gridra-accordion"),
    ).toBeNull();
  });
  it("runs the custom Tabs markup with headless selection and keyboard focus", () => {
    const preview = renderExample(
      "GridraTabs",
      "Custom markup with headless hook",
    );

    expect(preview.getByRole("tabpanel").textContent).toBe("Custom overview");

    fireEvent.click(preview.getByRole("tab", { name: "Details" }));

    expect(preview.getByRole("tabpanel").textContent).toBe("Custom details");

    fireEvent.keyDown(preview.getByRole("tablist"), { key: "Home" });

    expect(document.activeElement).toBe(
      preview.getByRole("tab", { name: "Overview" }),
    );
    expect(preview.getByRole("tabpanel").textContent).toBe("Custom overview");
    expect(
      preview.getByRole("article").querySelector(".gridra-tabs"),
    ).toBeNull();
  });
  it.each(["Portfolio history", "Horizontal milestones"])(
    "renders %s as a readable history with usable project links",
    (title) => {
      const preview = renderExample("GridraTimeline", title);
      const history = within(
        preview.getByRole("list", { name: "ポートフォリオの活動履歴" }),
      );

      expect(history.getAllByRole("listitem")).toHaveLength(3);
      expect(history.getByText("2022年4月").getAttribute("datetime")).toBe(
        "2022-04",
      );
      expect(history.getByText("2024年から現在").tagName).toBe("SPAN");
      expect(
        history
          .getByRole("link", { name: "プロジェクトを見る" })
          .getAttribute("href"),
      ).toBe("https://example.com/projects");
      expect(history.queryByRole("button")).toBeNull();
      expect(history.queryByRole("progressbar")).toBeNull();
    },
  );

  it.each(["Cards", "Ruler", "Line", "Boxes"])(
    "lets both %s stepper examples go back and reset independently",
    (title) => {
      const preview = renderExample("GridraStepper", title);
      const variant = title.toLowerCase();
      const checkout = within(
        preview.getByRole("navigation", { name: `${variant} checkout steps` }),
      );
      const setup = within(
        preview.getByRole("navigation", { name: `${variant} setup steps` }),
      );
      const panel = within(
        preview.getByRole("region", { name: "Checkout panel" }),
      );

      expect(panel.getByRole("textbox", { name: "Payment card" })).toBeTruthy();

      fireEvent.click(checkout.getByRole("button", { name: /Cart/ }));

      expect(
        checkout
          .getByRole("button", { name: /Cart/ })
          .getAttribute("aria-current"),
      ).toBe("step");
      expect(panel.getByRole("spinbutton", { name: "Quantity" })).toBeTruthy();
      expect(
        setup
          .getByRole("button", { name: /Profile/ })
          .getAttribute("aria-current"),
      ).toBe("step");

      fireEvent.click(setup.getByRole("button", { name: /Account/ }));
      fireEvent.click(
        preview.getByRole("button", { name: "Next checkout step" }),
      );

      expect(
        checkout
          .getByRole("button", { name: /Shipping/ })
          .getAttribute("aria-current"),
      ).toBe("step");
      expect(
        panel.getByRole("textbox", { name: "Shipping address" }),
      ).toBeTruthy();
      expect(panel.queryByRole("spinbutton", { name: "Quantity" })).toBeNull();

      fireEvent.click(
        preview.getByRole("button", { name: "Next checkout step" }),
      );
      fireEvent.click(
        preview.getByRole("button", { name: "Next checkout step" }),
      );

      expect(
        checkout
          .getByRole("button", { name: /Confirm/ })
          .getAttribute("aria-current"),
      ).toBe("step");
      expect(panel.getByText("Order ready for confirmation.")).toBeTruthy();
      expect(
        (
          preview.getByRole("button", {
            name: "Next checkout step",
          }) as HTMLButtonElement
        ).disabled,
      ).toBe(true);

      fireEvent.click(preview.getByRole("button", { name: "Next setup step" }));
      fireEvent.click(preview.getByRole("button", { name: "Next setup step" }));

      expect(
        setup
          .getByRole("button", { name: /Preferences/ })
          .getAttribute("aria-current"),
      ).toBe("step");
      expect(
        (
          preview.getByRole("button", {
            name: "Next setup step",
          }) as HTMLButtonElement
        ).disabled,
      ).toBe(true);
      expect(
        setup
          .getByRole("button", { name: /Review/ })
          .getAttribute("aria-current"),
      ).toBeNull();

      fireEvent.click(preview.getByRole("button", { name: "Reset steps" }));

      expect(
        checkout
          .getByRole("button", { name: /Payment/ })
          .getAttribute("aria-current"),
      ).toBe("step");
      expect(
        setup
          .getByRole("button", { name: /Profile/ })
          .getAttribute("aria-current"),
      ).toBe("step");
      expect(
        setup
          .getByRole("button", { name: /Review/ })
          .getAttribute("aria-disabled"),
      ).toBe("true");
    },
  );

  it("keeps each Button example separate from the other variants", () => {
    const preview = renderExample("GridraButton", "Sizes");

    expect(
      preview
        .getByRole("button", { name: "Small" })
        .classList.contains("gridra-button--sm"),
    ).toBe(true);
    expect(
      preview
        .getByRole("button", { name: "Large" })
        .classList.contains("gridra-button--lg"),
    ).toBe(true);
    expect(preview.queryByRole("button", { name: "Primary" })).toBeNull();
  });

  it("toggles the Switch example", () => {
    const preview = renderExample("GridraSwitch", "Switch with label");
    const toggle = preview.getByRole("switch", { name: /Preview/ });

    expect(toggle.getAttribute("aria-checked")).toBe("true");

    fireEvent.click(toggle);

    expect(toggle.getAttribute("aria-checked")).toBe("false");
  });

  it("opens the actual Dialog from its example trigger", () => {
    const preview = renderExample("GridraDialog", "Basic trigger dialog");

    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.click(preview.getByRole("button", { name: "Open Dialog" }));

    const dialog = screen.getByRole("dialog", { name: "Confirm" });

    expect(
      within(dialog).getByRole("button", { name: "Proceed" }),
    ).toBeTruthy();

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("edits Inspector placement without dropping other coordinates", () => {
    const preview = renderExample(
      "GridraInspectorPanel",
      "Editing a selected node",
    );
    const x = preview.getByTestId("inspector-x");

    fireEvent.change(x, { target: { value: "8" } });

    expect((x as HTMLInputElement).value).toBe("8");
    expect((preview.getByTestId("inspector-y") as HTMLInputElement).value).toBe(
      "2",
    );
    expect((preview.getByTestId("inspector-w") as HTMLInputElement).value).toBe(
      "3",
    );
  });

  it("edits Properties values", () => {
    const preview = renderExample(
      "GridraPropertiesPanel",
      "Editing properties for a transform node",
    );
    const mode = preview.getByRole("combobox", { name: "Mode" });

    fireEvent.change(mode, { target: { value: "replace" } });

    expect((mode as HTMLSelectElement).value).toBe("replace");

    const intensity = preview.getByRole("spinbutton", { name: "Intensity" });

    fireEvent.change(intensity, { target: { value: "80" } });

    expect((intensity as HTMLInputElement).value).toBe("80");
  });

  it("switches a controlled Tab example", () => {
    const preview = renderExample("GridraTabs", "Controlled tabs");

    fireEvent.click(preview.getByRole("tab", { name: "Account" }));

    expect(preview.getByRole("tabpanel").textContent).toBe("Account settings");
  });

  it("shows the actual Toast only after activation", () => {
    const preview = renderExample("GridraToast", "Basic toast");

    expect(screen.queryByRole("status")).toBeNull();

    fireEvent.click(preview.getByRole("button", { name: "Show toast" }));

    expect(screen.getByRole("status").textContent).toBe(
      "File saved successfully",
    );
  });
});

describe("SplitPane documentation examples", () => {
  it("feeds updated three-pane sizes back into the controlled preview", () => {
    const preview = renderExample(
      "GridraSplitPane",
      "Three-pane controlled split",
    );
    const [first, second] = preview.getAllByRole("separator");

    fireEvent.keyDown(first, { key: "ArrowRight" });

    expect(first.getAttribute("aria-valuenow")).toBe("32");
    expect(second.getAttribute("aria-valuenow")).toBe("70");

    fireEvent.keyDown(second, { key: "ArrowLeft" });

    expect(second.getAttribute("aria-valuenow")).toBe("68");
  });
});

it("demonstrates the reusable sidebar toggle without changing disabled state", () => {
  const preview = renderExample(
    "GridraSidebar",
    "Standalone navigation toggle",
  );
  const toggle = preview.getByRole("button", { name: "Open sidebar" });

  fireEvent.click(toggle);

  expect(toggle.getAttribute("aria-expanded")).toBe("true");
  expect(preview.getByText("Navigation content").hidden).toBe(false);

  const disabled = preview.getByRole("button", {
    name: "Unavailable navigation",
  });

  fireEvent.click(disabled);

  expect(disabled.getAttribute("aria-expanded")).toBe("false");
});
