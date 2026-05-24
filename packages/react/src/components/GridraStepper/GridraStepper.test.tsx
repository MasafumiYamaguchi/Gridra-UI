import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraStepper } from "./GridraStepper";

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
    expect(btnC.disabled).toBe(true);
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
    expect((screen.getByRole("button", { name: /Step A/ }) as HTMLButtonElement).disabled).toBe(true);
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
      expect((button as HTMLButtonElement).disabled).toBe(true);
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
      expect((button as HTMLButtonElement).disabled).toBe(true);
    }
  });

  it("disables all steps when root disabled even current", () => {
    render(<GridraStepper items={basicItems} defaultCurrentId="a" disabled />);
    const btnA = screen.getByRole("button", { name: /Step A/ }) as HTMLButtonElement;
    expect(btnA.disabled).toBe(true);
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
    expect(btnA.disabled).toBe(true);
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
