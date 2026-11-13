import {
  useNativeChoiceControl,
  type NativeChoiceControlOptions,
} from "../internal/useNativeChoiceControl";

export type UseGridraRadioOptions = NativeChoiceControlOptions;

/** ネイティブradioと説明を結び付け、入力属性を解決する。 */
export function useGridraRadio(options: UseGridraRadioOptions = {}) {
  return useNativeChoiceControl("radio", options);
}
