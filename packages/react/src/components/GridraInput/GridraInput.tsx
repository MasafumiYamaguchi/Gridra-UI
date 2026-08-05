import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "../../internal/classNames";
import { resolveAriaInvalid } from "../../internal/formControl";
import { GridraField } from "../GridraField";

export type GridraInputSize = "sm" | "md" | "lg";

// HTML属性とぶつかるため、InputHTMLAttributesからsizeを除外して独自定義する
export interface GridraInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  invalid?: boolean;
  label?: ReactNode;
  size?: GridraInputSize;
}

export function GridraInput({
  "aria-invalid": ariaInvalid,
  className,
  invalid = false,
  label,
  size = "md",
  type = "text",
  ...props
}: GridraInputProps) {
  const generatedId = useId();
  const controlId = props.id ?? generatedId;
  const input = (
    <input
      aria-invalid={resolveAriaInvalid(ariaInvalid, invalid)}
      className={cx("gridra-input", `gridra-input--${size}`, className)}
      type={type}
      {...(label != null ? { ...props, id: controlId } : props)}
    />
  );

  if (label == null) {
    return input;
  }

  return (
    <GridraField
      disabled={Boolean(props.disabled)}
      htmlFor={controlId}
      label={label}
      required={Boolean(props.required)}
    >
      {input}
    </GridraField>
  );
}
