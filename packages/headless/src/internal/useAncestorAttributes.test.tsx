import { act, cleanup, render } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAncestorAttributes } from "./useAncestorAttributes";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

function Fixture({ source, onChange, enabled = true, refreshKey }: {
  source: HTMLElement; onChange: (source: HTMLElement) => void; enabled?: boolean; refreshKey?: unknown;
}) {
  useAncestorAttributes(() => source, onChange, enabled, refreshKey);
  return null;
}

describe("useAncestorAttributes", () => {
  it("does not walk ancestors or resubscribe when only the callback changes", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    try {
      const calls = vi.fn();
      const { rerender } = render(<Fixture source={host} onChange={(source) => calls(0, source)} />);
      const parent = vi.spyOn(Node.prototype, "parentElement", "get");
      const attributes = vi.spyOn(Element.prototype, "getAttribute");
      const observe = vi.spyOn(MutationObserver.prototype, "observe");
      const disconnect = vi.spyOn(MutationObserver.prototype, "disconnect");
      calls.mockClear();
      rerender(<Fixture source={host} onChange={(source) => calls(1, source)} />);
      expect(parent).not.toHaveBeenCalled();
      expect(attributes).not.toHaveBeenCalled();
      expect(observe).not.toHaveBeenCalled();
      expect(disconnect).not.toHaveBeenCalled();
      expect(calls).not.toHaveBeenCalled();
      await act(async () => { host.className = "changed"; });
      expect(calls).toHaveBeenCalledExactlyOnceWith(1, host);
    } finally { host.remove(); }
  });

  it("refreshes changed calculation inputs without restarting observation", () => {
    const onChange = vi.fn();
    const { rerender } = render(<Fixture source={document.body} onChange={onChange} refreshKey="light" />);
    const observe = vi.spyOn(MutationObserver.prototype, "observe");
    onChange.mockClear();
    rerender(<Fixture source={document.body} onChange={onChange} refreshKey="forest" />);
    expect(onChange).toHaveBeenCalledExactlyOnceWith(document.body);
    expect(observe).not.toHaveBeenCalled();
  });

  it("ignores unrelated siblings and changes inside the source", async () => {
    const host = document.createElement("div");
    const sibling = document.createElement("div");
    document.body.append(host);
    try {
      const onChange = vi.fn();
      render(<Fixture source={host} onChange={onChange} />);
      const parent = vi.spyOn(Node.prototype, "parentElement", "get");
      onChange.mockClear();
      await act(async () => {
        document.body.append(sibling);
        host.append(document.createElement("button"));
      });
      expect(onChange).not.toHaveBeenCalled();
      expect(parent).not.toHaveBeenCalled();
    } finally { host.remove(); sibling.remove(); }
  });

  it("drains React attribute changes synchronously at commit", () => {
    const source = document.createElement("div");
    document.body.append(source);
    try {
      const onChange = vi.fn();
      const { rerender } = render(<Fixture source={source} onChange={onChange} />);
      onChange.mockClear();
      source.style.setProperty("--gridra-test", "changed");
      rerender(<Fixture source={source} onChange={onChange} />);
      expect(onChange).toHaveBeenCalledExactlyOnceWith(source);
    } finally { source.remove(); }
  });

  it("tracks reparenting without a render and stops observing the old ancestry", async () => {
    const oldHost = document.createElement("div");
    const newHost = document.createElement("div");
    const source = document.createElement("button");
    oldHost.append(source);
    document.body.append(oldHost, newHost);
    try {
      const onChange = vi.fn();
      render(<Fixture source={source} onChange={onChange} />);
      onChange.mockClear();
      await act(async () => { newHost.append(source); });
      expect(onChange).toHaveBeenCalledExactlyOnceWith(source);
      onChange.mockClear();
      await act(async () => { oldHost.className = "unrelated"; });
      expect(onChange).not.toHaveBeenCalled();
      await act(async () => { newHost.className = "new-theme"; });
      expect(onChange).toHaveBeenCalledExactlyOnceWith(source);
    } finally { oldHost.remove(); newHost.remove(); }
  });

  it("switches sources and releases subscriptions when disabled and unmounted", async () => {
    const first = document.createElement("button");
    const second = document.createElement("button");
    document.body.append(first, second);
    try {
      const onChange = vi.fn();
      const { rerender, unmount } = render(<Fixture source={first} onChange={onChange} />);
      rerender(<Fixture source={second} onChange={onChange} />);
      onChange.mockClear();
      await act(async () => { first.className = "old"; });
      expect(onChange).not.toHaveBeenCalled();
      await act(async () => { second.className = "current"; });
      expect(onChange).toHaveBeenCalledExactlyOnceWith(second);
      rerender(<Fixture source={second} onChange={onChange} enabled={false} />);
      onChange.mockClear();
      await act(async () => { second.className = "disabled"; });
      expect(onChange).not.toHaveBeenCalled();
      rerender(<Fixture source={second} onChange={onChange} />);
      expect(onChange).toHaveBeenCalledExactlyOnceWith(second);
      unmount(); onChange.mockClear();
      await act(async () => { second.className = "unmounted"; });
      expect(onChange).not.toHaveBeenCalled();
    } finally { first.remove(); second.remove(); }
  });

  it("keeps subscriptions live after StrictMode remounts", async () => {
    const host = document.createElement("div"); document.body.append(host);
    try {
      const onChange = vi.fn();
      const { unmount } = render(<StrictMode><Fixture source={host} onChange={onChange} /></StrictMode>);
      onChange.mockClear();
      await act(async () => { host.className = "updated"; });
      expect(onChange).toHaveBeenCalledExactlyOnceWith(host);
      unmount(); onChange.mockClear();
      await act(async () => { host.className = "after-unmount"; });
      expect(onChange).not.toHaveBeenCalled();
    } finally { host.remove(); }
  });
});
