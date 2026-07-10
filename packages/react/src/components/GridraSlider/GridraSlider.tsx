import type { InputHTMLAttributes, ReactNode } from "react";
import { useState } from "react";

export type GridraSliderSize = "sm" | "md" | "lg";

export interface GridraSliderProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type"> {
  showValue?: boolean;
  size?: GridraSliderSize;
  valueFormatter?: (value: number) => ReactNode;
}

export function GridraSlider({
  className,
  defaultValue,
  min,
  onChange,
  showValue = false,
  size = "md",
  value,
  valueFormatter,
  ...props
}: GridraSliderProps) {
  const sliderClassName = ["gridra-slider", `gridra-slider--${size}`, className]
    .filter(Boolean)
    .join(" ");
  // value未指定時に表示ラベルを更新するため、内部の数値表現を保持する。
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    getDisplayValue(defaultValue ?? min ?? 0)
  );
  // input本体と同様に、valueがあればcontrolledな値を表示へ優先する。
  const displayNumericValue =
    value === undefined ? uncontrolledValue : getDisplayValue(value);
  const input = (
    <input
      className={sliderClassName}
      defaultValue={defaultValue}
      min={min}
      onChange={(event) => {
        // 表示値用stateを更新した後、ネイティブのonChangeもそのまま通知する。
        setUncontrolledValue(getDisplayValue(event.currentTarget.value));
        onChange?.(event);
      }}
      type="range"
      value={value}
      {...props}
    />
  );

  if (!showValue) {
    return input;
  }

  const displayValue = valueFormatter
    ? valueFormatter(displayNumericValue)
    : displayNumericValue;

  return (
    <span className="gridra-slider-field">
      {input}
      <span className="gridra-slider-field__value">{displayValue}</span>
    </span>
  );
}

function getDisplayValue(value: string | number | readonly string[]): number {
  // input属性が許容する複数の値型を、表示用の有限な数値へ統一する。
  if (Array.isArray(value)) {
    const n = Number(value[0] ?? 0);
    return Number.isFinite(n) ? n : 0;
  }

  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}
