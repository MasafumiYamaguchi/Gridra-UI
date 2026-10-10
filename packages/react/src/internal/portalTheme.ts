import { useEffect, useLayoutEffect, useState, type CSSProperties, type RefObject } from "react";
import { getGridraThemeClassName, getGridraThemeClassNameFromName } from "./theme";
import type { GridraThemeName } from "../theme";

const useClientLayoutEffect = typeof document === "undefined" ? useEffect : useLayoutEffect;
const themeTokenNames = [
  "background", "surface", "surface-raised", "surface-input", "node-pattern", "text",
  "muted-text", "border", "border-strong", "accent", "selected", "focus",
  "info", "info-surface", "info-text", "info-solid", "success", "success-surface", "success-text", "success-solid",
  "warning", "warning-surface", "warning-text", "warning-solid", "danger", "danger-surface", "danger-text", "danger-solid",
  "backdrop", "handle", "handle-strong", "node-label", "canvas-subtle", "snap-line",
].map((name) => `--gridra-color-${name}`).concat([
  "--gridra-shadow-selected", "--gridra-font-mono", "--gridra-font-brand", "--gridra-radius-sm", "--gridra-radius-md",
  "--gridra-space-xs", "--gridra-space-sm", "--gridra-space-md", "--gridra-space-lg", "--gridra-panel-width", "--gridra-node-pattern-size",
]);

/** bodyへPortalした後も、アンカーに継承されたトークンを維持する。 */
export function useGridraPortalTheme(
  anchorRef?: RefObject<HTMLElement | null>, theme?: GridraThemeName,
) {
  const [result, setResult] = useState<{ className?: string; style: CSSProperties }>({ style: {} });
  // 継承元の祖先だけを監視し、無関係な領域のテーマを採用しない。
  useClientLayoutEffect(() => {
    const source = anchorRef?.current ?? document.body ?? document.documentElement;
    const explicitClass = getGridraThemeClassNameFromName(theme);
    const update = () => {
      const computed = getComputedStyle(source);
      const style: Record<string, string> = {};
      const names = new Set(themeTokenNames);
      for (let i = 0; i < computed.length; i++) {
        const name = computed.item(i);
        if (name.startsWith("--gridra-")) names.add(name);
      }
      for (const name of names) {
        if (explicitClass && (name.startsWith("--gridra-color-") || name === "--gridra-shadow-selected")) continue;
        const value = computed.getPropertyValue(name).trim();
        if (value) style[name] = value;
      }
      if (!explicitClass && computed.colorScheme) style.colorScheme = computed.colorScheme;
      const next = { className: explicitClass ?? getGridraThemeClassName(source), style: style as CSSProperties };
      setResult((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
    };
    update();
    const observer = new MutationObserver(update);
    for (let ancestor: HTMLElement | null = source; ancestor; ancestor = ancestor.parentElement) {
      observer.observe(ancestor, { attributes: true, attributeFilter: ["class", "style"] });
    }
    return () => observer.disconnect();
  });
  return result;
}
