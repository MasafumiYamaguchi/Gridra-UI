import type { GridraSelectionMode } from "./types";
import type { GridraId } from "@gridra-ui/core";
import type { PointerEvent } from "react";

export function getSelectionMode(
  event: PointerEvent<HTMLDivElement>,
  fallbackMode: GridraSelectionMode,
  modifierKeys?: { additive?: "Shift"; toggle?: "Meta" | "Control" },
): GridraSelectionMode {
  if (modifierKeys?.additive === "Shift" && event.shiftKey) {
    return "additive";
  }

  if (modifierKeys?.toggle === "Meta" && event.metaKey) {
    return "toggle";
  }

  if (modifierKeys?.toggle === "Control" && event.ctrlKey) {
    return "toggle";
  }

  return fallbackMode;
}

export function mergeSelectedIds(
  mode: GridraSelectionMode,
  currentSelectedIds: GridraId[],
  hitSelectedIds: GridraId[],
): GridraId[] {
  if (mode === "replace") {
    return hitSelectedIds;
  }

  const currentSet = new Set(currentSelectedIds);

  if (mode === "additive") {
    return Array.from(new Set([...currentSelectedIds, ...hitSelectedIds]));
  }

  hitSelectedIds.forEach((id) => {
    if (currentSet.has(id)) {
      currentSet.delete(id);
    } else {
      currentSet.add(id);
    }
  });

  return currentSelectedIds
    .filter((id) => currentSet.has(id))
    .concat(
      hitSelectedIds.filter(
        (id) => currentSet.has(id) && !currentSelectedIds.includes(id),
      ),
    );
}
