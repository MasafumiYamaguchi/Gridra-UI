# Theming GRIDRA UI

GRIDRA UI themes are CSS custom-property palettes selected by `GridraRoot`.
The React package does not require a public theme provider or a JavaScript token
object.

## Built-in themes

Import the base component CSS and all named palettes when the application lets
users switch themes at runtime:

```ts
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/themes.css";
```

Choose `dark`, `light`, `midnight`, `forest`, or `ember` with the root prop:

```tsx
<GridraRoot theme="forest">...</GridraRoot>
```

Applications that use only one palette may import its individual CSS file.
Omitting `theme` keeps the backward-compatible Dark fallback. Legacy
`gridra-theme-*` classes are also supported when the `theme` prop is absent.

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
`gridra-theme-` prefix, import it after `base.css`, and pass the suffix to
`GridraRoot`:

```css
.gridra-theme-studio-blue {
  color-scheme: dark;
  --gridra-color-background: #08121f;
  --gridra-color-surface: #0d1b2d;
  /* Define every required token listed below. */
}
```

```tsx
<GridraRoot theme="studio-blue">...</GridraRoot>
```

The theme class is carried into dialogs, menus, popovers, tooltips, toasts, and
other portals. Theme switching does not require remounting those components.

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
