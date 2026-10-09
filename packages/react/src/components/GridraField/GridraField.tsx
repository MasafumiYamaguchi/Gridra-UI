import { cloneElement, useId, type AriaAttributes, type HTMLAttributes, type ReactElement, type ReactNode } from "react";
import { cx } from "../../internal/classNames";
import { GridraCheckbox } from "../GridraCheckbox";
import { GridraErrorMessage } from "../GridraErrorMessage";
import { GridraInput } from "../GridraInput";
import { GridraLabel } from "../GridraLabel";
import { GridraRadio } from "../GridraRadio";
import { GridraSelect } from "../GridraSelect";
import { GridraSwitch } from "../GridraSwitch";
import { GridraTextarea } from "../GridraTextarea";

export interface GridraFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Recommended single-control composition. The control must forward id and ARIA attributes to a labelable element. */
  control?: ReactElement;
  disabled?: boolean;
  error?: ReactNode;
  errorId?: string;
  hint?: ReactNode;
  hintId?: string;
  htmlFor?: string;
  label: ReactNode;
  orientation?: "vertical" | "horizontal";
  required?: boolean;
}

interface ControlProps extends AriaAttributes {
  id?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  description?: ReactNode;
}
const invalidControls = new Set<unknown>([GridraInput, GridraTextarea, GridraSelect, GridraCheckbox, GridraRadio, GridraSwitch]);

export function GridraField({
  children,
  className,
  control,
  disabled = false,
  error,
  errorId,
  hint,
  hintId,
  htmlFor,
  label,
  orientation = "vertical",
  required = false,
  ...props
}: GridraFieldProps) {
  const generatedId = useId();
  const controlProps = control?.props as ControlProps | undefined;
  const controlId = control ? controlProps?.id ?? htmlFor ?? generatedId : htmlFor;
  const resolvedHintId = hintId ?? (control ? `${controlId}-hint` : undefined);
  const resolvedErrorId = errorId ?? (control ? `${controlId}-error` : undefined);
  const currentDescriptionId = error ? resolvedErrorId : hint ? resolvedHintId : undefined;
  const resolvedDisabled = controlProps?.disabled ?? disabled;
  const ariaRequired = controlProps?.["aria-required"];
  const resolvedRequired = controlProps?.required ?? (ariaRequired === undefined ? required : ariaRequired === true || ariaRequired === "true");
  const resolvedInvalid = controlProps?.invalid ?? Boolean(error);
  const describedBy = [
    controlProps?.["aria-describedby"],
    control && (control.type === GridraCheckbox || control.type === GridraRadio) && controlProps?.description ? `${controlId}-description` : undefined,
    currentDescriptionId,
  ].filter(Boolean).join(" ").split(/\s+/).filter(Boolean);
  const linkedControl = control ? cloneElement(control as ReactElement<ControlProps>, {
    id: controlId,
    disabled: resolvedDisabled,
    ...(control.type === GridraSwitch || control.type === "button"
      ? { "aria-required": resolvedRequired }
      : { required: resolvedRequired }),
    ...(invalidControls.has(control.type) ? { invalid: resolvedInvalid } : {}),
    "aria-invalid": controlProps?.["aria-invalid"] ?? (resolvedInvalid ? true : undefined),
    "aria-describedby": describedBy.length ? [...new Set(describedBy)].join(" ") : undefined,
  }) : children;
  const fieldClassName = cx(
    "gridra-field",
    `gridra-field--${orientation}`,
    error ? "gridra-field--invalid" : null,
    resolvedDisabled ? "gridra-field--disabled" : null,
    resolvedRequired ? "gridra-field--required" : null,
    className,
  );
  return (
    <div className={fieldClassName} {...props}>
      <GridraLabel className="gridra-field__label" htmlFor={controlId}>
        {label}
        {resolvedRequired ? <span className="gridra-field__required" aria-hidden="true">*</span> : null}
      </GridraLabel>
      {linkedControl}
      {hint && !error ? <div className="gridra-field__hint" id={resolvedHintId}>{hint}</div> : null}
      {error ? <GridraErrorMessage className="gridra-field__error" id={resolvedErrorId}>{error}</GridraErrorMessage> : null}
    </div>
  );
}
