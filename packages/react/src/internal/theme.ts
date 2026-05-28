export function getGridraThemeClassName(anchor?: HTMLElement | null): string | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  const themeHost =
    anchor?.closest(".gridra-theme-dark, .gridra-theme-light") ??
    document.querySelector(".gridra-theme-dark, .gridra-theme-light");

  return Array.from(themeHost?.classList ?? []).find(
    (className) =>
      className === "gridra-theme-dark" || className === "gridra-theme-light",
  );
}

export function getPortalTarget(): HTMLElement | null {
  return typeof document === "undefined" ? null : document.body;
}
