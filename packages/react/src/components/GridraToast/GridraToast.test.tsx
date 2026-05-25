import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraToastProvider, useToast } from "./GridraToast";

function ToastTrigger({
  message = "Test message",
  options,
}: {
  message?: string;
  options?: Parameters<ReturnType<typeof useToast>["show"]>[1];
}) {
  const { show } = useToast();
  return (
    <button onClick={() => show(message, options)} type="button">
      Show toast
    </button>
  );
}

const click = (el: HTMLElement) => fireEvent.click(el);

afterEach(() => {
  cleanup();
});

describe("GridraToast", () => {
  it("renders children", () => {
    render(
      <GridraToastProvider>
        <div>Hello</div>
      </GridraToastProvider>,
    );
    expect(screen.getByText("Hello")).toBeTruthy();
  });

  it("throws when useToast is called outside a Provider", () => {
    const BadComponent = () => {
      useToast();
      return null;
    };

    expect(() => render(<BadComponent />)).toThrow(
      "useToast must be used within a <GridraToastProvider>",
    );
  });

  it("shows toast via portal when show() is called", () => {
    render(
      <GridraToastProvider>
        <ToastTrigger />
      </GridraToastProvider>,
    );

    click(screen.getByRole("button", { name: "Show toast" }));

    const toast = screen.getByRole("status");
    expect(toast.textContent).toContain("Test message");
    expect(toast.className).toContain("gridra-toast");
  });

  it("hides toast after default duration", () => {
    vi.useFakeTimers();

    render(
      <GridraToastProvider>
        <ToastTrigger />
      </GridraToastProvider>,
    );

    click(screen.getByRole("button", { name: "Show toast" }));

    expect(screen.getByRole("status")).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(3200);
    });

    expect(screen.queryByRole("status")).toBeNull();

    vi.useRealTimers();
  });

  it("respects duration override", () => {
    vi.useFakeTimers();

    render(
      <GridraToastProvider>
        <ToastTrigger options={{ duration: 1000 }} />
      </GridraToastProvider>,
    );

    click(screen.getByRole("button", { name: "Show toast" }));

    expect(screen.getByRole("status")).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    expect(screen.queryByRole("status")).toBeNull();

    vi.useRealTimers();
  });

  it("queues multiple toasts and shows them FIFO", () => {
    vi.useFakeTimers();

    render(
      <GridraToastProvider>
        <ToastTrigger message="First" />
        <ToastTrigger message="Second" />
      </GridraToastProvider>,
    );

    const [btn1, btn2] = screen.getAllByRole("button", { name: "Show toast" });

    click(btn1);
    click(btn2);

    expect(screen.getByRole("status").textContent).toContain("First");

    act(() => {
      vi.advanceTimersByTime(3200);
    });

    expect(screen.getByRole("status").textContent).toContain("Second");

    act(() => {
      vi.advanceTimersByTime(3200);
    });

    expect(screen.queryByRole("status")).toBeNull();

    vi.useRealTimers();
  });

  it("plays the exit animation before showing the next queued toast", () => {
    vi.useFakeTimers();

    render(
      <GridraToastProvider>
        <ToastTrigger message="First" options={{ duration: 1000 }} />
        <ToastTrigger message="Second" options={{ duration: 1000 }} />
      </GridraToastProvider>,
    );

    const [btn1, btn2] = screen.getAllByRole("button", { name: "Show toast" });

    click(btn1);
    click(btn2);

    const firstToast = screen.getByRole("status");
    expect(firstToast.textContent).toContain("First");
    expect(firstToast.className).not.toContain("gridra-toast--exiting");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByRole("status").textContent).toContain("First");
    expect(screen.getByRole("status").className).toContain("gridra-toast--exiting");

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(screen.getByRole("status").textContent).toContain("Second");
    expect(screen.getByRole("status").className).not.toContain("gridra-toast--exiting");

    vi.useRealTimers();
  });

  it("applies explicit role override", () => {
    render(
      <GridraToastProvider>
        <ToastTrigger options={{ role: "alert" }} />
      </GridraToastProvider>,
    );

    click(screen.getByRole("button", { name: "Show toast" }));

    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("passes className to toast element", () => {
    render(
      <GridraToastProvider>
        <ToastTrigger options={{ className: "custom-toast" }} />
      </GridraToastProvider>,
    );

    click(screen.getByRole("button", { name: "Show toast" }));

    expect(screen.getByRole("status").className).toContain("custom-toast");
  });

  it("renders a non-root viewport with theme class in portal", () => {
    const root = document.createElement("div");
    root.className = "gridra-theme-dark";
    document.body.appendChild(root);

    render(
      <GridraToastProvider>
        <ToastTrigger />
      </GridraToastProvider>,
    );

    click(screen.getByRole("button", { name: "Show toast" }));

    const viewport = document.body.querySelector(".gridra-toast__viewport");
    expect(viewport).toBeTruthy();
    expect(viewport!.className).toContain("gridra-toast__portal");
    expect(viewport!.className).not.toContain("gridra-root");
    expect(viewport!.className).toContain("gridra-theme-dark");

    document.body.removeChild(root);
  });

  it("keeps provider children visible while the viewport is mounted", () => {
    render(
      <GridraToastProvider>
        <ToastTrigger />
        <main aria-label="App content">Visible app content</main>
      </GridraToastProvider>,
    );

    click(screen.getByRole("button", { name: "Show toast" }));

    expect(screen.getByLabelText("App content").textContent).toContain(
      "Visible app content",
    );
    expect(document.body.querySelector(".gridra-toast__viewport")).toBeTruthy();
  });

  it("cleans up timer on unmount", () => {
    vi.useFakeTimers();

    const { unmount } = render(
      <GridraToastProvider>
        <ToastTrigger />
      </GridraToastProvider>,
    );

    click(screen.getByRole("button", { name: "Show toast" }));

    expect(screen.getByRole("status")).toBeTruthy();

    unmount();

    vi.advanceTimersByTime(5000);

    expect(document.body.querySelector(".gridra-toast__viewport")).toBeNull();

    vi.useRealTimers();
  });
});
