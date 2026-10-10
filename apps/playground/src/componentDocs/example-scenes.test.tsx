import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { componentDocs } from "./data";
import { ExampleCard } from "./preview";

vi.mock("./code-block", () => ({
  CodeBlock: ({ code }: { code: string }) => <pre>{code}</pre>,
}));

afterEach(cleanup);

function renderExample(name: string, title: string) {
  const example = componentDocs.find((doc) => doc.name === name)?.examples.find((example) => example.title === title);
  if (!example) throw new Error(`Unknown example: ${name} / ${title}`);
  render(<ExampleCard example={example} number="1.1" theme="dark" />);
  return within(screen.getByRole("region", { name: `Live preview: ${title}` }));
}

describe.each(componentDocs)("$name live examples", (doc) => {
  it.each(doc.examples)("renders $title above its code", (example) => {
    expect(example.preview).toBeTruthy();
    render(<ExampleCard example={example} number="1.1" theme="dark" />);
    const stage = screen.getByRole("region", { name: `Live preview: ${example.title}` });
    const content = stage.querySelector(".docs-example-content") ?? stage;
    expect(content.childElementCount).toBeGreaterThan(0);
    const code = screen.getByText(example.code, { exact: true, normalizer: (text) => text });
    expect(stage.compareDocumentPosition(code) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

describe("interactive example scenes", () => {
  it.each(["Cards", "Ruler", "Line", "Boxes"])("lets both %s stepper examples go back and reset independently", (title) => {
    const preview = renderExample("GridraStepper", title);
    const variant = title.toLowerCase();
    const checkout = within(preview.getByRole("navigation", { name: `${variant} checkout steps` }));
    const setup = within(preview.getByRole("navigation", { name: `${variant} setup steps` }));
    fireEvent.click(checkout.getByRole("button", { name: /Cart/ }));
    expect(checkout.getByRole("button", { name: /Cart/ }).getAttribute("aria-current")).toBe("step");
    expect(setup.getByRole("button", { name: /Profile/ }).getAttribute("aria-current")).toBe("step");
    fireEvent.click(setup.getByRole("button", { name: /Account/ }));
    fireEvent.click(preview.getByRole("button", { name: "Reset steps" }));
    expect(checkout.getByRole("button", { name: /Payment/ }).getAttribute("aria-current")).toBe("step");
    expect(setup.getByRole("button", { name: /Profile/ }).getAttribute("aria-current")).toBe("step");
    expect((setup.getByRole("button", { name: /Review/ }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("keeps each Button example separate from the other variants", () => {
    const preview = renderExample("GridraButton", "Sizes");
    expect(preview.getByRole("button", { name: "Small" }).classList.contains("gridra-button--sm")).toBe(true);
    expect(preview.getByRole("button", { name: "Large" }).classList.contains("gridra-button--lg")).toBe(true);
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
    expect(within(dialog).getByRole("button", { name: "Proceed" })).toBeTruthy();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("edits Inspector placement without dropping other coordinates", () => {
    const preview = renderExample("GridraInspectorPanel", "Editing a selected node");
    const x = preview.getByTestId("inspector-x");
    fireEvent.change(x, { target: { value: "8" } });
    expect((x as HTMLInputElement).value).toBe("8");
    expect((preview.getByTestId("inspector-y") as HTMLInputElement).value).toBe("2");
    expect((preview.getByTestId("inspector-w") as HTMLInputElement).value).toBe("3");
  });

  it("edits Properties values", () => {
    const preview = renderExample("GridraPropertiesPanel", "Editing properties for a transform node");
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
    expect(screen.getByRole("status").textContent).toBe("File saved successfully");
  });
});
