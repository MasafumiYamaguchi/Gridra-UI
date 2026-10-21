import { useState, type InputHTMLAttributes, type ChangeEvent } from "react";

export interface UseGridraSliderOptions extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {}

/** native rangeと表示値のcontrolled/uncontrolled状態を共有する。 */
export function useGridraSlider({
  value,
  defaultValue,
  min,
  onChange,
  ...props
}: UseGridraSliderOptions = {}) {
  const [uncontrolledValue, setUncontrolledValue] = useState(() =>
    getDisplayValue(defaultValue ?? min ?? 0),
  );
  const displayNumericValue =
    value === undefined ? uncontrolledValue : getDisplayValue(value);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUncontrolledValue(getDisplayValue(event.currentTarget.value));
    onChange?.(event);
  };

  return {
    displayNumericValue,
    inputProps: {
      defaultValue,
      min,
      onChange: handleChange,
      type: "range",
      value,
      ...props,
    } satisfies InputHTMLAttributes<HTMLInputElement>,
  };
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
