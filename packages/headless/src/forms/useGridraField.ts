import { useId, type AriaAttributes } from "react";

export interface GridraFieldControlProps extends AriaAttributes {
  id?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
}

export interface UseGridraFieldOptions {
  controlProps?: GridraFieldControlProps;
  hasControl?: boolean;
  htmlFor?: string;
  hintId?: string;
  errorId?: string;
  hasHint?: boolean;
  hasError?: boolean;
  disabled?: boolean;
  required?: boolean;
  usesAriaRequired?: boolean;
  supportsInvalid?: boolean;
  hasControlDescription?: boolean;
}

/** ラベル・説明・エラーとコントロールの関連付けを解決する。 */
export function useGridraField({
  controlProps,
  hasControl = true,
  htmlFor,
  hintId,
  errorId,
  hasHint = false,
  hasError = false,
  disabled = false,
  required = false,
  usesAriaRequired = false,
  supportsInvalid = false,
  hasControlDescription = false,
}: UseGridraFieldOptions = {}) {
  const generatedId = useId();
  const controlId = hasControl
    ? (controlProps?.id ?? htmlFor ?? generatedId)
    : htmlFor;
  const resolvedHintId =
    hintId ?? (hasControl ? controlId + "-hint" : undefined);
  const resolvedErrorId =
    errorId ?? (hasControl ? controlId + "-error" : undefined);
  const resolvedDisabled = controlProps?.disabled ?? disabled;
  const ariaRequired = controlProps?.["aria-required"];
  const resolvedRequired =
    controlProps?.required ??
    (ariaRequired === undefined
      ? required
      : ariaRequired === true || ariaRequired === "true");
  const resolvedInvalid = controlProps?.invalid ?? hasError;
  const descriptionIds = [
    controlProps?.["aria-describedby"],
    hasControlDescription ? controlId + "-description" : undefined,
    hasError ? resolvedErrorId : hasHint ? resolvedHintId : undefined,
  ]
    .filter(Boolean)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean);
  const controlBindings = {
    id: controlId,
    disabled: resolvedDisabled,
    ...(usesAriaRequired
      ? { "aria-required": resolvedRequired }
      : { required: resolvedRequired }),
    ...(supportsInvalid ? { invalid: resolvedInvalid } : {}),
    "aria-invalid":
      controlProps?.["aria-invalid"] ?? (resolvedInvalid ? true : undefined),
    "aria-describedby": descriptionIds.length
      ? [...new Set(descriptionIds)].join(" ")
      : undefined,
  };

  return {
    controlId,
    resolvedHintId,
    resolvedErrorId,
    resolvedDisabled,
    resolvedRequired,
    resolvedInvalid,
    controlProps: controlBindings,
    labelProps: { htmlFor: controlId },
    hintProps: { id: resolvedHintId },
    errorProps: { id: resolvedErrorId },
  };
}
