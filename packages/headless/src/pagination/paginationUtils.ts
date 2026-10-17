const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_PAGE_SIZE_OPTIONS = Object.freeze([10, 25, 50, 100] as const);

function asFiniteInteger(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null;
  }
  return Math.floor(value);
}

export function normalizeTotalItems(value: unknown): number {
  const num = asFiniteInteger(value);
  if (num == null || num < 0) return 0;
  return num;
}

export function normalizePageSize(value: unknown): number {
  const num = asFiniteInteger(value);
  if (num == null || num <= 0) return DEFAULT_PAGE_SIZE;
  return num;
}

export function normalizePage(value: unknown, pageCount: number): number {
  const num = asFiniteInteger(value);
  if (num == null || num <= 0) return DEFAULT_PAGE;
  if (num > pageCount) return pageCount;
  return num;
}

export function normalizePageSizeOptions(value: unknown): number[] {
  if (!Array.isArray(value)) return [...DEFAULT_PAGE_SIZE_OPTIONS];

  const seen = new Set<number>();
  const result: number[] = [];

  for (const item of value) {
    const num = asFiniteInteger(item);
    if (num == null || num <= 0) continue;
    if (seen.has(num)) continue;
    seen.add(num);
    result.push(num);
  }

  if (result.length === 0) return [...DEFAULT_PAGE_SIZE_OPTIONS];

  result.sort((a, b) => a - b);
  return result;
}

export function normalizeSiblingOrBoundaryCount(
  value: unknown,
  defaultValue: number,
): number {
  const num = asFiniteInteger(value);
  if (num == null || num < 0) return defaultValue;
  return num;
}

export type PageItem = number | "ellipsis";

export function generatePages(
  currentPage: number,
  pageCount: number,
  siblingCount: number,
  boundaryCount: number,
): PageItem[] {
  if (pageCount <= 0) return [1];

  const totalSlots = boundaryCount * 2 + siblingCount * 2 + 3;

  if (pageCount <= totalSlots) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const pages = new Set<number>();

  for (let i = 1; i <= Math.min(boundaryCount, pageCount); i++) {
    pages.add(i);
  }

  for (let i = Math.max(pageCount - boundaryCount + 1, 1); i <= pageCount; i++) {
    pages.add(i);
  }

  const siblingStart = Math.max(1, currentPage - siblingCount);
  const siblingEnd = Math.min(pageCount, currentPage + siblingCount);
  for (let i = siblingStart; i <= siblingEnd; i++) {
    pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: PageItem[] = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] > (sorted[i - 1] ?? 0) + 1) {
      result.push("ellipsis");
    }
    result.push(sorted[i]);
  }

  return result;
}
