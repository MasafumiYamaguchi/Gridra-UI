import { GridraBadge, GridraBox, GridraInline, GridraTreeView } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const treeViewDoc: ComponentDoc = {
    category: "Navigation",
    name: "GridraTreeView",
    summary: "Hierarchical tree with nested items API, expand/collapse, keyboard navigation, and ARIA tree pattern.",
    description:
      "GridraTreeView renders a tree structure from nested items. Branches expand/collapse on row click or keyboard. Full keyboard navigation follows the ARIA tree pattern with Arrow keys, Home/End. Disabled items are excluded from interaction and keyboard navigation.",
    importExample: 'import { GridraTreeView } from "@gridra-ui/react";',
    props: [
      { name: "items", type: "GridraTreeItem[]", required: true, description: "Nested tree items with { id, label, children?, disabled? }." },
      { name: "expandedIds", type: "string[]", description: "Controlled expanded branch ids." },
      { name: "defaultExpandedIds", type: "string[]", description: "Initial expanded ids when uncontrolled. Defaults to all collapsed." },
      { name: "onExpandedIdsChange", type: "(nextIds, previousIds) => void", description: "Callback when expanded state changes." },
      { name: "renderItem", type: "(item, state) => ReactNode", description: "Custom row content renderer for richer tree item bodies." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Row padding and font size." },
      { name: "emptyState", type: "ReactNode", description: "Content shown when items is empty." },
    ],
    options: [
      "nested items with children for branches",
      "controlled or uncontrolled expand",
      "custom item content via renderItem",
      "disabled items excluded from all interactions",
      "sizes: sm | md | lg",
      "empty state for empty items",
    ],
    features: [
      "ARIA tree pattern: role=tree/treeitem/group, aria-level, aria-expanded.",
      "Row click toggles expand/collapse on branches.",
      "Keyboard navigation: ArrowUp/Down traverse visible items, ArrowRight/Left expand/collapse and navigate hierarchy, Home/End jump to extremes.",
      "renderItem receives item state so rows can include badges, counts, metadata, or compact controls.",
      "Disabled items are skipped in keyboard navigation and cannot be expanded.",
      "Defensive normalization: invalid/disabled ids in expanded sets are silently ignored.",
    ],
    usage: "Use GridraTreeView for file browsers, settings trees, or any nested navigation UI. Pass items with children to create branches and leaf nodes. Manage expand state via controlled or uncontrolled props.",
    compositions: [
      "GridraTreeView + GridraPanel: sidebar tree navigation.",
    ],
    examples: [
      {
        title: "Basic nested tree",
        code: `<GridraTreeView
  items={[
    {
      id: "src",
      label: "src",
      children: [
        { id: "components", label: "components", children: [{ id: "button", label: "Button.tsx" }] },
        { id: "index", label: "index.ts" },
      ],
    },
    { id: "public", label: "public", children: [{ id: "favicon", label: "favicon.ico" }] },
  ]}
/>`,
      },
      {
        title: "With controlled expand",
        code: `const [expanded, setExpanded] = useState<string[]>([]);

<GridraTreeView
  items={items}
  expandedIds={expanded}
  onExpandedIdsChange={setExpanded}
/>`,
      },
      {
        title: "Custom row content",
        code: `<GridraTreeView
  items={items}
  renderItem={(item, state) => (
    <GridraInline gap="sm" align="center">
      <span>{item.label}</span>
      {state.hasChildren ? <GridraBadge size="sm">Group</GridraBadge> : null}
    </GridraInline>
  )}
/>`,
      },
    ],
    preview: (
      <GridraBox padding="md" style={{ width: 300 }}>
        <GridraTreeView
          items={[
            {
              id: "src",
              label: "src",
              children: [
                { id: "components", label: "components",
                  children: [{ id: "button", label: "Button.tsx" }],
                },
                { id: "index", label: "index.ts" },
              ],
            },
            { id: "public", label: "public",
              children: [{ id: "favicon", label: "favicon.ico" }],
            },
            { id: "package", label: "package.json" },
          ]}
          renderItem={(item, state) => (
            <GridraInline align="center" gap="sm">
              <span>{item.label}</span>
              {state.hasChildren ? (
                <GridraBadge size="sm" tone="muted">Group</GridraBadge>
              ) : null}
            </GridraInline>
          )}
        />
      </GridraBox>
    ),
    accessibility:
      "Root uses role='tree' on a ul element. Each item is role='treeitem' with aria-level for depth and aria-expanded for branch state. Child groups use role='group'. Keyboard navigation follows the tree pattern: ArrowDown/Up for focus movement, ArrowRight/Left for expand/collapse and hierarchy navigation, Home/End for extremes. Focused items use tabindex=0, others use tabindex=-1.",
  };
