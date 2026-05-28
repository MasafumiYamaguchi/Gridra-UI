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

export function normalizeGridLine(value: number): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.max(1, Math.floor(value));
}

export function normalizeGridSpan(value = 1): number {
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.max(1, Math.floor(value));
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
