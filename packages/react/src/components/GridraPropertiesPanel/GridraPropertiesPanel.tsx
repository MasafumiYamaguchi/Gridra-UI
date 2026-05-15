import type { HTMLAttributes, ReactNode } from "react";
import { GridraField } from "../GridraField";
import { GridraInput } from "../GridraInput";
import { GridraPanel } from "../GridraPanel";
import { GridraSelect } from "../GridraSelect";
import { GridraSwitch } from "../GridraSwitch";

export interface GridraPropertyFieldSchema {
  id: string;
  label: string;
  kind: "text" | "number" | "select" | "toggle";
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

export type GridraNodePropertiesSchema = Record<
  string,
  GridraPropertyFieldSchema[]
>;

export type GridraNodePropertiesValue = Record<
  string,
  string | number | boolean
>;

export type GridraPropertiesPatch = Partial<GridraNodePropertiesValue>;

export interface GridraPropertiesPanelProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  selectedNodeId?: string | null;
  selectedNodeType?: string | null;
  value?: GridraNodePropertiesValue;
  schema?: GridraNodePropertiesSchema;
  onChange?: (patch: GridraPropertiesPatch) => void;
  disabled?: boolean;
}

export function GridraPropertiesPanel({
  className,
  disabled = false,
  onChange,
  schema,
  selectedNodeId,
  selectedNodeType,
  value,
  ...props
}: GridraPropertiesPanelProps) {
  const hasSelection =
    selectedNodeId != null &&
    selectedNodeType != null &&
    schema != null &&
    value != null;

  const fields = hasSelection ? schema[selectedNodeType] : undefined;
  const hasFields = fields != null && fields.length > 0;

  const handleChange = (fieldId: string, nextValue: string | number | boolean) => {
    if (disabled || !hasSelection) {
      return;
    }
    onChange?.({ [fieldId]: nextValue });
  };

  return (
    <GridraPanel
      className={["gridra-properties-panel", className].filter(Boolean).join(" ")}
      heading="Properties"
      {...props}
    >
      {hasSelection && hasFields ? (
        <div className="gridra-properties-panel__fields">
          {fields.map((field) => {
            const fieldValue = value[field.id];

            if (field.kind === "text") {
              return (
                <GridraField key={field.id} label={field.label}>
                  <GridraInput
                    data-testid={`property-${field.id}`}
                    disabled={disabled}
                    onChange={(event) =>
                      handleChange(field.id, event.target.value)
                    }
                    type="text"
                    value={String(fieldValue ?? "")}
                  />
                </GridraField>
              );
            }

            if (field.kind === "number") {
              return (
                <GridraField key={field.id} label={field.label}>
                  <GridraInput
                    data-testid={`property-${field.id}`}
                    disabled={disabled}
                    max={field.max}
                    min={field.min}
                    onChange={(event) => {
                      const raw = event.target.value;
                      if (raw.trim() === "" || Number.isNaN(Number(raw))) {
                        return;
                      }
                      handleChange(field.id, Number(raw));
                    }}
                    step={field.step}
                    type="number"
                    value={typeof fieldValue === "number" ? fieldValue : ""}
                  />
                </GridraField>
              );
            }

            if (field.kind === "select") {
              return (
                <GridraField key={field.id} label={field.label}>
                  <GridraSelect
                    data-testid={`property-${field.id}`}
                    disabled={disabled}
                    onChange={(event) =>
                      handleChange(field.id, event.target.value)
                    }
                    value={String(fieldValue ?? "")}
                  >
                    {(field.options ?? []).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </GridraSelect>
                </GridraField>
              );
            }

            if (field.kind === "toggle") {
              return (
                <GridraField key={field.id} label={field.label}>
                  <GridraSwitch
                    checked={Boolean(fieldValue)}
                    data-testid={`property-${field.id}`}
                    disabled={disabled}
                    onCheckedChange={(checked) =>
                      handleChange(field.id, checked)
                    }
                  />
                </GridraField>
              );
            }

            // Unknown kind: skip for forward compatibility
            return null;
          })}
        </div>
      ) : (
        <div className="gridra-properties-panel__empty">
          <span className="gridra-properties-panel__empty-text">
            No properties available
          </span>
        </div>
      )}
    </GridraPanel>
  );
}
