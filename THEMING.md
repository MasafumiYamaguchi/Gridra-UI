# Theming GRIDRA UI

GRIDRA UI themes are CSS custom-property palettes selected by classes on ordinary DOM elements.
The React package does not require a public theme provider or a JavaScript token
object.

## Built-in themes

Import the base component CSS and all named palettes when the application lets
users switch themes at runtime:

```ts
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/themes.css";
```

Apply a `gridra-theme-dark`, `gridra-theme-light`, `gridra-theme-midnight`,
`gridra-theme-forest`, or `gridra-theme-ember` class to a DOM element:

```tsx
<section className="gridra-theme-forest">...</section>
```

Applications that use only one palette may import its individual CSS file.
Without a theme class, components use the Dark token defaults from `base.css`.
Defaults live on a low-specificity `:root`; no full-page layout or document typography is imposed.
Nested theme classes override inherited tokens in their own subtree.

The built-in palettes use editor themes as visual references:

- Dark preserves Gridra's original monochrome palette.
- Light follows VS Code's built-in Light Modern UI colors.
- Midnight follows the Tokyo Night extension palette.
- Forest follows Everforest's medium dark palette.
- Ember follows the warm Gruvbox Material palette.

The Gridra names describe Gridra presets; they are not redistributed copies of
the referenced editor themes.

## Custom themes

Custom theme names must use lowercase kebab-case. Define a class using the
`gridra-theme-` prefix, import it after `base.css`, and apply the class to any DOM element:

```css
.gridra-theme-studio-blue {
  color-scheme: dark;
  --gridra-color-background: #08121f;
  --gridra-color-surface: #0d1b2d;
  /* Define every required token listed below. */
}
```

```tsx
<section className="gridra-theme-studio-blue">...</section>
```

Anchored portals copy inherited Gridra tokens and the nearest theme class from their anchor.
Changes to ancestor classes or inline styles update already-open portals.
Themes in unrelated subtrees do not affect the portal.
Anchorless `GridraToastProvider` and `GridraCommandPalette` accept an optional `theme` name;
when omitted, they use the document (body/html) theme.
Explicit names choose the palette; inherited non-color tokens still apply.


## Required token contract

Every color theme must define the following 35 tokens:

- Foundation: `--gridra-color-background`, `--gridra-color-surface`,
  `--gridra-color-surface-raised`, `--gridra-color-surface-input`,
  `--gridra-color-node-pattern`, `--gridra-color-text`,
  `--gridra-color-muted-text`, `--gridra-color-border`,
  `--gridra-color-border-strong`, `--gridra-color-accent`,
  `--gridra-color-selected`, `--gridra-color-focus`,
  `--gridra-shadow-selected`.
- Info: `--gridra-color-info`, `--gridra-color-info-surface`,
  `--gridra-color-info-text`, `--gridra-color-info-solid`.
- Success: `--gridra-color-success`, `--gridra-color-success-surface`,
  `--gridra-color-success-text`, `--gridra-color-success-solid`.
- Warning: `--gridra-color-warning`, `--gridra-color-warning-surface`,
  `--gridra-color-warning-text`, `--gridra-color-warning-solid`.
- Danger: `--gridra-color-danger`, `--gridra-color-danger-surface`,
  `--gridra-color-danger-text`, `--gridra-color-danger-solid`.
- Canvas and overlays: `--gridra-color-backdrop`, `--gridra-color-handle`,
  `--gridra-color-handle-strong`, `--gridra-color-node-label`,
  `--gridra-color-canvas-subtle`, `--gridra-color-snap-line`.

The non-color sizing, spacing, typography, and radius tokens remain in
`base.css`. A color theme should not change component geometry or interaction.
