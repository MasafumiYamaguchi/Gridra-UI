import { useId, type ReactNode } from "react";
import { isValidNumber } from "../internal/number";

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
  // 未選択はnullに統一し、利用側が型ガードとして使えるよう絞り込んだ値を返す。
  const node = selectedNode ?? null;
  const hasSelection = node != null;

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
    selectedNode: node,
    handleLabelChange,
    handlePlacementChange,
    commit,
  };
}
