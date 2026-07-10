export const GRIDRA_BUILT_IN_THEME_NAMES = [
  "dark",
  "light",
  "midnight",
  "forest",
  "ember",
] as const;

export type GridraBuiltInThemeName =
  (typeof GRIDRA_BUILT_IN_THEME_NAMES)[number];

export type GridraThemeName =
  | GridraBuiltInThemeName
  | (string & Record<never, never>);
