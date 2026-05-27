import { GridraButton, GridraProgress, GridraStack } from "@gridra-ui/react";
import { useState } from "react";
import type { ComponentDoc } from "../../types";

function ProgressPreview() {
  const [value, setValue] = useState(0);

  return (
    <GridraStack gap="sm">
      <GridraStack gap="xs">
        <GridraProgress value={value} label={`${value}%`} />
        <GridraButton
          onClick={() => setValue((v) => Math.min(v + 10, 100))}
          size="sm"
          variant="ghost"
        >
          +10%
        </GridraButton>
      </GridraStack>
      <GridraProgress label="Indeterminate" />
      <GridraProgress tone="success" value={75} />
      <GridraProgress size="sm" tone="warning" value={45} />
      <GridraProgress size="lg" tone="danger" value={90} />
    </GridraStack>
  );
}

export const progressDoc: ComponentDoc = {
  category: "Feedback",
  name: "GridraProgress",
  summary:
    "Linear progress bar with determinate and indeterminate modes, multiple sizes and tones.",
  description:
    "GridraProgress renders a linear progress indicator that supports both determinate (value-based) and indeterminate (ongoing) states. It is a read-only display component — no interaction events or controlled/uncontrolled state management. For circular loading spinners use GridraSpinner.",
  importExample:
    'import { GridraProgress } from "@gridra-ui/react";',
  props: [
    {
      default: "undefined",
      description:
        "Progress value between 0 and max. Omit for indeterminate mode.",
      name: "value",
      type: "number",
    },
    {
      default: "100",
      description:
        "Maximum value. Used to normalize the fill width and set aria-valuemax.",
      name: "max",
      type: "number",
    },
    {
      default: '"md"',
      description: "Bar thickness.",
      name: "size",
      type: '"sm" | "md" | "lg"',
    },
    {
      default: '"default"',
      description: "Fill color variant.",
      name: "tone",
      type: '"default" | "muted" | "accent" | "success" | "warning" | "danger"',
    },
    {
      description:
        "Accessible label announced by screen readers. Sets aria-label on the progressbar.",
      name: "label",
      type: "string",
    },
  ],
  options: [
    "sizes: sm | md | lg",
    "tones: default | muted | accent | success | warning | danger",
    "indeterminate mode when value is omitted",
    "clamped to 0…max",
  ],
  features: [
    "role=progressbar with aria-valuenow, aria-valuemin, aria-valuemax.",
    "Indeterminate animation with prefers-reduced-motion fallback.",
    "Width transitions smoothly between value changes.",
    "Accepts all standard HTML div attributes (className, etc.).",
  ],
  usage: "Use GridraProgress for linear loading indicators such as file uploads, form steps, or resource loading. For indeterminate circular loading use GridraSpinner. For skeleton/placeholder loading of entire surfaces, that will be covered by a future GridraSkeleton component.",
  avoid: "Avoid using GridraProgress as a circular loading spinner. Avoid placing interactive elements inside the progress bar — it is display-only. Avoid animating value changes faster than 10-30 FPS without throttling to prevent layout thrash.",
  compositions: [
    "GridraProgress + GridraButton: manual progress advancement.",
    "GridraProgress + GridraStack: stacked multi-step progress indicators.",
    "GridraProgress + file upload hooks: real-time upload feedback.",
  ],
  examples: [
    {
      title: "Determinate",
      code: `<GridraProgress label="Upload progress" value={65} />`,
    },
    {
      title: "Indeterminate",
      code: `<GridraProgress label="Loading data" />`,
    },
    {
      title: "With tone and size",
      code: `<GridraProgress
  label="Disk usage"
  max={1024}
  size="lg"
  tone="warning"
  value={873}
/>`,
    },
  ],
  preview: <ProgressPreview />,
  accessibility:
    "Determinate: role=progressbar with aria-valuenow, aria-valuemin=0, aria-valuemax. Indeterminate: role=progressbar without aria-valuenow. Both modes accept aria-label via the label prop. The fill element is purely decorative (no aria role).",
};
