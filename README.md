# GRIDRA UI

[English](README.md) | [日本語](README.ja.md)

GRIDRA UI is a React-first component library for building dense, panel-based GRIDRA-style interfaces.

## Status

- Current version: `0.1.0`
- Packages are published on npm.
- The repository is currently organized as a local npm workspaces monorepo.

## Packages

- [`@gridra-ui/react`](https://www.npmjs.com/package/@gridra-ui/react): React components and interaction wiring.
- [`@gridra-ui/core`](https://www.npmjs.com/package/@gridra-ui/core): framework-independent IDs, geometry types, and state helpers.
- [`@gridra-ui/theme`](https://www.npmjs.com/package/@gridra-ui/theme): CSS variable tokens and five built-in theme presets.
- `@gridra-ui/playground`: Vite app for local visual checks and component documentation.

## Installation

Install the published runtime packages with:

```bash
npm install @gridra-ui/react @gridra-ui/theme
```

Applications should import the theme CSS explicitly:

```ts
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/themes.css";
```

Then select a built-in or custom theme at runtime:

```tsx
<GridraRoot theme="midnight">...</GridraRoot>
```

Individual preset imports such as `dark.css` and `light.css` remain available.

## Development

Install dependencies:

```bash
npm install
```

Start the playground:

```bash
npm run dev
```

Run checks:

```bash
npm run test
npm run typecheck
npm run build
```

## Architecture

GRIDRA UI is organized as an npm workspaces monorepo. Runtime packages are kept layered so React components can focus on rendering and interaction while framework-neutral primitives and styling tokens remain reusable.

```text
apps/playground
  uses @gridra-ui/react + @gridra-ui/theme for local visual checks and docs

packages/react
  exports React components and interaction wiring

packages/core
  provides framework-independent IDs, geometry types, and small state helpers

packages/theme
  publishes the color token contract plus five built-in theme presets
```

The main dependency direction is:

```text
@gridra-ui/playground
  -> @gridra-ui/react
      -> @gridra-ui/core
  -> @gridra-ui/theme
```

`@gridra-ui/theme` is consumed through explicit CSS imports rather than a JavaScript dependency. This keeps visual tokens opt-in for application consumers.

## Component Surface

GRIDRA UI includes primitives for dense application surfaces:

- Spatial editing: canvas area, nodes, minimap, selection, drag/resize handles, connection handles, snap guides.
- Panels and layout: panels, sidebars, split panes, stack/inline/cluster/grid layout utilities.
- Controls: buttons, icon buttons, inputs, selects, checkboxes, radios, switches, sliders, fields, labels.
- Overlays and interaction: tooltips, popovers, dialogs, dropdown menus, context menus, command palettes, hover cards.
- Navigation and feedback: tabs, breadcrumbs, accordions, tree views, pagination, steppers, alerts, toasts, progress, skeletons, empty states.

See [COMPONENT_ROADMAP.md](./COMPONENT_ROADMAP.md) for the current component status and planned additions.

## Component Selection

For new code, use `GridraBadge` for both status chips and metadata labels:

```tsx
<GridraBadge>Active</GridraBadge>
<GridraBadge variant="outline">Production</GridraBadge>
```

Breaking changes before 1.0: `GridraTag` and `GridraGrid`, including their
associated types, have been removed. Replace `GridraTag` with
`GridraBadge variant="outline"`, and use `GridraSelectableGrid` for item
selection or `GridraGridLayout` for layout. Outline labels retain their sizing,
casing, and overflow constraints. Replace `.gridra-tag*` CSS selectors with
Badge selectors and `--gridra-tag-*` overrides with `--gridra-badge-outline-*`.

## Styling And Themes

The theme package exposes CSS files instead of requiring a JavaScript runtime:

- `@gridra-ui/theme/base.css`: base class styles and CSS variable contract.
- `@gridra-ui/theme/themes.css`: all built-in themes for runtime switching.
- `@gridra-ui/theme/{dark,light,midnight,forest,ember}.css`: individual presets.

Consumers can select a preset with the `GridraRoot` `theme` prop or define a
`.gridra-theme-<name>` class with the same required tokens. See
[THEMING.md](./THEMING.md) for the complete contract and a custom theme example.

## Documentation

The playground contains local component documentation and visual examples. Run `npm run dev` and open the Vite URL printed in the terminal.

Documentation planning lives in [DOCUMENTATION_BACKLOG.md](./DOCUMENTATION_BACKLOG.md). Development workflow, testing expectations, and API design notes live in [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md).

## Technology Stack

- TypeScript
- React 19 in the workspace, with `@gridra-ui/react` declaring React `>=18.2.0` as a peer dependency
- TypeScript project references
- Vite for the playground
- Vitest, jsdom, and Testing Library for tests
- CSS variables for styling and theme presets
