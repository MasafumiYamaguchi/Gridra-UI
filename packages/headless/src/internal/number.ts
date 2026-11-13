/** 有限な number かどうかを判定する型ガード。NaN / Infinity / 非 number は false。 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
