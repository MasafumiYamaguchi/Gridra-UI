import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { createRef, type RefObject } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { useGridraPopover } from "../index";

afterEach(cleanup);

function Example({
  disabled = false,
  open,
  onOpenChange,
}: {
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (next: boolean, previous: boolean) => void;
}) {
  const p = useGridraPopover({ disabled, open, onOpenChange });

  return (
    <>
      <button {...p.getTriggerProps()}>Open</button>
      {p.currentOpen ? <div {...p.getContentProps()}>Content</div> : null}
    </>
  );
}

it("opens caller-owned content and closes on Escape and outside pointerdown", () => {
  render(<Example />);

  fireEvent.click(screen.getByRole("button"));

  expect(screen.getByText("Content")).toBeTruthy();

  fireEvent.keyDown(document, { key: "Escape" });

  expect(screen.queryByText("Content")).toBeNull();

  fireEvent.click(screen.getByRole("button"));
  fireEvent.pointerDown(document.body);

  expect(screen.queryByText("Content")).toBeNull();
});

it("keeps disabled actions inert and controlled state owned externally", () => {
  const onOpenChange = vi.fn();
  const { rerender } = render(<Example disabled onOpenChange={onOpenChange} />);

  fireEvent.click(screen.getByRole("button"));

  expect(onOpenChange).not.toHaveBeenCalled();

  rerender(<Example open={false} onOpenChange={onOpenChange} />);
  fireEvent.click(screen.getByRole("button"));

  expect(onOpenChange).toHaveBeenCalledWith(true, false);
  expect(screen.queryByText("Content")).toBeNull();
});

function ContentPropsExample({
  contentRef,
}: {
  contentRef: RefObject<HTMLDivElement | null>;
}) {
  const p = useGridraPopover({ defaultOpen: true });

  return (
    <>
      <button {...p.getTriggerProps()}>Open</button>
      <div
        {...p.getContentProps({
          ref: contentRef,
          style: { position: "absolute", color: "red" },
        })}
      >
        Content
      </div>
    </>
  );
}

it("links content by id and applies structural fixed positioning over caller style", () => {
  const contentRef = createRef<HTMLDivElement>();
  render(<ContentPropsExample contentRef={contentRef} />);

  const content = screen.getByText("Content");

  expect(screen.getByRole("button").getAttribute("aria-controls")).toBe(content.id);
  expect(contentRef.current).toBe(content);
  expect(content.style.position).toBe("fixed");
  expect(content.style.color).toBe("red");
});
