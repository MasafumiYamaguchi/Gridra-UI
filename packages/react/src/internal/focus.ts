/**
 * フォーカス移動の候補となるDOM要素を取得するヘルパー。
 * focusはキーボード操作の行き先、selectはアプリが操作対象や表示対象として選んでいる状態を指す。
 * フォーカスを移しても選択が変わるとは限らず、このヘルパーは選択状態を扱わない。
 * 下のセレクターにあるselectはHTMLの<select>要素であり、選択状態を表す名前ではない。
 */
export const FOCUSABLE_SELECTOR =
  'a[href]:not([tabindex="-1"]), button:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]):not([tabindex="-1"]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])';

/** ルート配下でFOCUSABLE_SELECTORに一致する要素をDOM順に返す。非表示かどうかは判定しない。 */
export function getFocusableElements(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}
