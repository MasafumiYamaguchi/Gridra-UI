# Component Roadmap

This file tracks the component surface for Gridra UI before adding more features.
Use it as the shared memory for what exists, what comes next, and what should wait.

Before changing implementation or tests, read [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md).

## Status Legend

- `[x]` Implemented enough to export from `@gridra-ui/react`
- `[~]` Partially implemented or needs design/API hardening
- `[ ]` Not started

## Current Implemented Surface

- [x] `GridraRoot`
- [x] `GridraCanvasArea`
- [x] `GridraSelectableGrid` (`GridraGrid` is a compatibility alias)
- [x] `GridraPanel`
- [x] `GridraNode`
- [x] `GridraMinimap`
- [x] `GridraInspectorPanel`
- [x] `GridraPropertiesPanel`
- [x] `GridraSelectionBox`
- [x] `GridraDragHandle`
- [x] `GridraResizeHandle`
- [x] `GridraConnectionHandle`
- [x] `GridraSnapGuide`
- [x] `GridraToolbar`
- [x] `GridraTooltip`
- [x] `GridraPopover`
- [x] `GridraDialog`
- [x] `GridraDropdownMenu`
- [x] `GridraContextMenu`
- [x] `GridraCommandPalette`
- [x] `GridraHoverCard`
- [x] `GridraAvatar`
- [x] `GridraBadge`
- [x] `GridraButton`
- [x] `GridraCheckbox`
- [x] `GridraDivider`
- [x] `GridraField`
- [x] `GridraIconButton`
- [x] `GridraInput`
- [x] `GridraLabel`
- [x] `GridraMenu`
- [x] `GridraRadio`
- [x] `GridraSelect`
- [x] `GridraSlider`
- [x] `GridraSidebar`
- [x] `GridraSpinner`
- [x] `GridraSwitch`
- [x] `GridraTextarea`
- [x] `GridraBox`
- [x] `GridraCluster`
- [x] `GridraGridLayout`
- [x] `GridraInline`
- [x] `GridraStack`
- [x] `GridraSplitPane`
- [x] `GridraAccordion`
- [x] `GridraBreadcrumb`
- [x] `GridraTabs`
- [x] `GridraTreeView`

## Priority 1: Gridra Core

These components define the library's identity as a dense, panel-based spatial UI toolkit.

- [x] Root / Provider
- [x] Canvas Area / Viewport Base
- [x] Grid
- [x] Panel
- [x] Node
- [x] Selection Box
- [x] Drag Handle
- [x] Resize Handle
- [x] Connection Handle
- [x] Snap Guide
- [x] Minimap
- [x] Inspector Panel
- [x] Properties Panel

## Priority 2: Basic Controls

These should stay small, predictable, and useful both inside Gridra components and in consumer apps.

- [x] Button
- [x] Icon Button
- [x] Input
- [x] Select
- [x] Textarea
- [x] Checkbox
- [x] Radio
- [x] Switch
- [x] Slider
- [x] Field
- [x] Label
- [x] Badge
- [x] Avatar
- [x] Spinner / Loader
- [x] Divider

## Priority 3: Layout

Layout components should support dense application surfaces rather than marketing-style pages.

- [x] Box
- [x] Stack
- [x] Inline
- [x] Cluster
- [x] Grid Layout
- [x] Container (Integrated into `GridraBox`)
- [x] Split Pane
- [x] Resizable Panel Group (Integrated into `GridraSplitPane` three-pane mode)
- [x] Sidebar
- [x] Header (Out of scope as library component; compose with `GridraBox` / `GridraInline` / `GridraStack`)
- [x] Footer (Out of scope as library component; compose with `GridraBox` / `GridraInline` / `GridraStack`)

## Priority 4: Overlays And Interaction

These need careful keyboard, focus, and layering behavior before they are considered stable.

- [x] Tooltip
- [x] Popover
- [x] Dialog / Modal
- [ ] Drawer (Deferred until a concrete overlay/mobile use case appears)
- [x] Dropdown Menu
- [x] Context Menu
- [x] Command Palette
- [x] Hover Card

## Priority 5: Navigation

Useful once the playground and documentation need more structure.

- [x] Tabs
- [x] Breadcrumb
- [x] Accordion
- [x] Tree View
- [x] GridraMenu
- [x] Pagination
- [x] Stepper

## Priority 6: Feedback

These communicate async state, validation, and empty/error states.

- [x] Alert
- [x] Toast
- [x] Progress
- [x] Skeleton
- [x] Empty State
- [x] Error Message
- [x] Status Indicator

## Priority 7: Data Display

Keep these display-first at the beginning. Add stateful variants only when a real use case appears.
Remaining unchecked items are deferred for now while Priority 8 and Priority 9 settle animation and theme foundations first.

- [x] Card
- [x] List
- [ ] Table
- [ ] Data Table
- [x] Description List
- [x] Stat
- [x] Tag
- [ ] Code Block
- [x] Kbd
- [ ] Timeline

## Priority 8: Animation Integrations

