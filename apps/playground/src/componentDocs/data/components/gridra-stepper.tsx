import { useState } from "react";
import { GridraButton, GridraStepper } from "@gridra-ui/react";
import type { GridraStepperItem, GridraStepperVariant } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

const checkoutSteps: GridraStepperItem[] = [
  { id: "cart", label: "Cart", description: "2 items" },
  { id: "shipping", label: "Shipping", description: "Tokyo, Japan" },
  { id: "payment", label: "Payment", description: "Card ending 4242" },
  { id: "confirm", label: "Confirm" },
];
const setupSteps: GridraStepperItem[] = [
  { id: "account", label: "Account", description: "Create workspace" },
  { id: "profile", label: "Profile", description: "Team details" },
  { id: "preferences", label: "Preferences", description: "Optional" },
  { id: "review", label: "Review", disabled: true },
];
const variants: GridraStepperVariant[] = ["cards", "ruler", "line", "boxes"];

export function StepperVariantPreview({ variant }: { variant: GridraStepperVariant }) {
  const [checkoutId, setCheckoutId] = useState("payment");
  const [setupId, setSetupId] = useState("profile");
  return <div className="docs-stepper-demo">
    <GridraStepper aria-label={`${variant} checkout steps`} variant={variant} items={checkoutSteps}
      currentId={checkoutId} onStepChange={setCheckoutId} />
    <GridraStepper aria-label={`${variant} setup steps`} variant={variant} items={setupSteps}
      orientation="vertical" currentId={setupId} onStepChange={setSetupId}
      className="docs-stepper-demo__vertical" />
    <GridraButton className="docs-stepper-demo__reset" size="sm" variant="ghost" onClick={() => {
      setCheckoutId("payment");
      setSetupId("profile");
    }}>Reset steps</GridraButton>
  </div>;
}

function exampleCode(variant: GridraStepperVariant) {
  return `const checkoutSteps = [
  { id: "cart", label: "Cart", description: "2 items" },
  { id: "shipping", label: "Shipping", description: "Tokyo, Japan" },
  { id: "payment", label: "Payment", description: "Card ending 4242" },
  { id: "confirm", label: "Confirm" },
];
const setupSteps = [
  { id: "account", label: "Account", description: "Create workspace" },
  { id: "profile", label: "Profile", description: "Team details" },
  { id: "preferences", label: "Preferences", description: "Optional" },
  { id: "review", label: "Review", disabled: true },
];
const [checkoutId, setCheckoutId] = useState("payment");
const [setupId, setSetupId] = useState("profile");

<GridraStepper
  variant="${variant}"
  items={checkoutSteps}
  currentId={checkoutId}
  onStepChange={setCheckoutId}
/>
<GridraStepper
  variant="${variant}"
  orientation="vertical"
  items={setupSteps}
  currentId={setupId}
  onStepChange={setSetupId}
/>`;
}

export const stepperDoc: ComponentDoc = {
  category: "Navigation",
  name: "GridraStepper",
  summary: "Four stepper designs for linear workflows: cards, ruler, line, and square boxes.",
  description: "Choose one of four variants with horizontal or vertical orientation. Completed steps display a check and support backtracking. The current step is highlighted, pending steps remain inactive, and explicitly disabled steps are locked. Ruler adds a ticked progress axis; its percentage follows the current step's position from the first step to the last.",
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
    { name: "aria-label", type: "string", default: '"Progress"', description: "Accessible name for the navigation landmark." },
  ],
  options: ["variants: cards | ruler | line | boxes", "horizontal and vertical", "sizes: sm | md | lg", "controlled or uncontrolled currentId", "per-step locked state", "global disabled"],
  features: ["Completed checks, a highlighted current step, pending steps, and locked steps.", "Four theme-aware designs without the previous rounded markers.", "Ruler announces its percentage and current position through a progressbar.", "Completed steps support keyboard and pointer backtracking.", "Invalid or disabled current ids fall back to the first enabled step."],
  usage: "Use cards for steps with summary details, ruler for position along a measured workflow, line for a compact progress overview, and boxes for a classic numbered sequence. Use currentId to advance after validation and onStepChange to allow reviewing completed steps. Step content remains owned by the application.",
  avoid: "Pending and locked steps do not support direct navigation. Keep step content and validation outside the stepper. Ruler percentage describes position along the sequence rather than the amount of work completed.",
  compositions: ["GridraStepper + GridraStack: arrange step-specific content.", "GridraStepper + GridraButton: advance currentId after completing a step."],
  examples: variants.map((variant) => ({
    title: variant[0].toUpperCase() + variant.slice(1),
    description: "Horizontal checkout and vertical setup. Click a completed step to go back; Reset steps restores the illustrated state.",
    code: exampleCode(variant),
    preview: <StepperVariantPreview variant={variant} />,
  })),
  preview: <StepperVariantPreview variant="boxes" />,
  previewCode: exampleCode("boxes"),
  accessibility: "The step list uses nav, ol, and li. Each step is a native button, the current step has aria-current=step, and unavailable steps use disabled and aria-disabled. Completion is announced separately from decorative checks. Ruler provides a progressbar with a percentage and a textual step position. Decorative strokes, ticks, and markers are hidden from assistive technology.",
};
