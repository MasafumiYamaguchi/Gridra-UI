import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraToastQueue } from "./useGridraToastQueue";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it("queues notifications FIFO with caller-defined exit duration", () => {
  vi.useFakeTimers();
  const { result } = renderHook(() =>
    useGridraToastQueue({ exitDuration: 20 }),
  );
  act(() => {
    result.current.show("First", { duration: 100 });
    result.current.show("Second", { duration: 100 });
  });

  expect(result.current.currentToast?.message).toBe("First");

  act(() => vi.advanceTimersByTime(100));

  expect(result.current.exiting).toBe(true);

  act(() => vi.advanceTimersByTime(20));

  expect(result.current.currentToast?.message).toBe("Second");

  act(() => vi.advanceTimersByTime(100));
  act(() => vi.advanceTimersByTime(20));

  expect(result.current.currentToast).toBeNull();
});

it("dismisses early and clears timers on unmount", () => {
  vi.useFakeTimers();
  const { result, unmount } = renderHook(() => useGridraToastQueue());
  act(() => result.current.show("Message"));
  act(() => result.current.dismiss());
  act(() => vi.advanceTimersByTime(0));

  expect(result.current.currentToast).toBeNull();

  act(() => result.current.show("Another"));

  unmount();

  expect(vi.getTimerCount()).toBe(0);
});
