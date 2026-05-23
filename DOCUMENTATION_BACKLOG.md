# Documentation Backlog

Documentation experience backlog split out from [COMPONENT_ROADMAP.md](./COMPONENT_ROADMAP.md). Keep this file focused on docs navigation, information architecture, preview quality, mobile docs UX, and visual hierarchy.

## Documentation Experience Backlog

The playground docs should become a component guide that helps users decide when, why, and how to use each component, not only an API reference.

### P0: Navigation And Scroll

- [x] Reset the `.docs-detail` scroll position to the top whenever a component is selected.
- [x] Reset the detail scroll position when a category change selects a new first component.
- [x] Ensure hash-based direct access opens the matching component from the top of the detail pane.
- [x] Add component-name search to the docs navigation.
- [x] Combine search results with the active category filter.
- [x] Show an empty state when no components match the current search/category combination.

### P1: Information Architecture

- [x] Extend `ComponentDoc` with optional guide fields: `usage`, `avoid`, `compositions`, `accessibility`, `notes`, and `states`.
- [x] Reorder detail pages around the reader's decision flow: Overview, Usage, Import, Preview, States, Props, Examples, Notes, Accessibility.
- [x] Keep `description` as the Overview text while the schema migrates.
- [x] Move `features` and `options` into Notes section grouped by label.
- [ ] Migrate individual component docs to use new guide fields over time.

### P2: Preview Quality

- [x] Treat Preview as a comparison surface, not only a render smoke check.
- [x] Prioritize richer state previews for `GridraButton`, `GridraBadge`, `GridraAvatar`, `GridraField`, `GridraSlider`, `GridraSelectableGrid`, and `GridraCanvasArea`.
- [x] Increase preview space where needed so variant, state, and density differences are visible.
- [x] Keep decision-oriented Preview/States content before Props and Examples.

### P3: Mobile Docs UX

- [x] Avoid showing the full component list before the detail content on narrow screens.
- [x] Group category, search, and selected component controls near the top on mobile.
- [x] Collapse the component list or replace it with a compact selector/listbox pattern below 760px.
- [x] Reduce the distance from page top to the active component detail on mobile.

### P4: Visual Hierarchy

- [x] Dogfood Gridra UI components in the docs UI itself (search input, copy button, headers, example headers).
- [x] Differentiate section weight for Overview, Preview, Props, Examples, Accessibility, and Notes.
- [x] Make lower-priority technical blocks such as Import visually quieter.
- [x] Reduce repeated high-contrast borders where they make all sections feel equally important.
- [x] Make Preview, Usage, and Accessibility the strongest reading anchors.

Acceptance checks:

- Component nav click starts the detail pane at the component title.
- Category change starts the new detail pane at the component title.
- Search filters by component name and works together with category filters.
- Mobile docs do not require scrolling through a long component list before reaching content.
- Existing docs data continues to type-check while new guide fields are adopted incrementally.
