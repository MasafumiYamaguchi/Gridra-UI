/** 数値・グリッド位置・CSS長さの共通処理をまとめるヘルパー。 */
/** 数値を指定範囲に収める。NaNや無限大は下限値に置き換える。 */
export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

/** 小数を切り捨てて指定範囲に収める。NaNや無限大は下限値に置き換える。 */
export function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  const intValue = Math.floor(value);
  return Math.min(max, Math.max(min, intValue));
}

/** 要素数に応じてインデックスを有効範囲に収める。要素がない場合は0を返す。 */
export function clampIndex(index: number, itemCount: number): number {
  if (itemCount <= 0) {
    return 0;
  }
  return clampInt(index, 0, itemCount - 1);
}

/** 先頭と末尾を循環するインデックスを求める。要素がない場合は0を返す。 */
export function wrapIndex(index: number, itemCount: number): number {
  if (itemCount <= 0) {
    return 0;
  }
  return ((index % itemCount) + itemCount) % itemCount;
}

/** グリッド線の位置を1以上の整数に整え、指定されていれば上限も適用する。 */
export function normalizeGridLine(value: number, max?: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  const line = Math.max(1, Math.floor(value));
  return max === undefined ? line : Math.min(line, max);
}

/** グリッドの占有数を1以上の整数に整え、開始位置から上限までの残り幅に収める。 */
export function normalizeGridSpan(value = 1, max?: number, start = 1): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  const span = Math.max(1, Math.floor(value));

  if (max === undefined) {
    return span;
  }

  return Math.min(span, Math.max(1, max - start + 1));
}

/** 数値を0以上のpx表記に変換する。非有限数は0px、文字列はそのまま返す。 */
export function formatCssLength(value: number | string): string {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return "0px";
    }
    return `${Math.max(0, value)}px`;
  }
  return value;
}

/** 数値に下限を適用してpx表記に変換する。文字列はそのまま返す。 */
export function formatCssLengthWithMin(
  value: number | string,
  minValue: number,
): string {
  if (typeof value === "number") {
    return `${Math.max(minValue, value)}px`;
  }
  return value;
}

/** 文字列の先頭から数値を読み取り、読み取れなければ代替値を返す。CSS単位の換算は行わない。 */
export function parseCssPx(value: string, fallback = 0): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/** 数値はそのまま使い、文字列は数値部分を読み取る。remや%などの単位換算は行わない。 */
export function resolveCssLengthToPx(
  value: number | string,
  fallback: number,
): number {
  return typeof value === "number" ? value : parseCssPx(value, fallback);
}
