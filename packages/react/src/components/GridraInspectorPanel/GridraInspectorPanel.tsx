import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../internal/classNames";
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

// HTML属性とぶつかるため、HTMLAttributesからonChangeを除外して独自定義する
// onChangeとonCommitに?オプションがついているのは、表示のみのときにonChangeやonCommitを指定しない場合があるため
export interface GridraInspectorPanelProps
  extends Omit<HTMLAttributes<HTMLElement>, "onChange"> {
  selectedNode?: GridraInspectorValue | null;
  onChange?: (patch: GridraInspectorPatch) => void;
  onCommit?: () => void;
  disabled?: boolean;
}

function isValidNumber(value: string): boolean {
  const n = Number(value);
  return value.trim() !== "" && !Number.isNaN(n) && Number.isFinite(n);
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

  // 設定がdisabledまたは選択されていない場合は、onChangeを呼び出さない
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

  // 以下data-testid属性は、テストで使用するためのものであり、UI上では表示されない
  return (
    <GridraPanel
      className={cx("gridra-inspector-panel", className)}
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
