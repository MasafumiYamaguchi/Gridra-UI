import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraErrorMessage } from "./GridraErrorMessage";

afterEach(() => {
  cleanup();
});

describe("GridraErrorMessage", () => {
  it("renders children and default tone", () => {
    const { container } = render(
      <GridraErrorMessage>Required field</GridraErrorMessage>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("gridra-error-message");
    expect(el.className).toContain("gridra-error-message--danger");
    expect(screen.getByText("Required field")).toBeTruthy();
  });

  it("applies warning tone", () => {
    const { container } = render(
      <GridraErrorMessage tone="warning">
        Review this value
      </GridraErrorMessage>,
    );
    expect(container.firstElementChild!.className).toContain(
      "gridra-error-message--warning",
    );
  });

  it("applies muted tone", () => {
    const { container } = render(
      <GridraErrorMessage tone="muted">Note</GridraErrorMessage>,
    );
    expect(container.firstElementChild!.className).toContain(
      "gridra-error-message--muted",
    );
  });

  it("renders an icon slot with aria-hidden", () => {
    const { container } = render(
      <GridraErrorMessage icon={<span data-testid="icon">!</span>}>
        Oops
      </GridraErrorMessage>,
    );
    const iconWrapper = container.querySelector(
      ".gridra-error-message__icon",
    );
    expect(iconWrapper).toBeTruthy();
    expect(iconWrapper!.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByTestId("icon")).toBeTruthy();
  });

  it("does not auto-assign a role", () => {
    const { container } = render(
      <GridraErrorMessage>Error</GridraErrorMessage>,
    );
    expect(
      container.firstElementChild!.hasAttribute("role"),
    ).toBe(false);
  });

  it("allows role override", () => {
    const { container } = render(
      <GridraErrorMessage role="alert">
        Immediate error
      </GridraErrorMessage>,
    );
    expect(
      container.firstElementChild!.getAttribute("role"),
    ).toBe("alert");
  });

  it("passes through className and data attributes", () => {
    const { container } = render(
      <GridraErrorMessage className="custom-err" data-testid="err">
        Text
      </GridraErrorMessage>,
    );
    const el = container.firstElementChild!;
    expect(el.className).toContain("custom-err");
    expect(el.getAttribute("data-testid")).toBe("err");
  });
});
