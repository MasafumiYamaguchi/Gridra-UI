export function clampNumber(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  return Math.min(max, Math.max(min, value));
}

export function clampInt(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) {
    return min;
  }
  const intValue = Math.floor(value);
  return Math.min(max, Math.max(min, intValue));
}

export function clampIndex(index: number, itemCount: number): number {
  if (itemCount <= 0) {
    return 0;
  }
  return clampInt(index, 0, itemCount - 1);
}

export function wrapIndex(index: number, itemCount: number): number {
  if (itemCount <= 0) {
    return 0;
  }
  return ((index % itemCount) + itemCount) % itemCount;
}

export function normalizeGridLine(value: number, max?: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  const line = Math.max(1, Math.floor(value));
  return max === undefined ? line : Math.min(line, max);
}

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

export function formatCssLength(value: number | string): string {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return "0px";
    }
    return `${Math.max(0, value)}px`;
  }
  return value;
}

export function formatCssLengthWithMin(
  value: number | string,
  minValue: number,
): string {
  if (typeof value === "number") {
    return `${Math.max(minValue, value)}px`;
  }
  return value;
}

export function parseCssPx(value: string, fallback = 0): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function resolveCssLengthToPx(
  value: number | string,
  fallback: number,
): number {
  return typeof value === "number" ? value : parseCssPx(value, fallback);
}
