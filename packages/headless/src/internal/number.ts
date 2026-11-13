/** 空文字や非有限値(NaN / Infinity)を除き、有限な数値として解釈できる入力文字列かを判定する。 */
export function isNumericString(value: string): boolean {
  return value.trim() !== "" && Number.isFinite(Number(value));
}

/** 有限な number かどうかを判定する型ガード。NaN / Infinity / 非 number は false。 */
export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
