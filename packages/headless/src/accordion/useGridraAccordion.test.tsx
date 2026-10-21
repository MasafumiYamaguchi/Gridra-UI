import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useGridraAccordion, type UseGridraAccordionOptions } from "../index";

afterEach(cleanup);

const items = [{ id: "a" }, { id: "disabled", disabled: true }, { id: "b" }];

function Fixture({
  options = {},
}: {
  options?: Partial<UseGridraAccordionOptions>;
}) {
  const accordion = useGridraAccordion({ items, ...options });

  return (
    <article>
      {accordion.items.map((item) => (
        <section key={item.id}>
          <h2>
            <button {...accordion.getTriggerProps(item.id)}>{item.id}</button>
          </h2>
          <div {...accordion.getPanelProps(item.id)}>{item.id} content</div>
        </section>
      ))}
    </article>
  );
}

describe("useGridraAccordion without Gridra CSS or components", () => {
  it("connects caller-owned headings and content, without design classes or styles", () => {
    const { container } = render(<Fixture />);
    const button = screen.getByRole("button", { name: "a" });
    const panel = screen.getByRole("region");

    expect(button.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(button.id);
    expect(container.querySelector("[class], [style]")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "b" }));

    expect(screen.getByRole("region").textContent).toBe("b content");
  });

  it("supports controlled multiple values with sanitized previous values", () => {
    const onValueChange = vi.fn();
    render(
      <Fixture
        options={{
          type: "multiple",
          value: ["missing", "a", "a", "disabled"],
          onValueChange,
        }}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "b" }));

    expect(onValueChange).toHaveBeenCalledWith(["a", "b"], ["a"]);
    expect(screen.getByRole("region").textContent).toBe("a content");
  });

  it("does not close a non-collapsible item or toggle disabled items", () => {
    const onValueChange = vi.fn();
    render(<Fixture options={{ onValueChange }} />);

    fireEvent.click(screen.getByRole("button", { name: "a" }));
    fireEvent.click(screen.getByRole("button", { name: "disabled" }));

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("supports closing the last panel when collapsible", () => {
    const onValueChange = vi.fn();
    render(<Fixture options={{ collapsible: true, onValueChange }} />);

    fireEvent.click(screen.getByRole("button", { name: "a" }));

    expect(onValueChange).toHaveBeenCalledWith("", "a");
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("skips disabled triggers and respects navigation boundaries", () => {
    render(<Fixture />);
    const a = screen.getByRole("button", { name: "a" });
    const b = screen.getByRole("button", { name: "b" });
    a.focus();

    fireEvent.keyDown(a, { key: "ArrowDown" });

    expect(document.activeElement).toBe(b);

    fireEvent.keyDown(b, { key: "ArrowDown" });

    expect(document.activeElement).toBe(b);

    fireEvent.keyDown(b, { key: "Home" });

    expect(document.activeElement).toBe(a);
  });

  it("composes refs and allows consumer handlers to cancel toggling and navigation", () => {
    const ref = createRef<HTMLButtonElement>();
    const onValueChange = vi.fn();

    function Custom() {
      const accordion = useGridraAccordion({ items, onValueChange });

      return (
        <button
          {...accordion.getTriggerProps("b", {
            ref,
            onClick: (event) => event.preventDefault(),
            onKeyDown: (event) => event.preventDefault(),
          })}
        >
          Custom
        </button>
      );
    }
    const { unmount } = render(<Custom />);

    expect(ref.current).toBe(screen.getByRole("button"));

    fireEvent.click(ref.current!);
    fireEvent.keyDown(ref.current!, { key: "Home" });

    expect(onValueChange).not.toHaveBeenCalled();

    unmount();

    expect(ref.current).toBeNull();
  });

  it("handles empty, duplicate and missing ids without creating duplicate controls", () => {
    const onValueChange = vi.fn();
    const { result, rerender } = renderHook(
      ({ items }) => useGridraAccordion({ items, onValueChange }),
      {
        initialProps: {
          items: [
            { id: "a", disabled: true },
            { id: "a", disabled: false },
          ],
        },
      },
    );

    expect(result.current.items).toHaveLength(1);
    expect(result.current.expandedIds).toEqual([]);

    result.current.toggle("missing");
    result.current.toggle("a");

    expect(onValueChange).not.toHaveBeenCalled();

    rerender({ items: [] });

    expect(result.current.expandedIds).toEqual([]);
    expect(result.current.getTriggerProps("a").disabled).toBe(true);
  });

  it("ignores malformed default values", () => {
    const { result } = renderHook(() =>
      useGridraAccordion({ items, defaultValue: null as never }),
    );

    expect(result.current.expandedIds).toEqual([]);
  });
});
