import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
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
});
