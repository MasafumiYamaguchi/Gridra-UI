import { useId } from "react";
import { isFiniteNumber } from "../internal/number";

export interface GridraPropertyFieldSchema {
  id: string;
  label: string;
  kind: "text" | "number" | "select" | "toggle";
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
}

// ノード種別をキーに、その種別で表示するフィールド一覧を引けるようにする。
export type GridraNodePropertiesSchema = Record<
  string,
  GridraPropertyFieldSchema[]
>;

export type GridraNodePropertiesValue = Record<
  string,
  string | number | boolean
>;

export type GridraPropertiesPatch = Partial<GridraNodePropertiesValue>;

function formatNumberValue(value: unknown): number | "" {
  // 不正な値はinputへNaNを渡さず、未入力として表示する。
  return isFiniteNumber(value) ? value : "";
}

export interface UseGridraPropertiesPanelOptions {
  selectedNodeId?: string | null;
  selectedNodeType?: string | null;
  value?: GridraNodePropertiesValue;
  schema?: GridraNodePropertiesSchema;
  onChange?: (patch: GridraPropertiesPatch) => void;
  disabled?: boolean;
}

/** schemaと選択情報から編集可能なプロパティとpatch操作を返す。 */
export function useGridraPropertiesPanel({
  selectedNodeId,
  selectedNodeType,
  value,
  schema,
  onChange,
  disabled = false,
}: UseGridraPropertiesPanelOptions = {}) {
  const fieldId = useId();
  // 選択対象・型・schema・現在値が揃った場合だけ編集可能な状態とみなす。
  const hasSelection =
    selectedNodeId != null &&
    selectedNodeType != null &&
    schema != null &&
    value != null;

  // 選択がない・種別に対応するschemaがない場合は空配列にして、呼び出し側で非nullを保証する。
  const fields = hasSelection ? (schema[selectedNodeType] ?? []) : [];
  const hasFields = fields.length > 0;

  const handleChange = (
    id: string,
    nextValue: string | number | boolean,
  ) => {
    // 無効状態や選択情報が不足している場合は、patchを外部へ通知しない。
    if (disabled || !hasSelection) {
      return;
    }

    onChange?.({ [id]: nextValue });
  };

  const changeNumber = (id: string, raw: string) => {
    const parsed = Number(raw);

    // 空文字はNumber("")が0になるため、数値として扱わず除外する。
    if (raw.trim() === "" || !isFiniteNumber(parsed)) return;

    handleChange(id, parsed);
  };

  const getNumberFieldValue = (field: GridraPropertyFieldSchema) =>
    formatNumberValue(value?.[field.id]);

  const getFieldValue = (field: GridraPropertyFieldSchema) => {
    const current = value?.[field.id];

    return field.kind === "number"
      ? getNumberFieldValue(field)
      : field.kind === "toggle"
        ? Boolean(current)
        : String(current ?? "");
  };

  return {
    fieldId,
    hasSelection,
    fields,
    hasFields,
    handleChange,
    changeNumber,
    getFieldValue,
    getNumberFieldValue,
  };
}
