import {
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useGridraTabs, type UseGridraTabsOptions } from "../index";

afterEach(cleanup);

const items = [{ id: "a" }, { id: "disabled", disabled: true }, { id: "b" }];

function Fixture({
  options = {},
  cancel = false,
}: {
  options?: Partial<UseGridraTabsOptions>;
  cancel?: boolean;
}) {
  const tabs = useGridraTabs({ items, ...options });

  return (
    <section>
      <header>Consumer layout</header>
      <div
        {...tabs.getTabListProps({
          onKeyDown: (event) => {
            if (cancel) event.preventDefault();
          },
        })}
      >
        {tabs.items.map((item) => (
          <button key={item.id} {...tabs.getTabProps(item.id)}>
            {item.id}
          </button>
        ))}
      </div>
      {tabs.items.map((item) => (
        <div key={item.id} {...tabs.getPanelProps(item.id)}>
          {item.id} content
        </div>
      ))}
    </section>
  );
}

describe("useGridraTabs without Gridra CSS or components", () => {
  it("connects caller-owned tabs and panels without adding design classes or styles", () => {
    const { container } = render(<Fixture />);
    const tab = screen.getByRole("tab", { name: "a" });
    const panel = screen.getByRole("tabpanel");

    expect(tab.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("aria-labelledby")).toBe(tab.id);
    expect(container.querySelector("[class], [style]")).toBeNull();
  });

  it("moves focus past disabled tabs and selects with automatic activation", () => {
    render(<Fixture />);

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });

    expect(document.activeElement).toBe(screen.getByRole("tab", { name: "b" }));
    expect(screen.getByRole("tabpanel").textContent).toBe("b content");
  });

  it("uses the focused tab in manual mode and leaves controlled selection to the caller", () => {
    const onSelectionChange = vi.fn();
    render(
      <Fixture
        options={{
          activationMode: "manual",
          selectedId: "a",
          onSelectionChange,
        }}
      />,
    );
    const tab = screen.getByRole("tab", { name: "b" });

    fireEvent.focus(tab);
    fireEvent.keyDown(tab, { key: "Enter" });

    expect(onSelectionChange).toHaveBeenCalledWith("b", "a");
    expect(screen.getByRole("tabpanel").textContent).toBe("a content");
  });

  it("honors consumer keyboard cancellation", () => {
    render(<Fixture cancel />);

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });

    expect(screen.getByRole("tabpanel").textContent).toBe("a content");
  });

  it("preserves manual focus when inline item arrays are recreated on render", () => {
    function Inline() {
      const tabs = useGridraTabs({
        items: [{ id: "first" }, { id: "last" }],
        activationMode: "manual",
      });

      return (
        <div {...tabs.getTabListProps()}>
          {tabs.items.map((item) => (
            <button key={item.id} {...tabs.getTabProps(item.id)}>
              {item.id}
            </button>
          ))}
        </div>
      );
    }

    render(<Inline />);

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "End" });

    expect(
      screen.getByRole("tab", { name: "first" }).getAttribute("aria-selected"),
    ).toBe("true");

    fireEvent.keyDown(screen.getByRole("tablist"), { key: "Enter" });

    expect(
      screen.getByRole("tab", { name: "last" }).getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("composes refs and click handlers, including preventDefault", () => {
    const ref = createRef<HTMLButtonElement>();
    const onClick = vi.fn((event) => event.preventDefault());
    function Custom() {
      const tabs = useGridraTabs({ items });

      return (
        <button
          {...tabs.getTabProps("b", { ref, onClick, className: "custom" })}
        >
          Custom
        </button>
      );
    }
    const { unmount } = render(<Custom />);
    const button = screen.getByRole("tab");

    expect(ref.current).toBe(button);

    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledOnce();
    expect(button.getAttribute("aria-selected")).toBe("false");
    expect(button.className).toBe("custom");

    unmount();

    expect(ref.current).toBeNull();
  });

  it("uses the resolved selection as previous after removal of an uncontrolled tab", () => {
    const onSelectionChange = vi.fn();
    const { rerender } = render(
      <Fixture options={{ defaultSelectedId: "b", onSelectionChange }} />,
    );
    rerender(
      <Fixture
        options={{ items: [{ id: "a" }, { id: "c" }], onSelectionChange }}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "c" }));

    expect(onSelectionChange).toHaveBeenCalledWith("c", "a");
  });

  it("does not notify when the fallback selected tab is selected again", () => {
    const onSelectionChange = vi.fn();

    render(<Fixture options={{ selectedId: "missing", onSelectionChange }} />);

    fireEvent.click(screen.getByRole("tab", { name: "a" }));

    expect(onSelectionChange).not.toHaveBeenCalled();
  });

  it("keeps empty, disabled, duplicate and missing ids inert", () => {
    const onSelectionChange = vi.fn();
    const { result } = renderHook(() =>
      useGridraTabs({
        items: [{ id: "a", disabled: true }, { id: "a" }],
        onSelectionChange,
      }),
    );

    expect(result.current.items).toHaveLength(1);
    expect(result.current.selectedItem).toBeUndefined();

    result.current.select("missing");

    result.current.select("a");

    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(result.current.getTabProps("missing").disabled).toBe(true);
  });
});
