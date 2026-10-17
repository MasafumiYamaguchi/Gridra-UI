import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useControllableValue } from "./index";

afterEach(cleanup);
describe("public controllable state", () => {
  it("initializes the default once and reports resolved previous values", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(({ initial }) => useControllableValue(undefined, initial, onChange), {
      initialProps: { initial: "a" },
    });
    act(() => result.current[1]("b"));
    expect(result.current[0]).toBe("b");
    expect(onChange).toHaveBeenCalledWith("b", "a");
    rerender({ initial: "c" });
    expect(result.current[0]).toBe("b");
    act(() => result.current[1]("b"));
    expect(onChange).toHaveBeenCalledOnce();
  });

  it("leaves controlled state to the owner and ignores equivalent requests", () => {
    const onChange = vi.fn();
    const { result, rerender } = renderHook(({ value }) => useControllableValue(value, "default", onChange), {
      initialProps: { value: "a" },
    });
    act(() => result.current[1]("b"));
    expect(result.current[0]).toBe("a");
    expect(onChange).toHaveBeenCalledWith("b", "a");
    rerender({ value: "b" });
    act(() => result.current[1]("b"));
    expect(onChange).toHaveBeenCalledOnce();
  });
});
