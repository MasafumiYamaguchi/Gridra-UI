import {useGridraInspectorPanel} from "@gridra-ui/headless";
import { useId, type HTMLAttributes, type ReactNode } from "react";
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

export function GridraInspectorPanel({
  className,
  disabled = false,
  onChange,
  onCommit,
  selectedNode,
  ...props
}: GridraInspectorPanelProps) {
  const {fieldId,hasSelection,handleLabelChange,handlePlacementChange,commit}=useGridraInspectorPanel({selectedNode,disabled,onChange,onCommit});

  // 以下data-testid属性は、テストで使用するためのものであり、UI上では表示されない
  return (
    <GridraPanel
      className={cx("gridra-inspector-panel", className)}
      heading="Inspector"
      {...props}
    >
      {hasSelection ? (
        <div className="gridra-inspector-panel__fields">
          <GridraField htmlFor={`${fieldId}-label`} label="Label">
            <GridraInput
              data-testid="inspector-label"
              id={`${fieldId}-label`}
              disabled={disabled}
              onChange={(event) => handleLabelChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  commit();
                }
              }}
              type="text"
              value={String(selectedNode!.label ?? "")}
            />
          </GridraField>
          <GridraField htmlFor={`${fieldId}-x`} label="X">
            <GridraInput
              data-testid="inspector-x"
              id={`${fieldId}-x`}
              disabled={disabled}
              onChange={(event) =>
                handlePlacementChange("x", event.target.value)
              }
              type="number"
              value={selectedNode!.placement.x}
            />
          </GridraField>
          <GridraField htmlFor={`${fieldId}-y`} label="Y">
            <GridraInput
              data-testid="inspector-y"
              id={`${fieldId}-y`}
              disabled={disabled}
              onChange={(event) =>
                handlePlacementChange("y", event.target.value)
              }
              type="number"
              value={selectedNode!.placement.y}
            />
          </GridraField>
          <GridraField htmlFor={`${fieldId}-w`} label="W">
            <GridraInput
              data-testid="inspector-w"
              id={`${fieldId}-w`}
              disabled={disabled}
              onChange={(event) =>
                handlePlacementChange("w", event.target.value)
              }
              type="number"
              value={selectedNode!.placement.w}
            />
          </GridraField>
          <GridraField htmlFor={`${fieldId}-h`} label="H">
            <GridraInput
              data-testid="inspector-h"
              id={`${fieldId}-h`}
              disabled={disabled}
              onChange={(event) =>
                handlePlacementChange("h", event.target.value)
              }
              type="number"
              value={selectedNode!.placement.h}
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
