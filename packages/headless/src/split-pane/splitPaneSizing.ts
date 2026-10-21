import { clampNumber } from "@gridra-ui/core";

export function clampSize(
  value: number,
  minSize: number,
  maxSize: number,
): number {
  // 値と制約を有限な0〜100の範囲へ揃えてからclampする。
  const { min, max } = normalizeSizeConstraints(minSize, maxSize);
  const safeValue = Number.isFinite(value) ? value : min;

  return clampNumber(safeValue, min, max);
}

function normalizeSizeConstraints(
  minSize: number,
  maxSize: number,
): { min: number; max: number } {
  // minとmaxが逆でも呼び出し側が同じ範囲として扱えるよう並べ直す。
  const rawMin = Number.isFinite(minSize) ? clampNumber(minSize, 0, 100) : 0;
  const rawMax = Number.isFinite(maxSize) ? clampNumber(maxSize, 0, 100) : 100;

  return rawMin <= rawMax
    ? { min: rawMin, max: rawMax }
    : { min: rawMax, max: rawMin };
}

export function sumBeforeIndex(
  values: number[],
  indexExclusive: number,
): number {
  return values.slice(0, indexExclusive).reduce((sum, value) => sum + value, 0);
}

export function normalizePaneSizes(
  values: number[],
  paneCount: number,
  minSize: number,
  maxSize: number,
): number[] {
  // 不足分を均等値で補い、入力値の比率を保ちながら合計100%へ変換する。
  const base = values.slice(0, paneCount);
  while (base.length < paneCount) {
    base.push(100 / paneCount);
  }
  const total =
    base.reduce(
      (sum, value) => sum + (Number.isFinite(value) ? value : 0),
      0,
    ) || 1;
  let normalized = base.map(
    (value) => ((Number.isFinite(value) ? value : 0) / total) * 100,
  );
  normalized = normalized.map((value) => clampSize(value, minSize, maxSize));
  const normalizedTotal =
    normalized.reduce((sum, value) => sum + value, 0) || 1;
  normalized = normalized.map((value) => (value / normalizedTotal) * 100);
  // 丸め誤差は最後のpaneへ戻し、CSS上の合計を常に100%にする。
  const rounded = normalized.map((value) => Number(value.toFixed(4)));
  const diff = Number(
    (100 - rounded.reduce((sum, value) => sum + value, 0)).toFixed(4),
  );
  rounded[rounded.length - 1] = Number(
    (rounded[rounded.length - 1] + diff).toFixed(4),
  );

  return rounded;
}

export function clampSizeInPair(
  value: number,
  pairTotal: number,
  minSize: number,
  maxSize: number,
): number {
  // 相手側paneもmin/maxを満たせるよう、隣接2paneの合計から許容範囲を求める。
  const { min, max } = normalizeSizeConstraints(minSize, maxSize);
  const total = Number.isFinite(pairTotal) && pairTotal > 0 ? pairTotal : 100;
  const minBound = Math.max(min, total - max);
  const maxBound = Math.min(max, total - min);
  const lower = Math.min(minBound, maxBound);
  const upper = Math.max(minBound, maxBound);
  const safeValue = Number.isFinite(value) ? value : lower;

  return clampNumber(safeValue, lower, upper);
}
