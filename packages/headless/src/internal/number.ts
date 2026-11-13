/** 空文字や非有限値(NaN / Infinity)を除き、有限な数値として解釈できる入力文字列かを判定する。 */
export function isValidNumber(value: string): boolean {
  return value.trim() !== "" && Number.isFinite(Number(value));
}
