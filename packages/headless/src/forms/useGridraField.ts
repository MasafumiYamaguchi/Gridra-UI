import { useId, type AriaAttributes } from "react";

export interface GridraFieldControlProps extends AriaAttributes {
  id?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
}

export interface UseGridraFieldOptions {
  /** コントロール自身に明示された props。ここにある値は Field 側の値より優先する。 */
  controlProps?: GridraFieldControlProps;
  /** 関連付け対象のコントロールがあるか。false のときは id を生成せず htmlFor だけを使う。 */
  hasControl?: boolean;
  /** コントロールの id を外から指定する。controlProps.id があればそちらを優先する。 */
  htmlFor?: string;
  /** hint 要素の id。未指定なら `${controlId}-hint` を使う。 */
  hintId?: string;
  /** error 要素の id。未指定なら `${controlId}-error` を使う。 */
  errorId?: string;
  /** hint を表示するか。error と同時に指定した場合は error だけを関連付ける。 */
  hasHint?: boolean;
  /** error を表示するか。true なら invalid 扱いにし、hint より優先して関連付ける。 */
  hasError?: boolean;
  /** コントロールへ渡す disabled の既定値。 */
  disabled?: boolean;
  /** コントロールへ渡す required の既定値。 */
  required?: boolean;
  /**
   * required 属性を持たないコントロール (switch の button 等) 向けに、
   * required の代わりに aria-required で必須を伝える。
   */
  usesAriaRequired?: boolean;
  /** コントロールが独自の `invalid` prop を受け取れるか。true なら解決済みの値を渡す。 */
  supportsInvalid?: boolean;
  /**
   * コントロール自身が `${controlId}-description` の説明要素を描画するか
   * (説明付きの checkbox / radio 等)。true なら aria-describedby に含める。
   */
  hasControlDescription?: boolean;
}

/**
 * ラベル・説明・エラーとコントロールの関連付けを解決する。
 *
 * - コントロールに明示された id / disabled / required / aria-required / invalid /
 *   aria-invalid は、Field 側の指定より優先する。
 * - hint と error は同時に 1 つだけ関連付け、error があれば hint より優先する。
 * - aria-describedby は「コントロールに明示された値 → コントロール自身の説明 →
 *   error または hint」の順に連結し、重複する id は最初の 1 つだけ残す。
 */
export function useGridraField({
  controlProps,
  hasControl = true,
  htmlFor,
  hintId,
  errorId,
  hasHint = false,
  hasError = false,
  disabled = false,
  required = false,
  usesAriaRequired = false,
  supportsInvalid = false,
  hasControlDescription = false,
}: UseGridraFieldOptions = {}) {
  const generatedId = useId();
  const controlId = hasControl
    ? (controlProps?.id ?? htmlFor ?? generatedId)
    : htmlFor;
  const resolvedHintId =
    hintId ?? (hasControl ? controlId + "-hint" : undefined);
  const resolvedErrorId =
    errorId ?? (hasControl ? controlId + "-error" : undefined);
  const resolvedDisabled = controlProps?.disabled ?? disabled;
  const ariaRequired = controlProps?.["aria-required"];
  const resolvedRequired =
    controlProps?.required ??
    (ariaRequired === undefined
      ? required
      : ariaRequired === true || ariaRequired === "true");
  const resolvedInvalid = controlProps?.invalid ?? hasError;
  // 明示値・コントロールの説明・error/hint の順に並べ、空白区切りの複数 id も個別に分解する。
  const descriptionIds = [
    controlProps?.["aria-describedby"],
    hasControlDescription ? controlId + "-description" : undefined,
    hasError ? resolvedErrorId : hasHint ? resolvedHintId : undefined,
  ]
    .filter(Boolean)
    .join(" ")
    .split(/\s+/)
    .filter(Boolean);
  const controlBindings = {
    id: controlId,
    disabled: resolvedDisabled,
    ...(usesAriaRequired
      ? { "aria-required": resolvedRequired }
      : { required: resolvedRequired }),
    ...(supportsInvalid ? { invalid: resolvedInvalid } : {}),
    "aria-invalid":
      controlProps?.["aria-invalid"] ?? (resolvedInvalid ? true : undefined),
    "aria-describedby": descriptionIds.length
      ? [...new Set(descriptionIds)].join(" ")
      : undefined,
  };

  return {
    controlId,
    resolvedHintId,
    resolvedErrorId,
    resolvedDisabled,
    resolvedRequired,
    resolvedInvalid,
    controlBindings,
    labelProps: { htmlFor: controlId },
    hintProps: { id: resolvedHintId },
    errorProps: { id: resolvedErrorId },
  };
}
