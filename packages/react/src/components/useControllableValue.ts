import { useCallback, useState } from "react";

export function useControllableValue<TValue>(
  value: TValue | undefined,
  defaultValue: TValue,
  onChange: ((value: TValue, previousValue: TValue) => void) | undefined
): [TValue, (nextValue: TValue) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const setValue = useCallback(
    (nextValue: TValue) => {
      if (Object.is(currentValue, nextValue)) {
        return;
      }

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(nextValue, currentValue);
    },
    [currentValue, isControlled, onChange]
  );

  return [currentValue, setValue];
}
