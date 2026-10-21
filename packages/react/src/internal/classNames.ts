/** 条件付きのクラス名をまとめ、コンポーネントのclassNameを組み立てるヘルパー。 */
type ClassValue = string | false | null | undefined;

/** 空文字やfalse・null・undefinedを除き、有効なクラス名だけに絞り込む。 */
function isClassName(value: ClassValue): value is string {
  return typeof value === "string" && value.length > 0;
}
/** 有効なクラス名を空白で連結し、classNameに渡せる文字列を返す。 */
export function cx(...values: ClassValue[]): string {
  return values.filter(isClassName).join(" ");
}