These should keep animation libraries optional. Gridra UI should expose stable DOM, refs, and state hooks first, then provide thin integration examples or adapters where they reduce boilerplate.

- [ ] GSAP integration
- [ ] Framer Motion integration

## Priority 9: Theme And Color System

Theme work should make colors easier to author, swap, and document without forcing consumers to edit component CSS.

- [ ] Dedicated color token files
- [ ] Named color theme exports
- [ ] Runtime theme selection API/pattern
- [ ] Playground theme selector

## Priority 10: Advanced Controls

These are useful but should wait until the lower-level primitives, animation boundaries, and theme/color system are stable.

- [ ] Combobox
- [ ] Autocomplete
- [ ] Date Picker
- [ ] Time Picker
- [ ] Color Picker
- [ ] File Upload
- [ ] Virtual List
- [ ] Rich Text Editor
- [ ] Code Editor
- [ ] Calendar

## Refactor Pass Before Priority 7

These tasks should reduce repeated implementation patterns before the component surface grows into data display and advanced controls.

1. [x] Overlay shared behavior: inventory repeated overlay behavior and extract the smallest useful shared pieces now: floating position and document event subscription. Leave portal theme inheritance and menu focus extraction for a later pass when another overlay needs them.
2. [x] Class name composition: add a small internal helper and migrate repeated conditional class joins where it lowers noise.
3. [x] Controlled state contracts: review value/defaultValue/onChange behavior and align controllable components around a documented pattern.
4. [x] CanvasArea boundaries: separate the next refactor candidates for pointer normalization, selection, node drag/resize, connection handling, and visual derivation.
5. [x] Test checklist: define the common behavior checks expected for new components and meaningful refactors.
6. [x] Docs data migration: plan the remaining migration to usage, avoid, compositions, accessibility, notes, and states fields.

## Future API Simplification

Track option complexity as a design risk before adding more option-heavy components.

1. [ ] Option surface audit: identify components where variants, booleans, item metadata, callback props, and nested option objects are starting to compete or duplicate intent.
2. [ ] Primary path rule: keep the common use case available through a small, readable prop surface before adding advanced configuration.
3. [ ] Preset and composition split: decide when repeated option combinations should become named variants, examples, compound composition, or data-driven item contracts instead of more props.
4. [ ] Advanced options boundary: group advanced settings only when they travel together conceptually; avoid generic `options` bags that hide the public API.
5. [ ] Documentation check: explain recommended usage and avoid cases before listing every prop, so readers can choose the simple path first.
6. [ ] Test strategy check: cover representative option interactions and boundaries without locking every possible combination.

## Future Interaction Refactors

Keep interaction extraction small enough that component-specific accessibility behavior stays readable.

1. [ ] Shared item helpers first: before extracting keyboard behavior, add small internal helpers for repeated command-item derivation such as filtering command items, filtering enabled items, mapping enabled ids, and resolving a bounded active index. Keep these helpers pure and data-only so `GridraDropdownMenu`, `GridraContextMenu`, and `GridraCommandPalette` can share the same item preparation rules without sharing DOM or focus behavior.
2. [ ] Shared boundary helpers: centralize simple index boundary logic such as clamp and wrap in internal pure functions. Use clamp where the component should stay at the nearest valid item, and wrap where menu-style arrow navigation should cycle from end to start.
3. [ ] ID-based navigation resolver: extract only the shared item-switching decision for command-like components. The helper should accept enabled item ids, the current id or index, the requested key/action, and a boundary mode such as clamp or wrap, then return the next id/index plus whether the key was handled.
4. [ ] Leave DOM effects local: keep `preventDefault`, `stopPropagation`, actual focus calls, action dispatch, Escape handling, Tab trapping, and overlay close behavior inside each component until repeated behavior is proven identical.
5. [ ] Cover the helpers and resolver with pure tests first: include empty lists, single item, first/last boundaries, disabled items already filtered out, enabled-id derivation, clamp behavior for `GridraCommandPalette`, and wrap behavior for menu-style components.

## Suggested Implementation Order

1. Harden the current exported components and ensure their APIs feel consistent.
2. Add missing basic controls that the Gridra-specific components will need internally.
3. Add spatial editing components such as selection, handles, resize, snap, and inspector panels.
4. Add overlays only after focus management and portal strategy are decided.
5. Add data display once concrete product examples exist in the playground.
6. Add animation integrations after component DOM contracts, refs, and open/close state APIs are stable.
7. Split and document theme color tokens before adding many additional visual variants.
8. Add advanced controls after lower-level primitives, animation guidance, and theme/color decisions are stable.

## Related Documents

- [COMPONENT_IMPLEMENTATION_NOTES.md](./COMPONENT_IMPLEMENTATION_NOTES.md): detailed component, animation, theme, naming, and research notes.
- [COMPONENT_REVIEW_FIXES.md](./COMPONENT_REVIEW_FIXES.md): fixed component-review findings and design cautions.
- [DOCUMENTATION_BACKLOG.md](./DOCUMENTATION_BACKLOG.md): documentation experience backlog.
