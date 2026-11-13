import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { trapTabFocus } from "./focus";

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

function setup(markup: string) {
  const outside = document.createElement("button");
  outside.textContent = "Outside";
  const container = document.createElement("div");
  container.innerHTML = markup;
  document.body.append(outside, container);

  return { container, outside };
}

function pressTab(container: HTMLElement, shiftKey = false) {
  const event = new KeyboardEvent("keydown", {
    key: "Tab",
    shiftKey,
    cancelable: true,
  });
  trapTabFocus(container, event);

  return event;
}

describe("trapTabFocus", () => {
  it("wraps Tab from the last element to the first", () => {
    const { container } = setup(
      "<button>First</button><button>Middle</button><button>Last</button>",
    );
    const [first, , last] = Array.from(container.querySelectorAll("button"));
    last.focus();

    const event = pressTab(container);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);
  });

  it("wraps Shift+Tab from the first element to the last", () => {
    const { container } = setup(
      "<button>First</button><button>Middle</button><button>Last</button>",
    );
    const [first, , last] = Array.from(container.querySelectorAll("button"));
    first.focus();

    const event = pressTab(container, true);

    expect(event.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);
  });

  it("leaves Tab between inner elements to the browser", () => {
    const { container } = setup(
      "<button>First</button><button>Middle</button><button>Last</button>",
    );
    const middle = container.querySelectorAll("button")[1];
    middle.focus();

    expect(pressTab(container).defaultPrevented).toBe(false);
    expect(pressTab(container, true).defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(middle);
  });

  it("pulls focus back in when it is outside the container", () => {
    const { container, outside } = setup(
      "<button>First</button><button>Last</button>",
    );
    const [first, last] = Array.from(container.querySelectorAll("button"));

    outside.focus();
    pressTab(container);

    expect(document.activeElement).toBe(first);

    outside.focus();
    pressTab(container, true);

    expect(document.activeElement).toBe(last);
  });

  it("skips disabled and tabindex=-1 elements", () => {
    const { container } = setup(
      '<button>First</button><button>Last</button><button disabled>Disabled</button><button tabindex="-1">Skipped</button>',
    );
    const [first, last] = Array.from(container.querySelectorAll("button"));
    last.focus();

    pressTab(container);

    expect(document.activeElement).toBe(first);
  });

  it("blocks Tab when the container has no focusable element", () => {
    const { container, outside } = setup("<p>Text only</p>");
    outside.focus();

    expect(pressTab(container).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(outside);
  });

  it("ignores keys other than Tab", () => {
    const { container } = setup("<button>First</button><button>Last</button>");
    const last = container.querySelectorAll("button")[1];
    last.focus();
    const event = new KeyboardEvent("keydown", {
      key: "ArrowDown",
      cancelable: true,
    });

    trapTabFocus(container, event);

    expect(event.defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(last);
  });

  it("accepts a React keyboard event from onKeyDown", () => {
    render(
      <div
        data-testid="container"
        onKeyDown={(event) => trapTabFocus(event.currentTarget, event)}
      >
        <button>First</button>
        <button>Last</button>
      </div>,
    );
    const last = screen.getByRole("button", { name: "Last" });
    last.focus();

    const notPrevented = fireEvent.keyDown(last, { key: "Tab" });

    expect(notPrevented).toBe(false);
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "First" }),
    );
  });
});
