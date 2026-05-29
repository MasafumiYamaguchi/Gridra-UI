import { GridraList, GridraStack } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const listDoc: ComponentDoc = {
  category: "Display",
  name: "GridraList",
  summary: "Semantic ul/ol wrapper for static item lists.",
  description:
    "GridraList renders a plain unordered or ordered list with Gridra spacing, text sizing, optional dividers, and optional data-driven item rendering.",
  importExample: 'import { GridraList } from "@gridra-ui/react";',
  props: [
    { name: "as", type: '"ul" | "ol"', default: '"ul"', description: "Semantic list element." },
    { name: "items", type: "ReactNode[]", description: "Optional item data rendered as li elements." },
    { name: "children", type: "ReactNode", description: "Custom li children when more control is needed." },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Text size." },
    { name: "spacing", type: '"compact" | "normal" | "relaxed"', default: '"normal"', description: "Gap between items." },
    { name: "marker", type: '"default" | "none"', default: '"default"', description: "List marker treatment." },
    { name: "dividers", type: "boolean", default: "false", description: "Adds separators between direct list items." },
  ],
  options: [
    "as: ul | ol",
    "items or custom children",
    "size: sm | md | lg",
    "spacing: compact | normal | relaxed",
    "marker and dividers",
    "HTML list attributes",
  ],
  features: [
    "Keeps native list semantics.",
    "Can render simple item arrays or caller-owned li children.",
    "No selection, sorting, filtering, or collapse state.",
  ],
  usage:
    "Use GridraList for short static lists, changelog bullets, ordered setup steps, or metadata groups that should remain semantic lists.",
  avoid:
    "Avoid using GridraList for selectable menus or virtualized data. Use a control or data component with explicit interaction behavior for those cases.",
  accessibility:
    "GridraList uses ul or ol. Provide aria-label when the list needs a name outside visible context.",
  examples: [
    {
      title: "Simple items",
      code: `<GridraList
  items={["Import nodes", "Validate edges", "Publish layout"]}
/>`,
    },
  ],
  preview: (
    <GridraStack gap="md">
      <GridraList items={["Import nodes", "Validate edges", "Publish layout"]} />
      <GridraList as="ol" dividers marker="none" size="sm">
        <li>Draft</li>
        <li>Review</li>
        <li>Ship</li>
      </GridraList>
    </GridraStack>
  ),
};
