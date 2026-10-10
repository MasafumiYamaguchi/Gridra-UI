import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraStepper } from "./GridraStepper";
import type { GridraStepperVariant } from "./GridraStepper";

afterEach(() => cleanup());

describe("GridraStepper", () => {
  const basicItems = [
    { id: "a", label: "Step A" },
    { id: "b", label: "Step B" },
    { id: "c", label: "Step C" },
  ];

  it("renders a nav with aria-label", () => {
    render(<GridraStepper items={basicItems} />);
    const nav = screen.getByRole("navigation", { name: "Progress" });
    expect(nav.tagName).toBe("NAV");
  });

  it("respects custom aria-label", () => {
    render(<GridraStepper items={basicItems} aria-label="Setup steps" />);
    expect(screen.getByRole("navigation", { name: "Setup steps" })).toBeDefined();
  });

  it("renders an ordered list of steps", () => {
    render(<GridraStepper items={basicItems} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(3);
    expect(screen.getByText("Step A")).toBeDefined();
    expect(screen.getByText("Step B")).toBeDefined();
    expect(screen.getByText("Step C")).toBeDefined();
  });

  it("marks current step with aria-current", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="b" />);
    const button = screen.getByRole("button", { name: /Step B/ });
    expect(button.getAttribute("aria-current")).toBe("step");
  });

  it("does not mark other steps with aria-current", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="b" />);
    const btnA = screen.getByRole("button", { name: /Step A/ });
    expect(btnA.hasAttribute("aria-current")).toBe(false);
    const btnC = screen.getByRole("button", { name: /Step C/ });
    expect(btnC.hasAttribute("aria-current")).toBe(false);
  });

  it("applies completed class to steps before current", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="b" />);
    const itemA = screen.getByRole("button", { name: /Step A/ }).closest("li")!;
    expect(itemA.className).toContain("gridra-stepper__item--completed");
  });

  it("applies current class to the current step", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="b" />);
    const itemB = screen.getByRole("button", { name: /Step B/ }).closest("li")!;
    expect(itemB.className).toContain("gridra-stepper__item--current");
  });

  it("applies pending class to steps after current", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="b" />);
    const itemC = screen.getByRole("button", { name: /Step C/ }).closest("li")!;
    expect(itemC.className).toContain("gridra-stepper__item--pending");
  });

  it("fires onStepChange when completed step clicked", () => {
    const onStepChange = vi.fn();
    render(
      <GridraStepper items={basicItems} defaultCurrentId="c" onStepChange={onStepChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Step A/ }));
    expect(onStepChange).toHaveBeenCalledWith("a", "c");
  });

  it("does not fire onStepChange when current step clicked", () => {
    const onStepChange = vi.fn();
    render(
      <GridraStepper items={basicItems} defaultCurrentId="b" onStepChange={onStepChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Step B/ }));
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it("pending steps are disabled", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="a" />);
    const btnC = screen.getByRole("button", { name: /Step C/ }) as HTMLButtonElement;
    expect(btnC.getAttribute("aria-disabled")).toBe("true");
  });

  it("pending steps do not fire callback", () => {
    const onStepChange = vi.fn();
    render(
      <GridraStepper items={basicItems} defaultCurrentId="a" onStepChange={onStepChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Step B/ }));
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it("supports controlled currentId", () => {
    const onStepChange = vi.fn();
    render(
      <GridraStepper items={basicItems} currentId="b" onStepChange={onStepChange} />,
    );
    expect(
      screen.getByRole("button", { name: /Step B/ }).getAttribute("aria-current"),
    ).toBe("step");
    fireEvent.click(screen.getByRole("button", { name: /Step A/ }));
    expect(onStepChange).toHaveBeenCalledWith("a", "b");
  });

  it("falls back to first enabled step for unknown id", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="nonexistent" />);
    expect(
      screen.getByRole("button", { name: /Step A/ }).getAttribute("aria-current"),
    ).toBe("step");
  });

  it("falls back to first enabled step when defaultCurrentId points at a disabled step", () => {
    const items = [
      { id: "a", label: "Step A", disabled: true },
      { id: "b", label: "Step B" },
      { id: "c", label: "Step C" },
    ];
    render(<GridraStepper items={items} defaultCurrentId="a" />);

    expect(screen.getByRole("button", { name: /Step B/ }).getAttribute("aria-current")).toBe("step");
    expect((screen.getByRole("button", { name: /Step A/ }) as HTMLButtonElement).getAttribute("aria-disabled")).toBe("true");
  });

  it("falls back to first enabled step when controlled currentId points at a disabled step", () => {
    const items = [
      { id: "a", label: "Step A", disabled: true },
      { id: "b", label: "Step B" },
      { id: "c", label: "Step C" },
    ];
    render(<GridraStepper items={items} currentId="a" />);

    expect(screen.getByRole("button", { name: /Step B/ }).getAttribute("aria-current")).toBe("step");
  });

  it("falls back to first enabled step for empty currentId", () => {
    render(<GridraStepper items={basicItems} currentId="" />);
    expect(screen.getByRole("button", { name: /Step A/ }).getAttribute("aria-current")).toBe("step");
  });

  it("has no current step and disables every button for all-disabled items", () => {
    const items = [
      { id: "a", label: "A", disabled: true },
      { id: "b", label: "B", disabled: true },
    ];
    render(<GridraStepper items={items} defaultCurrentId="a" />);

    expect(screen.queryByRole("button", { current: "step" })).toBeNull();
    for (const button of screen.getAllByRole("button")) {
      expect((button as HTMLButtonElement).disabled).toBe(false);
      expect(button.getAttribute("aria-disabled")).toBe("true");
    }
  });

  it("does not crash with empty items", () => {
    render(<GridraStepper items={[]} />);
    const nav = screen.getByRole("navigation");
    expect(nav).toBeDefined();
    expect(screen.queryByRole("listitem")).toBeNull();
  });

  it("updates current in uncontrolled mode on click", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="c" />);
    fireEvent.click(screen.getByRole("button", { name: /Step A/ }));
    expect(
      screen.getByRole("button", { name: /Step A/ }).getAttribute("aria-current"),
    ).toBe("step");
  });

  it("does not update controlled current after click", () => {
    const onStepChange = vi.fn();
    render(<GridraStepper items={basicItems} currentId="c" onStepChange={onStepChange} />);

    fireEvent.click(screen.getByRole("button", { name: /Step A/ }));

    expect(onStepChange).toHaveBeenCalledWith("a", "c");
    expect(screen.getByRole("button", { name: /Step C/ }).getAttribute("aria-current")).toBe("step");
  });

  it("uses fallback currentId as previousId for unknown controlled currentId", () => {
    const onStepChange = vi.fn();
    render(<GridraStepper items={basicItems} currentId="missing" onStepChange={onStepChange} />);

    fireEvent.click(screen.getByRole("button", { name: /Step A/ }));

    expect(onStepChange).not.toHaveBeenCalled();
  });

  it("renders orientation class", () => {
    render(<GridraStepper items={basicItems} orientation="vertical" />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("gridra-stepper--vertical");
  });

  it("renders size class", () => {
    render(<GridraStepper items={basicItems} size="sm" />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("gridra-stepper--sm");
  });

  it("passes className to root", () => {
    render(<GridraStepper items={basicItems} className="my-class" />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("my-class");
  });

  it("renders major slot classes", () => {
    const { container } = render(<GridraStepper items={basicItems} defaultCurrentId="b" />);

    expect(container.querySelector(".gridra-stepper__list")).toBeTruthy();
    expect(container.querySelector(".gridra-stepper__item")).toBeTruthy();
    expect(container.querySelector(".gridra-stepper__button")).toBeTruthy();
    expect(container.querySelector(".gridra-stepper__marker")).toBeTruthy();
    expect(container.querySelector(".gridra-stepper__content")).toBeTruthy();
    expect(container.querySelector(".gridra-stepper__label")).toBeTruthy();
    expect(container.querySelector(".gridra-stepper__connector")).toBeTruthy();
  });

  it("disables all steps when root disabled", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="b" disabled />);
    const buttons = screen.getAllByRole("button");
    for (const button of buttons) {
      expect((button as HTMLButtonElement).getAttribute("aria-disabled")).toBe("true");
    }
  });

  it("disables all steps when root disabled even current", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="a" disabled />);
    const btnA = screen.getByRole("button", { name: /Step A/ }) as HTMLButtonElement;
    expect(btnA.getAttribute("aria-disabled")).toBe("true");
  });

  it("does not fire onStepChange when root disabled", () => {
    const onStepChange = vi.fn();
    render(
      <GridraStepper items={basicItems} defaultCurrentId="c" disabled onStepChange={onStepChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Step A/ }));
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it("explicit disabled step is not interactive", () => {
    const items = [
      { id: "a", label: "Step A", disabled: true },
      { id: "b", label: "Step B" },
      { id: "c", label: "Step C" },
    ];
    render(<GridraStepper items={items} defaultCurrentId="b" />);
    const btnA = screen.getByRole("button", { name: /Step A/ }) as HTMLButtonElement;
    expect(btnA.getAttribute("aria-disabled")).toBe("true");
  });

  it("explicit disabled step does not fire onStepChange", () => {
    const onStepChange = vi.fn();
    const items = [
      { id: "a", label: "Step A", disabled: true },
      { id: "b", label: "Step B" },
      { id: "c", label: "Step C" },
    ];
    render(
      <GridraStepper items={items} defaultCurrentId="c" onStepChange={onStepChange} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Step A/ }));
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it("renders connectors between steps", () => {
    render(<GridraStepper items={basicItems} />);
    const connectors = document.querySelectorAll(".gridra-stepper__connector");
    expect(connectors).toHaveLength(2);
  });

  it("renders no connector on last step", () => {
    const items = [{ id: "a", label: "Only" }];
    render(<GridraStepper items={items} />);
    expect(document.querySelector(".gridra-stepper__connector")).toBeNull();
  });

  it("connectors have aria-hidden", () => {
    render(<GridraStepper items={basicItems} />);
    const connector = document.querySelector(".gridra-stepper__connector")!;
    expect(connector.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders descriptions", () => {
    const items = [
      { id: "a", label: "Step A", description: "Details A" },
      { id: "b", label: "Step B" },
    ];
    render(<GridraStepper items={items} />);
    expect(screen.getByText("Details A")).toBeDefined();
  });

  it("applies button completed class to completed steps", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="c" />);
    const btnA = screen.getByRole("button", { name: /Step A/ });
    expect(btnA.className).toContain("gridra-stepper__button--completed");
  });

  it("applies button pending class to pending steps", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="a" />);
    const btnB = screen.getByRole("button", { name: /Step B/ });
    expect(btnB.className).toContain("gridra-stepper__button--pending");
  });

  it("applies button current class to current step", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="b" />);
    const btnB = screen.getByRole("button", { name: /Step B/ });
    expect(btnB.className).toContain("gridra-stepper__button--current");
  });

  it("connector gets completed class when step is before current", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="b" />);
    const connectors = document.querySelectorAll(".gridra-stepper__connector");
    expect(connectors[0].className).toContain("gridra-stepper__connector--completed");
  });

  it("connector gets current class when step is current", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="b" />);
    const connectors = document.querySelectorAll(".gridra-stepper__connector");
    expect(connectors[1].className).toContain("gridra-stepper__connector--current");
  });

  it("connector gets pending class when step is after current", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="a" />);
    const connectors = document.querySelectorAll(".gridra-stepper__connector");
    expect(connectors[1].className).toContain("gridra-stepper__connector--pending");
  });

});

