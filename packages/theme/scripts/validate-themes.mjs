import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const colorsRoot = resolve(packageRoot, "src/colors");
const themeNames = ["default", "dark", "light", "midnight", "forest", "ember"];
const requiredTokens = [
  "--gridra-color-background",
  "--gridra-color-surface",
  "--gridra-color-surface-raised",
  "--gridra-color-surface-input",
  "--gridra-color-node-pattern",
  "--gridra-color-text",
  "--gridra-color-muted-text",
  "--gridra-color-border",
  "--gridra-color-border-strong",
  "--gridra-color-accent",
  "--gridra-color-selected",
  "--gridra-color-focus",
  "--gridra-shadow-selected",
  "--gridra-color-info",
  "--gridra-color-info-surface",
  "--gridra-color-info-text",
  "--gridra-color-info-solid",
  "--gridra-color-success",
  "--gridra-color-success-surface",
  "--gridra-color-success-text",
  "--gridra-color-success-solid",
  "--gridra-color-warning",
  "--gridra-color-warning-surface",
  "--gridra-color-warning-text",
  "--gridra-color-warning-solid",
  "--gridra-color-danger",
  "--gridra-color-danger-surface",
  "--gridra-color-danger-text",
  "--gridra-color-danger-solid",
  "--gridra-color-backdrop",
  "--gridra-color-handle",
  "--gridra-color-handle-strong",
  "--gridra-color-node-label",
  "--gridra-color-canvas-subtle",
  "--gridra-color-snap-line",
];

function fail(message) {
  throw new Error(message);
}

for (const themeName of themeNames) {
  const filePath = resolve(colorsRoot, `${themeName}.css`);
  if (!existsSync(filePath)) {
    fail(`Missing theme file: ${filePath}`);
  }

  const css = readFileSync(filePath, "utf8");
  const declaredTokens = new Set(
    Array.from(
      css.matchAll(/(--gridra-(?:color-[a-z0-9-]+|shadow-selected))\s*:/g),
      (match) => match[1],
    ),
  );
  const missingTokens = requiredTokens.filter((token) => !declaredTokens.has(token));
  const unexpectedTokens = Array.from(declaredTokens).filter(
    (token) => !requiredTokens.includes(token),
  );

  if (missingTokens.length > 0 || unexpectedTokens.length > 0) {
    fail(
      `${themeName}.css token mismatch\nMissing: ${missingTokens.join(", ") || "none"}\nUnexpected: ${unexpectedTokens.join(", ") || "none"}`,
    );
  }
}

const baseCss = readFileSync(resolve(packageRoot, "src/base.css"), "utf8");
const colorLiteral = baseCss.match(/#[0-9a-f]{3,8}\b|(?:rgb|hsl)a?\(/i);
if (colorLiteral) {
  fail(`base.css contains a color literal: ${colorLiteral[0]}`);
}

const packageJson = JSON.parse(
  readFileSync(resolve(packageRoot, "package.json"), "utf8"),
);
const requiredExports = [
  "./base.css",
  "./dark.css",
  "./light.css",
  "./midnight.css",
  "./forest.css",
  "./ember.css",
  "./themes.css",
];

for (const exportName of requiredExports) {
  const target = packageJson.exports?.[exportName];
  if (typeof target !== "string" || !existsSync(resolve(packageRoot, target))) {
    fail(`Missing or invalid package export: ${exportName}`);
  }
}

console.log(
  `Validated ${themeNames.length} theme files with ${requiredTokens.length} tokens each.`,
);
