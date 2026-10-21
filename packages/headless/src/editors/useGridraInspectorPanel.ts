import { useId, type ReactNode } from "react";

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

function isValidNumber(value: string): boolean {
  const n = Number(value);

  return value.trim() !== "" && !Number.isNaN(n) && Number.isFinite(n);
}

export interface UseGridraInspectorPanelOptions {
  selectedNode?: GridraInspectorValue | null;
  disabled?: boolean;
  onChange?: (patch: GridraInspectorPatch) => void;
  onCommit?: () => void;
}

/** 選択ノードの編集を検証し、controlledなpatchだけを通知する。 */
export function useGridraInspectorPanel({
  selectedNode,
  disabled = false,
  onChange,
  onCommit,
}: UseGridraInspectorPanelOptions = {}) {
  const fieldId = useId();
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

  const commit = () => {
    if (!disabled && hasSelection) onCommit?.();
  };

  return {
    fieldId,
    hasSelection,
    handleLabelChange,
    handlePlacementChange,
    commit,
  };
}
