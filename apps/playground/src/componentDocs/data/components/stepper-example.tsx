import { useState } from "react";
import { GridraButton, GridraStepper } from "@gridra-ui/react";
import type { GridraStepperItem, GridraStepperVariant } from "@gridra-ui/react";

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

function nextEnabledStep(items: GridraStepperItem[], currentId: string) {
  return items.slice(items.findIndex((item) => item.id === currentId) + 1)
    .find((item) => !item.disabled)?.id;
}

export function StepperExample({ variant }: { variant: GridraStepperVariant }) {
  const [checkoutId, setCheckoutId] = useState("payment");
  const [setupId, setSetupId] = useState("profile");
  const nextCheckoutId = nextEnabledStep(checkoutSteps, checkoutId);
  const nextSetupId = nextEnabledStep(setupSteps, setupId);
  return <div style={{ display: "grid", gap: 44, width: "100%", minWidth: 0, padding: 8 }}>
    <GridraStepper aria-label={`${variant} checkout steps`} variant={variant} items={checkoutSteps}
      currentId={checkoutId} onStepChange={setCheckoutId} />
    <GridraStepper aria-label={`${variant} setup steps`} variant={variant} items={setupSteps}
      orientation="vertical" currentId={setupId} onStepChange={setSetupId}
      style={{ width: "min(100%, 400px)" }} />
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: 8 }}>
      <GridraButton size="sm" disabled={!nextCheckoutId}
        onClick={() => nextCheckoutId && setCheckoutId(nextCheckoutId)}>Next checkout step</GridraButton>
      <GridraButton size="sm" disabled={!nextSetupId}
        onClick={() => nextSetupId && setSetupId(nextSetupId)}>Next setup step</GridraButton>
      <GridraButton size="sm" variant="ghost" onClick={() => {
        setCheckoutId("payment");
        setSetupId("profile");
      }}>Reset steps</GridraButton>
    </div>
  </div>;
}
