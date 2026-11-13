import { expect, it, vi } from "vitest";
import { getGridraToolbar } from "./getGridraToolbar";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(cleanup);

it("dispatches enabled actions through native buttons", () => {
  const onAction = vi.fn();
  const toolbar = getGridraToolbar({
    actions: [{ id: "save", label: "Save", pressed: true }],
    onAction,
  });
  render(
    <div {...toolbar.rootProps}>
      <button {...toolbar.getActionProps("save")}>Save</button>
    </div>,
  );

  fireEvent.click(screen.getByRole("button"));

  expect(onAction).toHaveBeenCalledWith("save");
  expect(screen.getByRole("button").getAttribute("aria-pressed")).toBe("true");
});

it("blocks unknown, disabled and cancelled actions", () => {
  const onAction = vi.fn();
  const toolbar = getGridraToolbar({
    actions: [
      { id: "off", label: "Off", disabled: true },
      { id: "on", label: "On" },
    ],
    onAction,
  });
  render(
    <>
      <button {...toolbar.getActionProps("off")}>Off</button>
      <button {...toolbar.getActionProps("missing")}>Missing</button>
      <button
        {...toolbar.getActionProps("on", { onClick: (e) => e.preventDefault() })}
      >
        On
      </button>
    </>,
  );
  for (const button of screen.getAllByRole("button")) fireEvent.click(button);

  expect(onAction).not.toHaveBeenCalled();
});
