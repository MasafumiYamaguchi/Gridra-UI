import { useGridraRadio } from "@gridra-ui/headless";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";

export type GridraRadioSize = "sm" | "md" | "lg";

export interface GridraRadioProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> {
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
  // id/descriptionId/aria-invalidの解決はuseGridraRadioに任せ、Radio本体はlabel構造と見た目に集中する。
  const { descriptionId, inputProps } = useGridraRadio({
    inputProps: { ...props, "aria-invalid": ariaInvalid },
    hasDescription: Boolean(description),
    invalid,
  });
  const radioClassName = cx(
    "gridra-radio",
    `gridra-radio--${size}`,
    invalid && "gridra-radio--invalid",
    className,
  );

  return (
    <label className={radioClassName}>
      <input className="gridra-radio__input" {...inputProps} />
      <span className="gridra-radio__mark" aria-hidden="true" />
      {label || description ? (
        <span className="gridra-radio__content">
          {label ? <span className="gridra-radio__label">{label}</span> : null}
          {description ? (
            // 説明はaria-describedby経由で読ませ、label内での重複読み上げを避ける。
            <span
              id={descriptionId}
              className="gridra-radio__description"
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
