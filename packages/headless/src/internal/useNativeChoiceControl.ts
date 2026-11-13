import type { InputHTMLAttributes } from "react";
import { resolveAriaInvalid, useControlDescriptionIds } from "./formControl";

export interface NativeChoiceControlOptions {
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "type">;
  hasDescription?: boolean;
  invalid?: boolean;
}

/**
 * ネイティブの checkbox / radio と説明を結び付け、入力属性を解決する。
 *
 * - id は inputProps.id を優先し、未指定なら生成した id を使う。
 * - 明示された aria-invalid を優先しつつ、invalid もアクセシビリティ属性へ反映する。
 * - inputProps の値は解決済みの aria-describedby / id より優先する。
 *
 * useGridraCheckbox / useGridraRadio の共通実装。aria の扱いを変えるときはここだけを直す。
 */
export function useNativeChoiceControl<TType extends "checkbox" | "radio">(
  type: TType,
  {
    inputProps = {},
    hasDescription = false,
    invalid = false,
  }: NativeChoiceControlOptions = {},
) {
  const { controlId, descriptionId } = useControlDescriptionIds(
    inputProps.id,
    hasDescription,
  );
  const { "aria-invalid": ariaInvalid, ...nativeProps } = inputProps;

  return {
    controlId,
    descriptionId,
    inputProps: {
      "aria-describedby": descriptionId,
      "aria-invalid": resolveAriaInvalid(ariaInvalid, invalid),
      id: controlId,
      type: type as TType,
      ...nativeProps,
    } satisfies InputHTMLAttributes<HTMLInputElement>,
    descriptionProps: { id: descriptionId },
  };
}
