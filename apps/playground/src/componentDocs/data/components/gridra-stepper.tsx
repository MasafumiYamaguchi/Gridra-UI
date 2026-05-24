import { GridraBox, GridraStack, GridraStepper } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const stepperDoc: ComponentDoc = {
    category: "Navigation",
    name: "GridraStepper",
    summary: "Linear step indicator showing progress through a multi-step workflow, with support for completed step backtracking.",
    description:
      "GridraStepper renders a list of steps as an ordered list inside a navigation landmark. Each step shows a marker, label, and optional description. Steps are classified as completed (before current), current, or pending (after current). Completed steps are clickable to jump back; pending steps are disabled. Supports controlled and uncontrolled currentId modes, horizontal/vertical orientation, three sizes, and per-step or global disabled states. v1 is a progress indicator only; panel content switching is managed by the parent.",
    importExample: 'import { GridraStepper } from "@gridra-ui/react";',
    props: [
      { name: "items", type: "GridraStepperItem[]", required: true, description: "Array of { id, label, description?, disabled? }." },
      { name: "currentId", type: "string", description: "Controlled current step id." },
      { name: "defaultCurrentId", type: "string", description: "Initial current step id when uncontrolled." },
      { name: "onStepChange", type: "(nextId, previousId) => void", description: "Callback when a completed step is clicked." },
      { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Layout direction of the step list." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Step padding and font size." },
      { name: "disabled", type: "boolean", default: "false", description: "Disables all step interactions globally." },
      { name: "aria-label", type: "string", default: '"Progress"', description: "Accessible label for the nav landmark." },
    ],
    options: [
      "orientation: horizontal | vertical",
      "sizes: sm | md | lg",
      "controlled or uncontrolled currentId",
      "per-step disabled",
      "global disabled",
    ],
    features: [
      "Rendered as nav with aria-label and ol/li structure.",
      "Steps before current get completed state and are clickable for backtracking.",
      "Current step gets aria-current='step' and does not fire callback on click.",
      "Pending steps are disabled and non-interactive.",
      "Explicitly disabled steps are non-interactive in any position.",
      "Each step shows a numbered marker, label, and optional description.",
      "Connectors between steps reflect state (completed/current/pending/disabled).",
      "Unknown, empty, or disabled currentId falls back to the first enabled step.",
      "When no enabled steps exist, no step is current and every step is disabled.",
    ],
    usage: "Use GridraStepper for multi-step workflows such as checkout flows, setup wizards, or form progress indicators. Manage step content separately by switching panels based on currentId changes. Clickable completed steps let users jump back to review or correct previous steps.",
    avoid: "GridraStepper v1 does not manage step content panels and does not allow direct navigation to pending steps. Do not use it for branching or non-linear flows. Skipped, error, and custom icon states are not supported in this version.",
    compositions: [
      "GridraStepper + panel switching: manage step content via currentId.",
      "GridraStepper + GridraBox/GridraStack: layout form sections per step.",
    ],
    examples: [
      {
        title: "Basic uncontrolled stepper",
        code: `<GridraStepper
  items={[
    { id: "cart", label: "Cart", description: "Review your items" },
    { id: "shipping", label: "Shipping", description: "Enter your address" },
    { id: "payment", label: "Payment", description: "Choose payment method" },
    { id: "confirm", label: "Confirm", description: "Place your order" },
  ]}
  defaultCurrentId="shipping"
  onStepChange={(next, prev) => console.log(next, prev)}
/>`,
      },
      {
        title: "Controlled stepper with content switching",
        code: `const [currentId, setCurrentId] = useState("cart");

<GridraStepper
  items={items}
  currentId={currentId}
  onStepChange={(next) => setCurrentId(next)}
/>

{currentId === "cart" && <CartForm onComplete={() => setCurrentId("shipping")} />}
{currentId === "shipping" && <ShippingForm onComplete={() => setCurrentId("payment")} />}
{currentId === "payment" && <PaymentForm onComplete={() => setCurrentId("confirm")} />}
{currentId === "confirm" && <Confirmation />}`,
      },
      {
        title: "Vertical stepper with disabled steps",
        code: `<GridraStepper
  items={[
    { id: "a", label: "Account setup" },
    { id: "b", label: "Profile details" },
    { id: "c", label: "Preferences", disabled: true, description: "Coming soon" },
    { id: "d", label: "Review" },
  ]}
  defaultCurrentId="a"
  orientation="vertical"
  size="lg"
/>`,
      },
    ],
    preview: (
      <GridraBox padding="md">
        <GridraStack gap="lg">
          <GridraStepper
            items={[
              { id: "cart", label: "Cart", description: "2 items" },
              { id: "shipping", label: "Shipping", description: "Tokyo, Japan" },
              { id: "payment", label: "Payment" },
              { id: "confirm", label: "Confirm" },
            ]}
            defaultCurrentId="payment"
          />
          <GridraStepper
            items={[
              { id: "account", label: "Account", description: "Create workspace" },
              { id: "profile", label: "Profile", description: "Team details" },
              { id: "preferences", label: "Preferences", description: "Optional" },
              { id: "review", label: "Review" },
            ]}
            defaultCurrentId="profile"
            orientation="vertical"
            size="sm"
          />
        </GridraStack>
      </GridraBox>
    ),
    accessibility:
      "Root element is a nav with aria-label='Progress'. Steps are rendered as an ordered list (ol > li). Each step is a button. The current step has aria-current='step'. Completed steps are clickable buttons; pending and disabled steps have disabled and aria-disabled='true'. Connectors between steps have aria-hidden='true'. Unknown, empty, or disabled currentId gracefully falls back to the first enabled step.",
  };
