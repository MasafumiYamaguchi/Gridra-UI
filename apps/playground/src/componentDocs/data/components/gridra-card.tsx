import { GridraCard, GridraInline, GridraKbd, GridraStack, GridraTag } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const cardDoc: ComponentDoc = {
  category: "Display",
  name: "GridraCard",
  summary: "Static content surface with header, body, media, action, and footer slots.",
  description:
    "GridraCard is a display-first container for related content. It provides visual framing and slots, but does not own selection, expansion, or click behavior.",
  importExample: 'import { GridraCard } from "@gridra-ui/react";',
  props: [
    { name: "heading", type: "ReactNode", description: "Optional heading slot." },
    { name: "description", type: "ReactNode", description: "Optional supporting text." },
    { name: "media", type: "ReactNode", description: "Optional leading media slot." },
    { name: "actions", type: "ReactNode", description: "Optional trailing header actions." },
    { name: "footer", type: "ReactNode", description: "Optional footer content." },
    { name: "padding", type: '"sm" | "md" | "lg"', default: '"md"', description: "Inner spacing." },
    { name: "surface", type: '"surface" | "raised" | "input"', default: '"surface"', description: "Background treatment." },
  ],
  options: [
    "heading, description, media, actions, footer slots",
    "padding: sm | md | lg",
    "surface: surface | raised | input",
    "HTML div attributes",
  ],
  features: [
    "Composes static content without adding interaction semantics.",
    "Uses existing surface, border, spacing, and typography tokens.",
    "Header actions are only a layout slot; consumers provide any controls.",
  ],
  usage:
    "Use GridraCard for compact summaries, metadata panels, and grouped display content in dense application surfaces.",
  avoid:
    "Avoid using GridraCard as a clickable card primitive. Add explicit controls in the actions or body slot when interaction is needed.",
  accessibility:
    "GridraCard renders a div and does not add roles by default. Add aria-label, aria-labelledby, or a semantic wrapper when the surrounding document structure needs one.",
  examples: [
    {
      title: "Summary card",
      code: `<GridraCard
  heading="Pipeline"
  description="Last run completed"
  footer="Updated 2m ago"
>
  <GridraTag tone="success">Healthy</GridraTag>
</GridraCard>`,
    },
  ],
  preview: (
    <GridraCard
      actions={<GridraKbd size="sm">R</GridraKbd>}
      description="Display-only health summary"
      footer="Updated 2m ago"
      heading="Pipeline"
      surface="raised"
    >
      <GridraStack gap="sm">
        <GridraInline align="center" gap="sm">
          <GridraTag tone="success">Healthy</GridraTag>
          <GridraTag tone="muted">Batch 1</GridraTag>
        </GridraInline>
        <span>24 nodes processed with no failed edges.</span>
      </GridraStack>
    </GridraCard>
  ),
};
