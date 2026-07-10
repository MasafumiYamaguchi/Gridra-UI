import type { GridraThemeName } from "../theme";

export const GRIDRA_THEME_CLASS_PREFIX = "gridra-theme-";

const GRIDRA_THEME_NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function getGridraThemeClassNameFromName(
  theme: GridraThemeName | undefined,
): string | undefined {
  if (!theme || !GRIDRA_THEME_NAME_PATTERN.test(theme)) {
    return undefined;
  }

  return `${GRIDRA_THEME_CLASS_PREFIX}${theme}`;
}

export function getGridraThemeClassNameFromClassName(
  className: string | undefined,
): string | undefined {
  return className
    ?.split(/\s+/)
    .find((token) => token.startsWith(GRIDRA_THEME_CLASS_PREFIX));
}

export function removeGridraThemeClassNames(className: string): string {
  return className
    .split(/\s+/)
    .filter(
      (token) => token && !token.startsWith(GRIDRA_THEME_CLASS_PREFIX),
    )
    .join(" ");
}

export function getGridraThemeClassName(anchor?: HTMLElement | null): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  let themeHost: Element | null = anchor ?? null;
  while (themeHost) {
    const themeClassName = Array.from(themeHost.classList).find((className) =>
      className.startsWith(GRIDRA_THEME_CLASS_PREFIX),
    );
    if (themeClassName) {
      return themeClassName;
    }
    themeHost = themeHost.parentElement;
  }

  for (const element of document.querySelectorAll("[class*='gridra-theme-']")) {
    const themeClassName = Array.from(element.classList).find((className) =>
      className.startsWith(GRIDRA_THEME_CLASS_PREFIX),
    );
    if (themeClassName) {
      return themeClassName;
    }
  }

  return undefined;
}

export function getPortalTarget(): HTMLElement | null {
  return typeof document === "undefined" ? null : document.body;
}
