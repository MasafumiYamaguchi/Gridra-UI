import {
  act,
  cleanup,
  fireEvent,
  render,
  renderHook,
  screen,
} from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraSplitPane } from "../index";

afterEach(cleanup);

it("resizes caller-owned two-pane separators and respects bounds", () => {
  function Example() {
    const s = useGridraSplitPane();

    return (
      <div {...s.getContainerProps()}>
        <div {...s.getSeparatorProps(0)} />
      </div>
    );
  }
  render(<Example />);
  const separator = screen.getByRole("separator");

  fireEvent.keyDown(separator, { key: "ArrowRight" });

  expect(separator.getAttribute("aria-valuenow")).toBe("52");

  fireEvent.keyDown(separator, { key: "Home" });

  expect(separator.getAttribute("aria-valuenow")).toBe("10");
});

it("preserves controlled three-pane sizes and consumer cancellation", () => {
  const onSizesChange = vi.fn();

  function Example() {
    const s = useGridraSplitPane({
      paneCount: 3,
      sizes: [30, 40, 30],
      onSizesChange,
    });

    return (
      <div
        {...s.getSeparatorProps(0, { onKeyDown: (e) => e.preventDefault() })}
      />
    );
  }
  render(<Example />);

  fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowRight" });

  expect(onSizesChange).not.toHaveBeenCalled();
});

it("normalizes an invalid pane count", () => {
  const { result } = renderHook(() => useGridraSplitPane({ paneCount: NaN }));

  expect(result.current.paneCount).toBe(2);
  expect(result.current.effectiveSizes).toEqual([50, 50]);
  expect(result.current.getSeparatorProps(-1).onKeyDown).toBeUndefined();
});

it("uses the resolved value as previous when controlled size is out of range", () => {
  const onSizeChange = vi.fn();

  function Example() {
    const split = useGridraSplitPane({ size: 999, onSizeChange });

    return <div {...split.getSeparatorProps(0)} />;
  }
  render(<Example />);

  fireEvent.keyDown(screen.getByRole("separator"), { key: "ArrowLeft" });

  expect(onSizeChange).toHaveBeenCalledWith(88, 90);
});
