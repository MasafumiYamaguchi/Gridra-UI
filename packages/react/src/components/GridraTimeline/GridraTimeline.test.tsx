import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraTimeline } from "./GridraTimeline";

afterEach(cleanup);

describe("GridraTimeline", () => {
  it("renders an ordered history in the supplied order without workflow state", () => {
    render(<GridraTimeline aria-label="Career" items={[
      { id: "new", title: "Recent project", date: "2026" },
      { id: "old", title: "First project", date: "2023" },
    ]} />);
    const list = screen.getByRole("list", { name: "Career" });
    expect(list.tagName).toBe("OL");
    expect(list.className).toContain("gridra-timeline--vertical");
    expect(list.className).toContain("gridra-timeline--md");
    expect(screen.getAllByRole("listitem").map((item) => item.querySelector(".gridra-timeline__title")?.textContent))
      .toEqual(["Recent project", "First project"]);
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(list.querySelector("[aria-current], [aria-disabled], [tabindex]")).toBeNull();
  });

  it("keeps display dates separate from machine-readable dates", () => {
    render(<GridraTimeline items={[
      { id: "release", title: "Released", date: "2026年10月", dateTime: "2026-10" },
      { id: "work", title: "Independent work", date: "2024 – present" },
    ]} />);
    const date = screen.getByText("2026年10月");
    expect(date.tagName).toBe("TIME");
    expect(date.getAttribute("datetime")).toBe("2026-10");
    expect(screen.getByText("2024 – present").tagName).toBe("SPAN");
    expect(document.querySelectorAll("time")).toHaveLength(1);
  });

  it("shows a machine-readable date as the fallback display without parsing or reformatting it", () => {
    render(<GridraTimeline items={[{ id: "event", title: "Launch", dateTime: "2026-10-13T09:00:00+09:00" }]} />);
    expect(screen.getByText("2026-10-13T09:00:00+09:00").tagName).toBe("TIME");
  });

  it("supports entries without dates", () => {
    const { container } = render(<GridraTimeline items={[{ id: "event", title: "Milestone" }]} />);
    expect(screen.getByText("Milestone")).toBeDefined();
    expect(container.querySelector(".gridra-timeline__date")).toBeNull();
    expect(container.querySelector(".gridra-timeline__description")).toBeNull();
  });

  it("leaves rich content and links usable without nesting them in timeline controls", () => {
    const onClick = vi.fn();
    render(<GridraTimeline items={[{
      id: "project", title: <h3>Selected project</h3>,
      description: <><p>Built a public interface.</p><a href="#project" onClick={onClick}>View project</a></>,
    }]} />);
    expect(screen.getByRole("heading", { level: 3, name: "Selected project" })).toBeDefined();
    const link = screen.getByRole("link", { name: "View project" });
    expect(link.closest("button")).toBeNull();
    expect(link.closest(".gridra-timeline__description")?.tagName).toBe("DIV");
    fireEvent.click(link);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("connects adjacent entries, hides decoration, and leaves no trailing line", () => {
    const { container } = render(<GridraTimeline items={[
      { id: "a", title: "One" }, { id: "b", title: "Two" }, { id: "c", title: "Three" },
    ]} />);
    const markers = container.querySelectorAll(".gridra-timeline__marker");
    const connectors = container.querySelectorAll(".gridra-timeline__connector");
    expect(markers).toHaveLength(3);
    expect(connectors).toHaveLength(2);
    for (const decoration of [...markers, ...connectors]) expect(decoration.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getAllByRole("listitem").at(-1)?.querySelector(".gridra-timeline__connector")).toBeNull();
  });

  it("handles empty and single-entry timelines", () => {
    const { container, rerender } = render(<GridraTimeline items={[]} />);
    expect(screen.getByRole("list")).toBeDefined();
    expect(screen.queryByRole("listitem")).toBeNull();
    rerender(<GridraTimeline items={[{ id: "only", title: "One" }]} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(container.querySelector(".gridra-timeline__connector")).toBeNull();
  });

  it("preserves DOM identity when stable ids change order", () => {
    const first = { id: "first", title: "First" };
    const second = { id: "second", title: "Second" };
    const { rerender } = render(<GridraTimeline items={[first, second]} />);
    const firstElement = screen.getByText("First").closest("li");
    rerender(<GridraTimeline items={[second, first]} />);
    expect(screen.getByText("First").closest("li")).toBe(firstElement);
    expect(screen.getAllByRole("listitem")[1]).toBe(firstElement);
  });

  it.each(["", false, null, undefined])("omits an absent description (%s)", (description) => {
    const { container } = render(<GridraTimeline items={[{ id: "a", title: "One", description }]} />);
    expect(container.querySelector(".gridra-timeline__description")).toBeNull();
  });

  it("retains a zero-valued description", () => {
    render(<GridraTimeline items={[{ id: "a", title: "One", description: 0 }]} />);
    expect(screen.getByText("0")).toBeDefined();
  });

  it("supports horizontal display, sizing, naming, styles, and native attributes", () => {
    render(<><h2 id="history-title">Work history</h2><GridraTimeline
      aria-labelledby="history-title" className="custom" data-testid="timeline" id="history"
      orientation="horizontal" size="lg" style={{ maxWidth: 500 }}
      items={[{ id: "a", title: "One" }]}
    /></>);
    const list = screen.getByRole("list", { name: "Work history" });
    expect(list.id).toBe("history");
    expect(list.className).toContain("gridra-timeline--horizontal");
    expect(list.className).toContain("gridra-timeline--lg");
    expect(list.className).toContain("custom");
    expect(list.getAttribute("data-testid")).toBe("timeline");
    expect(list.style.maxWidth).toBe("500px");
  });
});
