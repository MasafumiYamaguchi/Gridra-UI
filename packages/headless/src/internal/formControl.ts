import { useId, type AriaAttributes } from "react";

type AriaInvalid = AriaAttributes["aria-invalid"];

export function resolveAriaInvalid(
  ariaInvalid: AriaInvalid | undefined,
  invalid: boolean,
): AriaInvalid | undefined {
  return ariaInvalid ?? (invalid ? true : undefined);
}

export function useControlDescriptionIds(
  id: string | undefined,
  hasDescription: boolean,
) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = hasDescription ? `${controlId}-description` : undefined;

  return { controlId, descriptionId };
}
