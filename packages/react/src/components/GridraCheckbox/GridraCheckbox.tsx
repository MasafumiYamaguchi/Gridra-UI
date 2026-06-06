import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";
import {
  resolveAriaInvalid,
  useControlDescriptionIds,
} from "../../internal/formControl";

export type GridraCheckboxSize = "sm" | "md" | "lg";

// Checkbox側で制御するためにsizeとtypeをInputHTMLAttributesから除外
export interface GridraCheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
  description?: ReactNode;
  invalid?: boolean;
  label?: string;
  size?: GridraCheckboxSize;
}

export function GridraCheckbox({
  "aria-invalid": ariaInvalid,
  className,
  description,
  invalid = false,
  label,
  size = "md",
  ...props
}: GridraCheckboxProps) {
  const { controlId, descriptionId } = useControlDescriptionIds(
    props.id,
    Boolean(description),
  );
  const checkboxClassName = cx(
    "gridra-checkbox",
    `gridra-checkbox--${size}`,
    invalid && "gridra-checkbox--invalid",
    className,
  );

  return (
    <label className={checkboxClassName}>
      <input
        aria-describedby={descriptionId}
        aria-invalid={resolveAriaInvalid(ariaInvalid, invalid)}
        className="gridra-checkbox__input"
        id={controlId}
        type="checkbox"
        {...props}
      />
      <span className="gridra-checkbox__mark" aria-hidden="true" />
      {label || description ? ( // ラベルか説明の存在をふるいにして、内容の有無を判断
        <span className="gridra-checkbox__content">
          {label ? (
            <span className="gridra-checkbox__label">{label}</span>
          ) : null}
          {description ? (
            <span
              id={descriptionId}
              className="gridra-checkbox__description"
              aria-hidden="true"
            >
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
