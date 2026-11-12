import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { useGridraRadio } from "./useGridraRadio";

afterEach(cleanup);

function Example({ explicit = false }: { explicit?: boolean }) {
  const c = useGridraRadio({
    hasDescription: true,
    invalid: true,
    inputProps: explicit
      ? {
          id: "chosen",
          "aria-describedby": "external",
          "aria-invalid": false,
          disabled: true,
        }
      : {},
  });

  return (
    <>
      <label>
        <input {...c.inputProps} />
        Choice
      </label>
      <p {...c.descriptionProps}>Description</p>
    </>
  );
}

it("connects native input and description", () => {
  render(<Example />);
  const input = screen.getByRole("radio");

  expect(input.getAttribute("aria-describedby")).toBe(
    screen.getByText("Description").id,
  );
  expect(input.getAttribute("aria-invalid")).toBe("true");
});

it("preserves explicit attributes and disabled state", () => {
  render(<Example explicit />);
  const input = screen.getByRole("radio");

  expect(input.id).toBe("chosen");
  expect(input.getAttribute("aria-describedby")).toBe("external");
  expect(input.getAttribute("aria-invalid")).toBe("false");
  expect(input.hasAttribute("disabled")).toBe(true);
});
