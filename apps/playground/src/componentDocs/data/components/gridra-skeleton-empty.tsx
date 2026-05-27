import {
  GridraBox,
  GridraButton,
  GridraCluster,
  GridraEmptyState,
  GridraLabel,
  GridraSkeleton,
  GridraStack,
} from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const skeletonDoc: ComponentDoc = {
  category: "Feedback",
  name: "GridraSkeleton",
  summary:
    "Placeholder loading shape with block, text, and circle variants, optional shimmer animation, and text rows support.",
  description:
    "GridraSkeleton renders a lightweight placeholder shape to indicate loading content. It supports block (rectangle), text (with configurable rows), and circle variants. An optional shimmer pulse animation runs by default and respects prefers-reduced-motion. Width and height can be set directly via props as CSS custom properties, while size controls overall scale.",
  importExample:
    'import { GridraSkeleton } from "@gridra-ui/react";',
  props: [
    {
      default: '"block"',
      description: "Shape variant.",
      name: "variant",
      type: '"block" | "text" | "circle"',
    },
    {
      default: '"md"',
      description: "Base scale of the skeleton.",
      name: "size",
      type: '"sm" | "md" | "lg"',
    },
    {
      default: "true",
      description: "Enables shimmer pulse animation.",
      name: "animated",
      type: "boolean",
    },
    {
      description:
        "Overrides width. Numbers are treated as px, strings are used as-is.",
      name: "width",
      type: "number | string",
    },
    {
      description:
        "Overrides height. Numbers are treated as px, strings are used as-is.",
      name: "height",
      type: "number | string",
    },
    {
      description:
        "Number of text rows (variant=text only). Defaults to 1 when omitted.",
      name: "rows",
      type: "number",
    },
  ],
  options: [
    "variants: block | text | circle",
    "sizes: sm | md | lg",
    "animated: shimmer pulse on/off",
    "rows: multi-line text placeholder",
    "width / height: CSS custom property overrides",
    'aria-hidden="true" by default',
  ],
  features: [
    "Decorative by default — aria-hidden=true, no interactive functionality.",
    "Shimmer animation that automatically stops for prefers-reduced-motion.",
    "Width and height overrides via CSS custom properties for flexible layout integration.",
    "Text variant supports rows for multi-line content placeholders (e.g. paragraphs, list items).",
  ],
  usage: "Use GridraSkeleton as a loading placeholder while content is being fetched or processed. Pair it with GridraProgress for top-level loading states and GridraSpinner for inline indeterminate loading. Do not nest interactive elements inside skeletons — they are purely decorative.",
  avoid: "Avoid using GridraSkeleton for fully interactive loading states — it has no ARIA live region or progress semantics. Avoid animating skeletons when prefers-reduced-motion is active (built-in). Avoid placing skeletons inside buttons, links, or form controls.",
  compositions: [
    "GridraSkeleton + GridraStack: row/column loading layout.",
    "GridraSkeleton + GridraBox: card or panel loading placeholder.",
    "GridraSkeleton (circle) + text: avatar + name loading pattern.",
  ],
  examples: [
    {
      title: "Block",
      code: `<GridraSkeleton height={120} width="100%" />`,
    },
    {
      title: "Text rows",
      code: `<GridraSkeleton rows={4} variant="text" />`,
    },
    {
      title: "Circle",
      code: `<GridraSkeleton height={40} variant="circle" width={40} />`,
    },
  ],
  preview: (
    <GridraStack gap="sm" style={{ maxWidth: 320 }}>
      <GridraSkeleton height={80} width="100%" />
      <GridraSkeleton rows={3} variant="text" />
      <GridraCluster gap="sm">
        <GridraSkeleton height={40} variant="circle" width={40} />
        <GridraStack gap="xs" style={{ flex: 1 }}>
          <GridraSkeleton variant="text" />
          <GridraSkeleton variant="text" />
        </GridraStack>
      </GridraCluster>
    </GridraStack>
  ),
  accessibility:
    "GridraSkeleton sets aria-hidden=true by default because it is a decorative placeholder. Consumers may override aria-hidden if accessibility tooling requires explicit exposure, but for most cases the default is correct. The shimmer animation is automatically disabled under prefers-reduced-motion: reduce.",
};

