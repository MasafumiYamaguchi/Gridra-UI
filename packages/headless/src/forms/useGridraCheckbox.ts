import {
  useNativeChoiceControl,
  type NativeChoiceControlOptions,
} from "../internal/useNativeChoiceControl";

export type UseGridraCheckboxOptions = NativeChoiceControlOptions;

/** ネイティブcheckboxと説明を結び付け、入力属性を解決する。 */
export function useGridraCheckbox(options: UseGridraCheckboxOptions = {}) {
  return useNativeChoiceControl("checkbox", options);
}
