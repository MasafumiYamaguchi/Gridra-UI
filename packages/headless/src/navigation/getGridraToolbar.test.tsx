import { expect, it, vi } from "vitest";
import { getGridraToolbar } from "./getGridraToolbar";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

it("dispatches enabled actions through native buttons", () => {
  const action = vi.fn(),
    t = getGridraToolbar({
      actions: [{ id: "save", label: "Save", pressed: true }],
      onAction: action,
    });
  render(
    <div {...t.rootProps}>
      <button {...t.getActionProps("save")}>Save</button>
    </div>,
  );

  fireEvent.click(screen.getByRole("button"));

  expect(action).toHaveBeenCalledWith("save");
  expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
});

it("blocks unknown, disabled and cancelled actions", () => {
  const action = vi.fn(),
    t = getGridraToolbar({
      actions: [
        { id: "off", label: "Off", disabled: true },
        { id: "on", label: "On" },
      ],
      onAction: action,
    });
  render(
    <>
      <button {...t.getActionProps("off")}>Off</button>
      <button {...t.getActionProps("missing")}>Missing</button>
      <button
        {...t.getActionProps("on", { onClick: (e) => e.preventDefault() })}
      >
        On
      </button>
    </>,
  );
  for (const button of screen.getAllByRole("button")) fireEvent.click(button);

  expect(action).not.toHaveBeenCalled();
});
