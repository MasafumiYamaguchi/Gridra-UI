import { useCallback, useState } from "react";
import { useClientLayoutEffect } from "../../internal/useClientLayoutEffect";
import { useAncestorAttributes } from "../../internal/useAncestorAttributes";
import { getGridMetrics, type GridMetrics } from "./geometry";

/** DOMの寸法取得をここに集約し、描画と操作には値のスナップショットを渡す。 */
export function useGridGeometry(container: HTMLElement | null, columns: number, rows: number) {
  const [snapshot, setSnapshot] = useState<{ source: HTMLElement; metrics: GridMetrics } | null>(null);
  const measure = useCallback((source: HTMLElement) => {
    const next = getGridMetrics(source, columns, rows);
    setSnapshot((previous) => previous?.source === source && (Object.keys(next) as (keyof GridMetrics)[])
      .every((key) => previous.metrics[key] === next[key]) ? previous : { source, metrics: next });
  }, [columns, rows]);
  useAncestorAttributes(() => container, measure, container !== null, `${columns}:${rows}`);
  useClientLayoutEffect(() => {
    if (!container) return;
    const resize = () => measure(container);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observer?.observe(container);
    window.addEventListener("resize", resize);
    return () => { observer?.disconnect(); window.removeEventListener("resize", resize); };
  }, [container, measure]);
  return snapshot?.source === container ? snapshot.metrics : null;
}
