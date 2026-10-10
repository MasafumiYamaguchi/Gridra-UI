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

export function connectionsEqual(first: GridraNodeConnection, second: GridraNodeConnection): boolean {
  return first.sourceId === second.sourceId && first.targetId === second.targetId;
}

export function hasConnection(connections: GridraNodeConnection[], next: GridraNodeConnection): boolean {
  return connections.some((connection) => connectionsEqual(connection, next));
}

export function getConnectionKey(connection: GridraNodeConnection): string {
  return JSON.stringify([connection.sourceId, connection.targetId]);
}
