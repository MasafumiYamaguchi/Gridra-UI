import type { GridraStepperVariant } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";
import { StepperExample } from "./stepper-example";
import stepperExampleSource from "./stepper-example.tsx?raw";

const variants: GridraStepperVariant[] = ["cards", "ruler", "line", "boxes"];

function exampleCode(variant: GridraStepperVariant) {
  return `${stepperExampleSource.trimEnd()}

export default function Example() {
  return <StepperExample variant="${variant}" />;
}
`;
}

export const stepperDoc: ComponentDoc = {
  category: "Navigation",
  name: "GridraStepper",
  summary: "Four stepper designs for linear workflows: cards, ruler, line, and square boxes.",
  description: "Choose one of four variants with horizontal or vertical orientation. Completed steps display a check and support backtracking. The current step is highlighted, pending steps remain inactive, and explicitly disabled steps are locked. Ruler adds a ticked progress axis; its percentage follows the current step's position from the first step to the last. A single step starts at 0% because there is no interval to traverse.",
  importExample: 'import { GridraStepper } from "@gridra-ui/react";',
  props: [
    { name: "items", type: "GridraStepperItem[]", required: true, description: "Array of { id, label, description?, disabled? }." },
    { name: "variant", type: '"cards" | "ruler" | "line" | "boxes"', default: '"boxes"', description: "Cards, a ticked ruler, progress lines, or square numbered markers." },
    { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Available for all four variants." },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Marker, spacing, and text size." },
    { name: "currentId", type: "string", description: "Controlled current step id. Update this to move forward." },
    { name: "defaultCurrentId", type: "string", description: "Initial step when uncontrolled." },
    { name: "onStepChange", type: "(nextId, previousId) => void", description: "Called when returning to a completed step." },
    { name: "disabled", type: "boolean", default: "false", description: "Disables every step interaction." },
    { name: "aria-label", type: "string", default: '"Progress"', description: "Accessible name for navigation and the ruler progressbar." },
    { name: "aria-labelledby", type: "string", description: "IDs of external naming elements. Takes precedence over aria-label and also names the ruler progressbar." },
  ],
  options: ["variants: cards | ruler | line | boxes", "horizontal and vertical", "sizes: sm | md | lg", "controlled or uncontrolled currentId", "per-step locked state", "global disabled"],
  features: ["Completed checks, a highlighted current step, pending steps, and locked steps.", "Four theme-aware designs with horizontal and vertical orientations.", "Ruler announces its percentage and current position through a progressbar named after the stepper.", "Completed steps support keyboard and pointer backtracking.", "Invalid or disabled current ids fall back to the first enabled step."],
  usage: "Use cards for steps with summary details, ruler for position along a measured workflow, line for a compact progress overview, and boxes for a classic numbered sequence. Use currentId to advance after validation and onStepChange to allow reviewing completed steps. Step content remains owned by the application.",
  avoid: "Pending and locked steps do not support direct navigation. Keep step content and validation outside the stepper. Ruler percentage describes position along the sequence rather than the amount of work completed.",
  compositions: ["GridraStepper + GridraStack: arrange step-specific content.", "GridraStepper + GridraButton: advance currentId after completing a step."],
  examples: variants.map((variant) => ({
    title: variant[0].toUpperCase() + variant.slice(1),
    description: "Horizontal checkout and vertical setup. Click a completed step to go back, use Next to advance to the next enabled step, or Reset steps to restore the illustrated state.",
    code: exampleCode(variant),
    preview: <StepperExample variant={variant} />,
  })),
  preview: <StepperExample variant="boxes" />,
  previewCode: exampleCode("boxes"),
  accessibility: "The step list uses nav, ol, and li. Each step is a native button whose accessible name includes its number, label, description, and completed or locked state. The current step has aria-current=step, and unavailable steps use disabled and aria-disabled. Ruler provides a progressbar with a percentage and textual step position. aria-labelledby names both the navigation and progressbar; otherwise aria-label names them. Decorative strokes, ticks, and markers are hidden to avoid duplicate announcements.",
};