export const emptyStateDoc: ComponentDoc = {
  category: "Feedback",
  name: "GridraEmptyState",
  summary:
    "Centered empty-state panel with icon, heading, description, action slots, and optional body content.",
  description:
    "GridraEmptyState renders a centered empty-state message for panels, lists, or views that have no data. It accepts optional icon, heading, description, primary/secondary action slots, and arbitrary children for extended content. The layout uses a compact centered stack suitable for dense panel UIs without heavy card framing.",
  importExample:
    'import { GridraEmptyState } from "@gridra-ui/react";',
  props: [
    {
      description: "Optional leading icon. Wrapped with aria-hidden=true.",
      name: "icon",
      type: "ReactNode",
    },
    {
      description: "Primary heading text.",
      name: "heading",
      type: "ReactNode",
    },
    {
      description: "Secondary descriptive text.",
      name: "description",
      type: "ReactNode",
    },
    {
      description:
        "Primary action element (e.g., GridraButton).",
      name: "primaryAction",
      type: "ReactNode",
    },
    {
      description:
        "Secondary action element (e.g., GridraButton).",
      name: "secondaryAction",
      type: "ReactNode",
    },
    {
      description: "Additional body content below the description.",
      name: "children",
      type: "ReactNode",
    },
    {
      default: '"md"',
      description: "Controls overall spacing and text scale.",
      name: "size",
      type: '"sm" | "md" | "lg"',
    },
  ],
  options: [
    "sizes: sm | md | lg",
    "optional icon, heading, description",
    "primaryAction and secondaryAction slots",
    "children slot for extra content",
  ],
  features: [
    "No forced ARIA role — consumers apply semantics as needed.",
    "Icon wrapper automatically sets aria-hidden=true.",
    "Compact stacked layout suitable for dense panel UIs.",
    "Accepts all standard HTML div attributes (className, data-*, aria-*, etc.).",
  ],
  usage: "Use GridraEmptyState inside panels, lists, tables, or views that have no data. Supply a heading, description, icon (optional), and at least one action (primaryAction) to guide the user. Children can add supplementary content below the description.",
  avoid: "Avoid using GridraEmptyState as a full-page error screen — it is designed for inline empty states within panels and containers. Avoid nesting interactive elements inside the description slot; use action slots instead.",
  compositions: [
    "GridraEmptyState + GridraButton: primary action to create content.",
    "GridraEmptyState + GridraStack: custom icon/text layouts.",
    "GridraEmptyState + GridraBox inside panels: per-panel empty states.",
  ],
  examples: [
    {
      title: "With icon and action",
      code: `<GridraEmptyState
  description="Create your first canvas to get started."
  heading="No canvases yet"
  icon={<svg>…</svg>}
  primaryAction={<GridraButton>Create canvas</GridraButton>}
  secondaryAction={<GridraButton variant="ghost">Import</GridraButton>}
/>`,
    },
    {
      title: "Minimal",
      code: `<GridraEmptyState
  description="This folder is empty."
  heading="No files"
/>`,
    },
  ],
  preview: (
    <GridraBox padding="md">
      <GridraEmptyState
        description="This panel has no data yet. Create a new item to begin."
        heading="Nothing to show"
        primaryAction={
          <GridraButton size="sm">Create item</GridraButton>
        }
        secondaryAction={
          <GridraButton size="sm" variant="ghost">
            Learn more
          </GridraButton>
        }
      />
    </GridraBox>
  ),
  accessibility:
    "GridraEmptyState does not enforce a specific ARIA role, allowing consumers to add the appropriate semantics for their context. The icon wrapper is aria-hidden=true by default since it is decorative. Buttons passed into action slots should carry accessible labels.",
};
