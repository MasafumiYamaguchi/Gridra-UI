# GRIDRA UI

[English](README.md) | [日本語](README.ja.md)

GRIDRA UI is a React-first component library for building dense, panel-based GRIDRA-style interfaces.

## Status

- Current version: `0.1.0`
- Package distribution through npm is planned.
- The repository is currently organized as a local npm workspaces monorepo.

## Packages

- `@gridra-ui/react`: React components and interaction wiring.
- `@gridra-ui/core`: framework-independent IDs, geometry types, and state helpers.
- `@gridra-ui/theme`: CSS variable tokens and light/dark theme presets.
- `@gridra-ui/playground`: Vite app for local visual checks and component documentation.

## Installation

npm distribution is planned. Once the packages are published, the intended installation flow is:

```bash
npm install @gridra-ui/react @gridra-ui/theme
```

Applications should import the theme CSS explicitly:

```ts
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/dark.css";
```

Use `light.css` instead of `dark.css` when the light preset is preferred.

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
  publishes base CSS variables plus light/dark theme presets
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

## Styling And Themes

The theme package exposes CSS files instead of requiring a JavaScript runtime:

- `@gridra-ui/theme/base.css`: base class styles and CSS variable contract.
- `@gridra-ui/theme/dark.css`: dark theme preset.
- `@gridra-ui/theme/light.css`: light theme preset.

Consumers can import a preset theme or override the CSS variables in their own application styles.

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
