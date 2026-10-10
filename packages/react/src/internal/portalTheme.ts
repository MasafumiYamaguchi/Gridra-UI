import { useCallback, useState, type CSSProperties, type RefObject } from "react";
import { getGridraThemeClassName, getGridraThemeClassNameFromName } from "./theme";
import { useAncestorAttributes } from "./useAncestorAttributes";
import type { GridraThemeName } from "../theme";

/** bodyへPortalした後も、表示中のアンカーに継承されたトークンを維持する。 */
export function useGridraPortalTheme(anchorRef?: RefObject<HTMLElement | null>, theme?: GridraThemeName, enabled = true) {
  const [result, setResult] = useState<{ className?: string; style: CSSProperties }>({ style: {} });
  const update = useCallback((source: HTMLElement) => {
    const computed = getComputedStyle(source);
    const explicitClass = getGridraThemeClassNameFromName(theme);
    const style: Record<string, string> = {};
    // CSSにあるGridraトークンを収集し、別のトークン一覧を管理しない。
    for (let i = 0; i < computed.length; i++) {
      const name = computed.item(i);
      if (!name.startsWith("--gridra-")) continue;
      if (explicitClass && (name.startsWith("--gridra-color-") || name === "--gridra-shadow-selected")) continue;
      const value = computed.getPropertyValue(name).trim();
      if (value) style[name] = value;
    }
    if (!explicitClass && computed.colorScheme) style.colorScheme = computed.colorScheme;
    const next = { className: explicitClass ?? getGridraThemeClassName(source), style: style as CSSProperties };
    setResult((previous) => JSON.stringify(previous) === JSON.stringify(next) ? previous : next);
  }, [theme]);
  useAncestorAttributes(() => anchorRef?.current ?? document.body, update, enabled);
  return result;
}
