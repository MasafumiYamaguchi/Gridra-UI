import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { PropsTable } from "./props-table";
import { boxDoc } from "./data/components/gridra-box";

afterEach(cleanup);

describe("documentation props table", () => {
  it("groups Box props without dropping rows and displays available values", () => {
    const { container } = render(<PropsTable props={boxDoc.props} />);
    expect(Array.from(container.querySelectorAll(".docs-props-group"), (row) => row.textContent))
      .toEqual(["Element", "Spacing", "Appearance", "Layout"]);
    const names = Array.from(container.querySelectorAll(".docs-prop-name"), (node) => node.textContent);
    expect(names.length).toBe(boxDoc.props.length);
    for (const prop of boxDoc.props) expect(names).toContain(prop.name);
    const asRow = screen.getByText("as").closest("tr")!;
    expect(within(asRow).getByText("section")).toBeTruthy();
    expect(within(asRow).getByText('"div"')).toBeTruthy();
  });

  it("preserves complex types and defaults when displaying a plain prop list", () => {
    const { container } = render(<PropsTable props={[
      { name: "onChange", type: "(() => void) | undefined", description: "Change callback." },
      { name: "open", type: "boolean", default: "false", description: "Open state." },
    ]} />);
    expect(screen.getByText("(() => void) | undefined")).toBeTruthy();
    expect(screen.getByText("false")).toBeTruthy();
    expect(screen.getByText("—")).toBeTruthy();
    expect(container.querySelector(".docs-props-group")).toBeNull();
  });
});
