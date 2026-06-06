type ClassValue = string | false | null | undefined;

// 型付けされたクラス名の結合関数(型付け意識のためにfilter(Boolean)をやめて、isClassName関数を作成)
function isClassName(value: ClassValue): value is string {
  return typeof value === "string" && value.length > 0;
}
export function cx(...values: ClassValue[]): string {
  return values.filter(isClassName).join(" ");
}
