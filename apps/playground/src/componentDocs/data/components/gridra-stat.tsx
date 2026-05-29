import { GridraInline, GridraStat } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const statDoc: ComponentDoc = {
  category: "Display",
  name: "GridraStat",
  summary: "Single metric display with label and supporting description.",
  description:
    "GridraStat displays a single numeric or textual value with optional label and description. It does not announce updates or add status semantics by default.",
  importExample: 'import { GridraStat } from "@gridra-ui/react";',
  props: [
    { name: "value", type: "ReactNode", required: true, description: "Primary metric value." },
    { name: "label", type: "ReactNode", description: "Optional label above the value." },
    { name: "description", type: "ReactNode", description: "Optional supporting text." },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Value size." },
    { name: "tone", type: '"default" | "accent" | "muted"', default: '"default"', description: "Value tone." },
    { name: "align", type: '"start" | "center" | "end"', default: '"start"', description: "Text alignment." },
  ],
  options: [
    "value, label, description slots",
    "size: sm | md | lg",
    "tone: default | accent | muted",
    "align: start | center | end",
    "HTML div attributes",
  ],
  features: [
    "Designed for one metric per component.",
    "Uses brand monospace styling for the value.",
    "No live region or status role unless supplied by the consumer.",
  ],
  usage:
    "Use GridraStat in dashboards, cards, and inspector summaries where a single value should stand out from surrounding text.",
  avoid:
    "Avoid using GridraStat as a realtime announcement surface. Add explicit live-region behavior in the parent if updates must be announced.",
  accessibility:
    "GridraStat renders a div with no default role. Add aria-label when the visible label/value pairing is not enough in context.",
  examples: [
    {
      title: "Metric row",
      code: `<GridraStat label="Nodes" value="128" description="+12 since last run" />`,
    },
  ],
  preview: (
    <GridraInline gap="lg">
      <GridraStat label="Nodes" value="128" description="+12" tone="accent" />
      <GridraStat label="Edges" value="342" description="Stable" />
      <GridraStat label="Errors" value="0" description="No failures" tone="muted" />
    </GridraInline>
  ),
};
