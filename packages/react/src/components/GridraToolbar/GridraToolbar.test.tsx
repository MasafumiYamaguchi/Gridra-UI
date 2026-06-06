import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraToolbar } from "./GridraToolbar";

afterEach(() => {
  cleanup();
});

describe("GridraToolbar", () => {
  it("routes action clicks through the button component", () => {
    const actions: string[] = [];

    render(
      <GridraToolbar
        actions={[
          { id: "select", label: "Select", pressed: true },
          { id: "pan", label: "Pan" }
        ]}
        onAction={(id) => actions.push(id)}
      />
    );

    const select = screen.getByRole("button", { name: "Select" });
    fireEvent.click(screen.getByRole("button", { name: "Pan" }));

    expect(select.className).toContain("gridra-button");
    expect(select.getAttribute("aria-pressed")).toBe("true");
    expect(actions).toEqual(["pan"]);
  });

  it("passes key context to renderAction and avoids key warnings", () => {
    const contexts: Array<{ key: string }> = [];

    render(
      <GridraToolbar
        actions={[
          { id: "select", label: "Select" },
          { id: "pan", label: "Pan" }
        ]}
        renderAction={(action, context) => {
          contexts.push(context);
          return <button type="button">{action.label}</button>;
        }}
      />
    );

    expect(contexts).toEqual([{ key: "select" }, { key: "pan" }]);
  });

  it("does not route disabled default actions", () => {
    const actions: string[] = [];

    render(
      <GridraToolbar
        actions={[{ disabled: true, id: "delete", label: "Delete" }]}
        onAction={(id) => actions.push(id)}
      />
    );

    const button = screen.getByRole("button", { name: "Delete" }) as HTMLButtonElement;
    fireEvent.click(button);

    expect(button.disabled).toBe(true);
    expect(actions).toEqual([]);
  });

  it("forwards toolbar attributes and renders custom children after actions", () => {
    render(
      <GridraToolbar
        actions={[{ id: "select", label: "Select" }]}
        aria-label="Canvas tools"
        className="custom-toolbar"
        data-testid="toolbar"
      >
        <span>Extra</span>
      </GridraToolbar>,
    );
    const toolbar = screen.getByRole("toolbar", { name: "Canvas tools" });

    expect(toolbar).toBe(screen.getByTestId("toolbar"));
    expect(toolbar.className).toContain("gridra-toolbar");
    expect(toolbar.className).toContain("custom-toolbar");
    expect(Array.from(toolbar.children).map((child) => child.textContent)).toEqual(["Select", "Extra"]);
  });

  it("does not call onAction while rendering custom actions", () => {
    const onAction = vi.fn();

    render(
      <GridraToolbar
        actions={[{ id: "select", label: "Select" }]}
        onAction={onAction}
        renderAction={(action) => <button type="button">{action.label}</button>}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Select" }));

    expect(onAction).not.toHaveBeenCalled();
  });
});