describe("GridraStepper variants", () => {
  const variants: GridraStepperVariant[] = ["cards", "ruler", "line", "boxes"];
  const items = [
    { id: "cart", label: "Cart", description: "2 items" },
    { id: "shipping", label: "Shipping", description: "Tokyo, Japan" },
    { id: "payment", label: "Payment", description: "Card ending 4242" },
    { id: "confirm", label: "Confirm" },
  ];

  it.each(variants)("keeps unavailable %s steps focusable without permitting activation", (variant) => {
    const onStepChange = vi.fn();
    const states = [items[0], { ...items[1], disabled: true }, ...items.slice(2)];
    const { rerender } = render(<GridraStepper variant={variant} items={states} currentId="payment" onStepChange={onStepChange} />);
    for (const name of ["Locked: 2 Shipping Tokyo, Japan", "4 Confirm"]) {
      const button = screen.getByRole("button", { name }) as HTMLButtonElement;
      expect(button.disabled).toBe(false);
      expect(button.tabIndex).toBe(0);
      expect(button.getAttribute("aria-disabled")).toBe("true");
      button.focus();
      expect(document.activeElement).toBe(button);
      button.click();
    }
    expect(onStepChange).not.toHaveBeenCalled();
    const completed = screen.getByRole("button", { name: "Completed: 1 Cart 2 items" });
    completed.click();
    expect(onStepChange).toHaveBeenCalledWith("cart", "payment");
    onStepChange.mockClear();
    rerender(<GridraStepper variant={variant} items={states} currentId="payment" disabled onStepChange={onStepChange} />);
    completed.focus();
    expect(document.activeElement).toBe(completed);
    completed.click();
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it("localizes visual and announced text through labels", () => {
    const labels = {
      navigation: "手順", progress: "進捗", completed: "完了:", locked: "ロック:", lockedStatus: "ロック",
      step: "手順", active: "現在", now: "今", start: "開始", end: "終了", noCurrentStep: "現在の手順はありません",
      position: (step: number, total: number) => `${total}件中${step}件目`,
      summary: (percentage: number, position: string) => `${position}・${percentage}%`,
    };
    const states = [items[0], { ...items[1], disabled: true }, ...items.slice(2)];
    const { rerender } = render(<GridraStepper variant="cards" labels={labels} items={states} currentId="payment" />);
    expect(screen.getByRole("button", { name: "完了: 1 Cart 2 items" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "ロック: 2 Shipping Tokyo, Japan" })).toBeTruthy();
    expect(screen.getByText("手順 03")).toBeTruthy();
    expect(screen.getByText("現在")).toBeTruthy();
    expect(screen.getByText("ロック")).toBeTruthy();
    rerender(<GridraStepper variant="ruler" labels={labels} items={states} currentId="payment" />);
    expect(screen.getByRole("progressbar", { name: "手順 進捗" }).getAttribute("aria-valuetext")).toBe("4件中3件目");
    expect(screen.getByText("4件中3件目・67%")).toBeTruthy();
    expect(screen.getByText("開始")).toBeTruthy();
    expect(screen.getByText("終了")).toBeTruthy();
    rerender(<GridraStepper variant="line" labels={labels} items={states} currentId="payment" />);
    expect(screen.getByText("今")).toBeTruthy();
    rerender(<GridraStepper variant="ruler" labels={labels} items={states.map((item) => ({ ...item, disabled: true }))} />);
    expect(screen.getByRole("progressbar", { name: "手順 進捗" }).getAttribute("aria-valuetext")).toBe("現在の手順はありません");
  });

  it("gives future locked connectors a locked state rather than a pending state", () => {
    const { container } = render(<GridraStepper currentId="cart"
      items={[items[0], { ...items[1], disabled: true }, ...items.slice(2)]} />);
    const connectors = container.querySelectorAll(".gridra-stepper__connector");
    expect(connectors[1].classList.contains("gridra-stepper__connector--locked")).toBe(true);
    expect(connectors[1].classList.contains("gridra-stepper__connector--pending")).toBe(false);
    expect(connectors[2].classList.contains("gridra-stepper__connector--pending")).toBe(true);
  });

  it.each(variants)("preserves progress and backtracking with %s in either direction", (variant) => {
    const onStepChange = vi.fn();
    const { rerender } = render(<GridraStepper variant={variant} items={items}
      currentId="payment" onStepChange={onStepChange} />);
    expect(screen.getByRole("button", { name: /Payment/ }).getAttribute("aria-current")).toBe("step");
    expect(screen.getByRole("button", { name: /Cart/ }).textContent).toContain("Completed:");
    expect((screen.getByRole("button", { name: /Confirm/ }) as HTMLButtonElement).getAttribute("aria-disabled")).toBe("true");
    fireEvent.click(screen.getByRole("button", { name: /Cart/ }));
    expect(onStepChange).toHaveBeenCalledWith("cart", "payment");
    onStepChange.mockClear();
    rerender(<GridraStepper variant={variant} orientation="vertical" items={items}
      currentId="shipping" onStepChange={onStepChange} />);
    expect(screen.getByRole("button", { name: /Shipping/ }).getAttribute("aria-current")).toBe("step");
    fireEvent.click(screen.getByRole("button", { name: /Payment/ }));
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it.each(variants)("keeps explicitly locked steps distinct from completed steps in %s", (variant) => {
    const onStepChange = vi.fn();
    render(<GridraStepper variant={variant} items={[{ ...items[0], disabled: true }, ...items.slice(1)]}
      currentId="payment" onStepChange={onStepChange} />);
    const locked = screen.getByRole("button", { name: /Cart/ }) as HTMLButtonElement;
    expect(locked.getAttribute("aria-disabled")).toBe("true");
    expect(locked.textContent).not.toContain("Completed:");
    expect(locked.classList.contains("gridra-stepper__button--locked")).toBe(true);
    fireEvent.click(locked);
    expect(onStepChange).not.toHaveBeenCalled();
  });

  it("uses square boxes by default instead of the old rounded markers", () => {
    render(<GridraStepper items={items} currentId="payment" />);
    expect(screen.getByRole("navigation").classList.contains("gridra-stepper--boxes")).toBe(true);
    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("announces ruler progress and updates it when the controlled step advances", () => {
    const { rerender } = render(<GridraStepper variant="ruler" items={items} currentId="payment" />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("67");
    expect(screen.getByRole("progressbar").getAttribute("aria-valuetext")).toBe("Step 3 of 4");
    expect(screen.getByText("67% · STEP 3 OF 4")).toBeTruthy();
    rerender(<GridraStepper variant="ruler" orientation="vertical" items={items} currentId="confirm" />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
    expect(screen.getByRole("progressbar").getAttribute("aria-valuetext")).toBe("Step 4 of 4");
    expect(screen.queryByText("START")).toBeNull();
  });

  it("does not invent a current ruler position for an all-locked list", () => {
    const { container } = render(<GridraStepper variant="ruler" items={items.map((item) => ({ ...item, disabled: true }))} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
    expect(screen.getByRole("progressbar").getAttribute("aria-valuetext")).toBe("No current step");
    expect(container.querySelector(".gridra-stepper__ruler-thumb")).toBeNull();
  });

  it("handles a single ruler step and an empty ruler without invalid geometry", () => {
    const { rerender } = render(<GridraStepper variant="ruler" items={[items[0]]} />);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("100");
    expect(screen.getByRole("navigation").style.getPropertyValue("--gridra-stepper-progress")).toBe("100%");
    expect(document.querySelector<HTMLElement>(".gridra-stepper__ruler-tick")?.style.left).toBe("100%");
    expect(screen.getByText("100% · STEP 1 OF 1")).toBeTruthy();
    rerender(<GridraStepper variant="ruler" items={[]} />);
    expect(screen.queryByRole("progressbar")).toBeNull();
    expect(screen.getByRole("navigation").style.getPropertyValue("--gridra-stepper-progress")).toBe("0%");
  });

  it("distinguishes simultaneous ruler progressbars by the stepper's label", () => {
    render(<>
      <GridraStepper variant="ruler" items={items} aria-label="Checkout" />
      <GridraStepper variant="ruler" items={items} aria-label="Setup" orientation="vertical" />
    </>);
    expect(screen.getByRole("progressbar", { name: "Checkout step progress" })).toBeTruthy();
    expect(screen.getByRole("progressbar", { name: "Setup step progress" })).toBeTruthy();
  });

  it.each(variants)("announces each number and locked/completed status exactly once in %s", (variant) => {
    const states = [items[0], { ...items[1], disabled: true }, ...items.slice(2)];
    const { rerender } = render(<GridraStepper variant={variant} items={states} currentId="payment" />);
    for (const orientation of ["horizontal", "vertical"] as const) {
      rerender(<GridraStepper variant={variant} items={states} currentId="payment" orientation={orientation} />);
      expect(screen.getByRole("button", { name: "Completed: 1 Cart 2 items" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "Locked: 2 Shipping Tokyo, Japan" })).toBeTruthy();
      expect(screen.getByRole("button", { name: "3 Payment Card ending 4242" }).getAttribute("aria-current")).toBe("step");
      expect((screen.getByRole("button", { name: "4 Confirm" }) as HTMLButtonElement).getAttribute("aria-disabled")).toBe("true");
    }
  });

  it("inherits external labelledby names and their updates for ruler progressbars", () => {
    const examples = (checkoutLabel: string) => <>
      <h2 id="checkout-heading">{checkoutLabel}</h2><span id="workflow-label">workflow</span>
      <h2 id="setup-heading">Setup</h2>
      <GridraStepper variant="ruler" items={items} aria-label="Ignored"
        aria-labelledby="checkout-heading workflow-label" />
      <GridraStepper variant="ruler" items={items} aria-labelledby="setup-heading" />
    </>;
    const { rerender } = render(examples("Checkout"));
    expect(screen.getByRole("navigation", { name: "Checkout workflow" })).toBeTruthy();
    expect(screen.getByRole("progressbar", { name: "Checkout workflow step progress" })).toBeTruthy();
    expect(screen.getByRole("progressbar", { name: "Setup step progress" })).toBeTruthy();
    expect(screen.queryByRole("progressbar", { name: "Progress step progress" })).toBeNull();
    rerender(examples("Order"));
    expect(screen.getByRole("progressbar", { name: "Order workflow step progress" })).toBeTruthy();
  });

  it.each(["horizontal", "vertical"] as const)("colors reached ruler ticks across locked steps in %s", (orientation) => {
    const { container } = render(<GridraStepper variant="ruler" orientation={orientation}
      items={[items[0], { ...items[1], disabled: true }, ...items.slice(2)]} currentId="payment" />);
    const ticks = container.querySelectorAll(".gridra-stepper__ruler-tick");
    expect(ticks[0].classList.contains("gridra-stepper__ruler-tick--reached")).toBe(true);
    expect(ticks[1].classList.contains("gridra-stepper__ruler-tick--reached")).toBe(true);
    expect(ticks[2].classList.contains("gridra-stepper__ruler-tick--reached")).toBe(true);
    expect(ticks[3].classList.contains("gridra-stepper__ruler-tick--reached")).toBe(false);
  });

  it.each(["horizontal", "vertical"] as const)("uses the same visual and announced ruler position in %s", (orientation) => {
    const { rerender } = render(<GridraStepper variant="ruler" items={items} orientation={orientation} />);
    items.forEach((item, index) => {
      rerender(<GridraStepper variant="ruler" items={items} currentId={item.id} orientation={orientation} />);
      const position = parseFloat(screen.getByRole("navigation").style.getPropertyValue("--gridra-stepper-progress"));
      expect(position).toBeCloseTo(index / 3 * 100);
      expect(Number(screen.getByRole("progressbar").getAttribute("aria-valuenow"))).toBe(Math.round(position));
    });
  });

  it.each(["cards", "boxes"] as const)("fills traversed %s connectors across a locked step", (variant) => {
    const { container } = render(<GridraStepper variant={variant} currentId="payment"
      items={[items[0], { ...items[1], disabled: true }, ...items.slice(2)]} />);
    const connectors = container.querySelectorAll(".gridra-stepper__connector");
    expect(connectors[0].classList.contains("gridra-stepper__connector--completed")).toBe(true);
    expect(connectors[1].classList.contains("gridra-stepper__connector--completed")).toBe(true);
    expect(connectors[2].classList.contains("gridra-stepper__connector--completed")).toBe(false);
    expect(screen.getByRole("button", { name: /Shipping/ }).textContent).not.toContain("Completed:");
  });

  it.each(["horizontal", "vertical"] as const)("marks traversed line intervals through locked steps in %s", (orientation) => {
    render(<GridraStepper variant="line" orientation={orientation} currentId="payment"
      items={[items[0], { ...items[1], disabled: true }, ...items.slice(2)]} />);
    const locked = screen.getByRole("button", { name: "Locked: 2 Shipping Tokyo, Japan" }).closest("li")!;
    expect(locked.classList.contains("gridra-stepper__item--traversed")).toBe(true);
    expect(locked.classList.contains("gridra-stepper__item--completed")).toBe(false);
    expect(screen.getByRole("button", { name: "4 Confirm" }).closest("li")!
      .classList.contains("gridra-stepper__item--traversed")).toBe(false);
  });

  it("omits empty descriptions without dropping a numeric description", () => {
    const { container } = render(<GridraStepper items={[
      { id: "empty", label: "Empty", description: "" },
      { id: "false", label: "False", description: false },
      { id: "zero", label: "Zero", description: 0 },
    ]} />);
    expect(container.querySelectorAll(".gridra-stepper__description")).toHaveLength(1);
    expect(screen.getByRole("button", { name: /Zero/ }).textContent).toContain("0");
  });
});
