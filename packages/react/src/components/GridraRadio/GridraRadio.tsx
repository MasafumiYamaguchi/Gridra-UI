import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";
import { resolveAriaInvalid, useControlDescriptionIds } from "../../internal/formControl";

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
  // inputと説明文をARIAで結び付けるため、衝突しないidの組を用意する。
  const { controlId, descriptionId } = useControlDescriptionIds(props.id, Boolean(description));
  const radioClassName = cx(
    "gridra-radio",
    `gridra-radio--${size}`,
    invalid && "gridra-radio--invalid",
    className,
  );

  // 明示されたaria-invalidを優先しつつ、invalid propもアクセシビリティ属性へ反映する。
  return (
    <label className={radioClassName}>
      <input
        aria-describedby={descriptionId}
        aria-invalid={resolveAriaInvalid(ariaInvalid, invalid)}
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
            // 説明はaria-describedby経由で読ませ、label内での重複読み上げを避ける。
            <span id={descriptionId} className="gridra-radio__description" aria-hidden="true">
              {description}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}
