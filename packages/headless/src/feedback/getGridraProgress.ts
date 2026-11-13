import type { HTMLAttributes } from "react";
import { clampNumber } from "@gridra-ui/core";

export interface GridraProgressOptions {
  value?: number;
  max?: number;
  label?: string;
}

function normalizeMax(max: number): number {
  return Number.isFinite(max) && max > 0 ? max : 100;
}

function normalizeValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

/**
 * 進捗の正規化とアクセシビリティ属性を返す。
 * 描画用の値(割合など)と、ルート要素へ展開する `rootProps` を分けて返す。
 */
export function getGridraProgress({
  value,
  max = 100,
  label,
}: GridraProgressOptions = {}) {
  const normalizedMax = normalizeMax(max);
  const ariaLabel = label || undefined;

  // value未指定は、完了量を特定できないindeterminate表示として扱い、確定値を示すARIA属性を公開しない。
  if (value === undefined) {
    return {
      isIndeterminate: true,
      normalizedMax,
      clampedValue: 0,
      fraction: 0,
      percent: 0,
      rootProps: {
        role: "progressbar",
        "aria-label": ariaLabel,
      } satisfies HTMLAttributes<HTMLElement>,
    };
  }

  const clampedValue = clampNumber(normalizeValue(value), 0, normalizedMax);
  const fraction = clampedValue / normalizedMax;

  return {
    isIndeterminate: false,
    normalizedMax,
    clampedValue,
    fraction,
    percent: fraction * 100,
    rootProps: {
      role: "progressbar",
      "aria-label": ariaLabel,
      "aria-valuemax": normalizedMax,
      "aria-valuemin": 0,
      "aria-valuenow": clampedValue,
    } satisfies HTMLAttributes<HTMLElement>,
  };
}
