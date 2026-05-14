import { useId, type InputHTMLAttributes, type ReactNode } from "react";

export type GridraRadioSize = "sm" | "md" | "lg";

export interface GridraRadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  description?: ReactNode;
  invalid?: boolean;
  label?: string;
  size?: GridraRadioSize;
}

export function GridraRadio({
  "aria-invalid": ariaInvalid,
  className,
  description,
  invalid = false,
  label,
  size = "md",
  ...props
}: GridraRadioProps) {
  const generatedId = useId();
  const controlId = props.id ?? generatedId;
  const descriptionId = description ? `${controlId}-description` : undefined;
  const radioClassName = [
    "gridra-radio",
    `gridra-radio--${size}`,
    invalid ? "gridra-radio--invalid" : null,
    className
  ]
    .filter(Boolean)
    .join(" ");
  const resolvedAriaInvalid = ariaInvalid ?? (invalid ? true : undefined);

  return (
    <label className={radioClassName}>
      <input
        aria-describedby={descriptionId}
        aria-invalid={resolvedAriaInvalid}
        className="gridra-radio__input"
        id={controlId}
        type="radio"
        {...props}
      />
      <span className="gridra-radio__mark" aria-hidden="true" />
      {label || description ? (
        <span className="gridra-radio__content">
          {label ? <span className="gridra-radio__label">{label}</span> : null}
          {description ? (
            <span id={descriptionId} className="gridra-radio__description" aria-hidden="true">
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
