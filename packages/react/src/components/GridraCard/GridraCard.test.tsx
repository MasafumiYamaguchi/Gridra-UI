import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { GridraCard } from "./GridraCard";

afterEach(() => {
  cleanup();
});

describe("GridraCard", () => {
  it("renders display slots with default classes", () => {
    render(
      <GridraCard description="Card description" footer="Footer" heading="Card title">
        Body
      </GridraCard>
    );
    const card = screen.getByText("Card title").closest(".gridra-card");

    expect(card).not.toBeNull();
    expect(card?.className).toContain("gridra-card--surface");
    expect(card?.className).toContain("gridra-card--padding-md");
    expect(screen.getByText("Card description").className).toContain("gridra-card__description");
    expect(screen.getByText("Body").className).toContain("gridra-card__body");
    expect(screen.getByText("Footer").className).toContain("gridra-card__footer");
  });

  it("supports className, data, aria, style, surface, padding, media, and actions", () => {
    render(
      <GridraCard
        actions={<span>Action slot</span>}
        aria-label="Card shell"
        className="custom-card"
        data-testid="card"
        media={<img alt="Preview" src="/preview.png" />}
        padding="lg"
        style={{ width: 320 }}
        surface="raised"
      >
        Content
      </GridraCard>
    );
    const card = screen.getByTestId("card");

    expect(card.getAttribute("aria-label")).toBe("Card shell");
    expect(card.className).toContain("custom-card");
    expect(card.className).toContain("gridra-card--raised");
    expect(card.className).toContain("gridra-card--padding-lg");
    expect(card.className).toContain("gridra-card--with-media");
    expect((card as HTMLElement).style.width).toBe("320px");
    expect(screen.getByAltText("Preview").closest(".gridra-card__media")).not.toBeNull();
    expect(screen.getByText("Action slot").closest(".gridra-card__actions")).not.toBeNull();
  });

  it("does not add button or status semantics by default", () => {
    render(<GridraCard>Passive card</GridraCard>);

    expect(screen.getByText("Passive card").closest(".gridra-card")?.getAttribute("role")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("renders numeric zero children as body content", () => {
    render(<GridraCard>{0}</GridraCard>);

    expect(screen.getByText("0").className).toContain("gridra-card__body");
  });
});
