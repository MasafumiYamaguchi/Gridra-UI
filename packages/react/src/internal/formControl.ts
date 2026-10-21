/** フォーム部品のエラー状態と説明文をアクセシビリティ属性へ対応付けるヘルパー。 */
import { useId, type AriaAttributes } from "react";

type AriaInvalid = AriaAttributes["aria-invalid"];

/** 明示されたaria-invalidを優先し、未指定の場合はinvalidから属性値を補う。 */
export function resolveAriaInvalid(
  ariaInvalid: AriaInvalid | undefined,
  invalid: boolean,
): AriaInvalid | undefined {
  return ariaInvalid ?? (invalid ? true : undefined);
}

/** 指定IDまたはReactの生成IDを使い、部品と説明文を関連付けるIDを返す。 */
export function useControlDescriptionIds(
  id: string | undefined,
  hasDescription: boolean,
) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = hasDescription ? `${controlId}-description` : undefined;

  return { controlId, descriptionId };
}
