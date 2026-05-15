import type { HTMLAttributes, ReactNode } from "react";
import { GridraField } from "../GridraField";
import { GridraInput } from "../GridraInput";
import { GridraPanel } from "../GridraPanel";

export interface GridraInspectorPlacement {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface GridraInspectorValue {
  id: string;
  label?: ReactNode;
  placement: GridraInspectorPlacement;
}

export type GridraInspectorPatch = Partial<{
  label: ReactNode;
  placement: Partial<GridraInspectorPlacement>;
}>;

export interface GridraInspectorPanelProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  selectedNode?: GridraInspectorValue | null;
  onChange?: (patch: GridraInspectorPatch) => void;
  onCommit?: () => void;
  disabled?: boolean;
}

function isValidNumber(value: string): boolean {
  return value.trim() !== "" && !Number.isNaN(Number(value));
}

export function GridraInspectorPanel({
  className,
  disabled = false,
  onChange,
  onCommit,
  selectedNode,
  ...props
}: GridraInspectorPanelProps) {
  const hasSelection = selectedNode != null;

  const handleLabelChange = (value: string) => {
    if (disabled || !hasSelection) {
      return;
    }
    onChange?.({ label: value });
  };

  const handlePlacementChange = (
    key: keyof GridraInspectorPlacement,
    value: string,
  ) => {
    if (disabled || !hasSelection) {
      return;
    }

    if (!isValidNumber(value)) {
      return;
    }

    onChange?.({ placement: { [key]: Number(value) } });
  };

  return (
    <GridraPanel
      className={["gridra-inspector-panel", className].filter(Boolean).join(" ")}
      heading="Inspector"
      {...props}
    >
      {hasSelection ? (
        <div className="gridra-inspector-panel__fields">
          <GridraField label="Label">
            <GridraInput
              data-testid="inspector-label"
              disabled={disabled}
              onChange={(event) => handleLabelChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onCommit?.();
                }
              }}
              type="text"
              value={String(selectedNode.label ?? "")}
            />
          </GridraField>
          <GridraField label="X">
            <GridraInput
              data-testid="inspector-x"
              disabled={disabled}
              onChange={(event) =>
                handlePlacementChange("x", event.target.value)
              }
              type="number"
              value={selectedNode.placement.x}
            />
          </GridraField>
          <GridraField label="Y">
            <GridraInput
              data-testid="inspector-y"
              disabled={disabled}
              onChange={(event) =>
                handlePlacementChange("y", event.target.value)
              }
              type="number"
              value={selectedNode.placement.y}
            />
          </GridraField>
          <GridraField label="W">
            <GridraInput
              data-testid="inspector-w"
              disabled={disabled}
              onChange={(event) =>
                handlePlacementChange("w", event.target.value)
              }
              type="number"
              value={selectedNode.placement.w}
            />
          </GridraField>
          <GridraField label="H">
            <GridraInput
              data-testid="inspector-h"
              disabled={disabled}
              onChange={(event) =>
                handlePlacementChange("h", event.target.value)
              }
              type="number"
              value={selectedNode.placement.h}
            />
          </GridraField>
        </div>
      ) : (
        <div className="gridra-inspector-panel__empty">
          <span className="gridra-inspector-panel__empty-text">
            No node selected
          </span>
        </div>
      )}
    </GridraPanel>
  );
}
