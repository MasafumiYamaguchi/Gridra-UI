import type { GridraConnectionHandleKind } from "../GridraConnectionHandle";
import type { GridraId } from "@gridra-ui/core";
import type { GridraNodeConnection } from "./types";

export function createNodeConnection(
  originId: GridraId,
  originKind: GridraConnectionHandleKind,
  targetId: GridraId,
  targetKind: GridraConnectionHandleKind,
): GridraNodeConnection | null {
  if (originId === targetId || originKind === targetKind) {
    return null;
  }

  if (originKind === "output" && targetKind === "input") {
    return { sourceId: originId, targetId };
  }

  return { sourceId: targetId, targetId: originId };
}

export function hasConnection(
  connections: GridraNodeConnection[],
  nextConnection: GridraNodeConnection,
): boolean {
  return connections.some(
    (connection) =>
      connection.sourceId === nextConnection.sourceId &&
      connection.targetId === nextConnection.targetId,
  );
}

export function getConnectionKey(connection: GridraNodeConnection): string {
  return `${connection.sourceId}->${connection.targetId}`;
}
