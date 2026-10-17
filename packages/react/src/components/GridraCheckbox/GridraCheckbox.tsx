import {useGridraCheckbox} from "@gridra-ui/headless";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";
import {
  resolveAriaInvalid,
  useControlDescriptionIds,
} from "@gridra-ui/headless";

export type GridraCheckboxSize = "sm" | "md" | "lg";

// native inputのsize/typeと衝突するpropsは、GridraCheckbox側の見た目・意味として管理する。
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
  // id/descriptionIdの接続はformControl helperに寄せ、Checkbox本体はlabel構造と見た目に集中する。
  const {descriptionId,inputProps}= useGridraCheckbox({inputProps:{...props,"aria-invalid":ariaInvalid},hasDescription:Boolean(description),invalid});
  const checkboxClassName = cx(
    "gridra-checkbox",
    `gridra-checkbox--${size}`,
    invalid && "gridra-checkbox--invalid",
    className,
  );

  return (
    <label className={checkboxClassName}>
      <input
        className="gridra-checkbox__input"
        {...inputProps}
      />
      <span className="gridra-checkbox__mark" aria-hidden="true" />
      {label || description ? (
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
