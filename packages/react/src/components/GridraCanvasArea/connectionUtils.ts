import type { GridraNodeConnection } from "./types";

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
