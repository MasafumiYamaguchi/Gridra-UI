import { GridraInline, GridraTag } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const tagDoc: ComponentDoc = {
  category: "Display",
  name: "GridraTag",
  summary: "Inline metadata label for categories and attributes.",
  description:
    "GridraTag is a small display-only label for categories, attributes, and filter summaries. It intentionally has no removable, selectable, or button behavior.",
  importExample: 'import { GridraTag } from "@gridra-ui/react";',
  props: [
    { name: "tone", type: '"default" | "accent" | "muted" | "success" | "warning" | "danger"', default: '"default"', description: "Color tone." },
    { name: "size", type: '"sm" | "md"', default: '"md"', description: "Tag size." },
    { name: "children", type: "ReactNode", description: "Tag label." },
  ],
  options: [
    "tone: default | accent | muted | success | warning | danger",
    "size: sm | md",
    "HTML span attributes",
  ],
  features: [
    "Compact inline metadata treatment.",
    "No default interaction or status semantics.",
    "Shares Gridra tone colors with other display primitives.",
  ],
  usage:
    "Use GridraTag for passive labels such as categories, environments, versions, and read-only filter summaries.",
  avoid:
    "Avoid using GridraTag for removable chips or toggles. Use an explicit button-based component for interactive tags.",
  accessibility:
    "GridraTag renders a span and does not add roles by default. Use visible text that makes the tag meaningful in context.",
  examples: [
    {
      title: "Tone set",
      code: `<GridraTag>Default</GridraTag>
<GridraTag tone="accent">Accent</GridraTag>
<GridraTag tone="success">Success</GridraTag>`,
    },
  ],
  preview: (
    <GridraInline align="center" gap="sm">
      <GridraTag>Default</GridraTag>
      <GridraTag tone="accent">Accent</GridraTag>
      <GridraTag tone="muted">Muted</GridraTag>
      <GridraTag size="sm" tone="success">Success</GridraTag>
      <GridraTag size="sm" tone="warning">Warning</GridraTag>
      <GridraTag size="sm" tone="danger">Danger</GridraTag>
    </GridraInline>
  ),
};
