import { GridraDescriptionList } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const descriptionListDoc: ComponentDoc = {
  category: "Display",
  name: "GridraDescriptionList",
  summary: "Semantic term and description pairs for metadata.",
  description:
    "GridraDescriptionList renders dl/dt/dd metadata pairs with compact Gridra typography. It is display-only and leaves editing or disclosure behavior to parent components.",
  importExample: 'import { GridraDescriptionList } from "@gridra-ui/react";',
  props: [
    { name: "items", type: "{ term: ReactNode; description: ReactNode; key?: string }[]", description: "Optional term/description data." },
    { name: "children", type: "ReactNode", description: "Custom dl children." },
    { name: "density", type: '"compact" | "normal"', default: '"normal"', description: "Vertical spacing density." },
  ],
  options: [
    "items or custom dl children",
    "density: compact | normal",
    "HTML dl attributes",
  ],
  features: [
    "Keeps native description list semantics.",
    "Supports data-driven metadata pairs.",
    "Uses muted uppercase terms and readable descriptions.",
  ],
  usage:
    "Use GridraDescriptionList for inspector metadata, read-only settings, and summary fields where term/description semantics are useful.",
  avoid:
    "Avoid placing editable controls directly in the description slot unless the parent surface explains the editing workflow.",
  accessibility:
    "The root is a dl. Terms render as dt and descriptions render as dd when using the items prop.",
  examples: [
    {
      title: "Metadata pairs",
      code: `<GridraDescriptionList
  items={[
    { term: "Owner", description: "Design systems" },
    { term: "Status", description: "Ready" },
  ]}
/>`,
    },
  ],
  preview: (
    <GridraDescriptionList
      items={[
        { term: "Owner", description: "Design systems" },
        { term: "Status", description: "Ready" },
        { term: "Region", description: "US East" },
      ]}
    />
  ),
};
