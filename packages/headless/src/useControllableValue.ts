// useControllableValueフックは、制御されたコンポーネントと非制御コンポーネントの両方で使用できる値の管理を提供するカスタムフックです。
// 前の値と後の値を両方持てるので、useStateだけでは実現できない、onChangeの引数に前の値を渡すことができます。

import { useCallback, useState } from "react";

export function useControllableValue<TValue>(
  value: TValue | undefined,
  defaultValue: TValue,
  onChange: ((value: TValue, previousValue: TValue) => void) | undefined
): [TValue, (nextValue: TValue) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined; // valueがundefinedでない場合は制御されているとみなす
  const currentValue = isControlled ? value : internalValue;  // 現在の値を決定する。制御されている場合はvalueを、そうでない場合は内部状態を使用する

  const setValue = useCallback(
    (nextValue: TValue) => {
      if (Object.is(currentValue, nextValue)) {
        return; // 値が変更されていない場合は何もしない
      }

      if (!isControlled) {
        setInternalValue(nextValue);  // 制御されていない場合は内部状態を更新する
      }

      onChange?.(nextValue, currentValue);  // onChangeが提供されている場合は呼び出す。次の値と現在の値を引数として渡す
    },
    [currentValue, isControlled, onChange]
  );

  return [currentValue, setValue];  // 現在の値と、値を更新するための関数を返す
}
