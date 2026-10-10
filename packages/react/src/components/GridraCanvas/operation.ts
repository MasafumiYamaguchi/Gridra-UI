import type { GridraId, GridraPoint } from "@gridra-ui/core";
import type { GridraNodePlacement } from "../GridraNode";
import type { GridraConnectionHandleKind } from "../GridraConnectionHandle";

type PointerState = { pointerId: number; origin: GridraPoint; point: GridraPoint };
export type Operation = PointerState & (
  | { type: "range" }
  | { type: "drag" | "resize"; id: GridraId; placement: GridraNodePlacement }
  | { type: "connect"; id: GridraId; kind: GridraConnectionHandleKind }
);

export type OperationRequest =
  | { type: "range" }
  | { type: "drag" | "resize"; id: GridraId }
  | { type: "connect"; id: GridraId; kind: GridraConnectionHandleKind };
