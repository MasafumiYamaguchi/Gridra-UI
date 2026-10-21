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
  notes:
    "Behavior is provided by useGridraStepper from @gridra-ui/headless. Use the same state and semantic bindings with your own DOM and CSS. Gridra visual variants and theme integration remain in @gridra-ui/react.",
  category: "Navigation",
  name: "GridraStepper",
  summary:
    "Four stepper designs for linear workflows: cards, ruler, line, and square boxes.",
  description:
    "Choose one of four variants with horizontal or vertical orientation. Completed steps display a check and support backtracking. The current step is highlighted, pending steps remain inactive, and explicitly disabled steps are locked. Ruler shows the current position along the axis; a single current step is the terminal position at 100%. Cards and line keep readable column widths and scroll horizontally within the component when needed.",
  importExample: 'import { GridraStepper } from "@gridra-ui/react";',
  props: [
    {
      name: "items",
      type: "GridraStepperItem[]",
      required: true,
      description: "Array of { id, label, description?, disabled? }.",
    },
    {
      name: "variant",
      type: '"cards" | "ruler" | "line" | "boxes"',
      default: '"boxes"',
      description:
        "Cards, a ticked ruler, progress lines, or square numbered markers.",
    },
    {
      name: "orientation",
      type: '"horizontal" | "vertical"',
      default: '"horizontal"',
      description: "Available for all four variants.",
    },
    {
      name: "size",
      type: '"sm" | "md" | "lg"',
      default: '"md"',
      description: "Marker, spacing, and text size.",
    },
    {
      name: "currentId",
      type: "string",
      description: "Controlled current step id. Update this to move forward.",
    },
    {
      name: "defaultCurrentId",
      type: "string",
      description: "Initial step when uncontrolled.",
    },
    {
      name: "onStepChange",
      type: "(nextId, previousId) => void",
      description: "Called when returning to a completed step.",
    },
    {
      name: "disabled",
      type: "boolean",
      default: "false",
      description: "Disables every step interaction.",
    },
    {
      name: "labels",
      type: "Partial<GridraStepperLabels>",
      description:
        "Localize navigation, progress, completed, locked, lockedStatus, step, active, now, start, end, and noCurrentStep. position(step, total) and summary(percentage, position) format ruler text.",
    },
    {
      name: "aria-label",
      type: "string",
      default: '"Progress"',
      description: "Accessible name for navigation and the ruler progressbar.",
    },
    {
      name: "aria-labelledby",
      type: "string",
      description:
        "IDs of external naming elements. Takes precedence over aria-label; ruler adds the localized progress suffix to these names.",
    },
  ],
  options: [
    "variants: cards | ruler | line | boxes",
    "horizontal and vertical",
    "sizes: sm | md | lg",
    "controlled or uncontrolled currentId",
    "per-step locked state",
    "global disabled",
  ],
  features: [
    "Completed checks, a highlighted current step, pending steps, and locked steps.",
    "Four theme-aware designs with horizontal and vertical orientations.",
    "Ruler announces its percentage and current position through a progressbar named after the stepper.",
    "Completed steps support keyboard and pointer backtracking.",
    "Invalid or disabled current ids fall back to the first enabled step.",
  ],
  usage:
    "Use cards for steps with summary details, ruler for position along a measured workflow, line for a compact progress overview, and boxes for a classic numbered sequence. Use currentId to advance after validation and onStepChange to allow reviewing completed steps. The examples switch a checkout panel using currentId. Use labels to translate status text and ruler formats.",
  avoid:
    "Pending and locked steps do not support direct navigation. Keep step content and validation outside the stepper. Ruler percentage describes position along the sequence rather than the amount of work completed.",
  compositions: [
    "GridraStepper + GridraStack: arrange step-specific content.",
    "GridraStepper + GridraButton: advance currentId after completing a step.",
  ],
  examples: [
    {
      title: "Custom markup with headless hook",
      code: 'import { useGridraStepper } from "@gridra-ui/headless";\n\nexport default function Example() {\n  const stepper = useGridraStepper({ items: [{ id: "first", label: "First" }, { id: "last", label: "Last" }], defaultCurrentId: "last" });\n  return <nav aria-label="Custom steps">{stepper.steps.map(step => <button key={step.item.id} {...stepper.getStepProps(step.item.id)}>{step.item.label}</button>)}</nav>;\n}',
    },
    ...variants.map((variant) => ({
      title: variant[0].toUpperCase() + variant.slice(1),
      description:
        "Horizontal checkout with an editable panel controlled by currentId, plus vertical setup. Click a completed step to go back, use Next to advance, or Reset steps to restore the illustrated state.",
      code: exampleCode(variant),
      preview: <StepperExample variant={variant} />,
    })),
  ],
  preview: <StepperExample variant="boxes" />,
  previewCode: exampleCode("boxes"),
  accessibility:
    "The step list uses nav, ol, and li. Each step is a native button whose name includes its number, label, description, and completed or locked state. Unavailable steps remain in the Tab order with aria-disabled=true so their status can be read, but do not activate. The current step has aria-current=step. Ruler provides a progressbar with a percentage and textual position, adding labels.progress to the navigation's accessible name. All generated text is customizable through labels. Decorative strokes, ticks, and markers are hidden to avoid duplicate announcements.",
};
