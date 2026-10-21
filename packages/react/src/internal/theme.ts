/** テーマクラスの生成・抽出・祖先探索と、Portal先の取得を行うヘルパー。 */
import type { GridraThemeName } from "../theme";

export const GRIDRA_THEME_CLASS_PREFIX = "gridra-theme-";

const GRIDRA_THEME_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** テーマ名の形式を検証してクラス名を作る。未指定または不正な名前ならundefinedを返す。 */
export function getGridraThemeClassNameFromName(
  theme: GridraThemeName | undefined,
): string | undefined {
  if (!theme || !GRIDRA_THEME_NAME_PATTERN.test(theme)) {
    return undefined;
  }

  return `${GRIDRA_THEME_CLASS_PREFIX}${theme}`;
}

/** 空白区切りのクラス名から、最初のGridraテーマクラスを取り出す。 */
export function getGridraThemeClassNameFromClassName(
  className: string | undefined,
): string | undefined {
  return className
    ?.split(/\s+/)
    .find((token) => token.startsWith(GRIDRA_THEME_CLASS_PREFIX));
}

/** Gridraテーマクラスをすべて除き、それ以外のクラス名を残す。 */
export function removeGridraThemeClassNames(className: string): string {
  return className
    .split(/\s+/)
    .filter(
      (token) => token && !token.startsWith(GRIDRA_THEME_CLASS_PREFIX),
    )
    .join(" ");
}

/** アンカー自身から祖先へたどり、最も近いテーマクラスを返す。DOMがない環境ではundefinedを返す。 */
export function getGridraThemeClassName(anchor?: HTMLElement | null): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  let themeHost: Element | null = anchor ?? document.body ?? document.documentElement;
  while (themeHost) {
    const themeClassName = Array.from(themeHost.classList).find((className) =>
      className.startsWith(GRIDRA_THEME_CLASS_PREFIX),
    );
    if (themeClassName) {
      return themeClassName;
    }
    themeHost = themeHost.parentElement;
  }


  return undefined;
}

/** Portalの描画先としてdocument.bodyを返す。DOMがない環境ではnullを返す。 */
export function getPortalTarget(): HTMLElement | null {
  return typeof document === "undefined" ? null : document.body;
}
