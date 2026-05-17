import type { GridraId, GridraPoint } from "@gridra-ui/core";
import { getConnectionKey } from "./connectionUtils";
import { getConnectionPath, getConnectionPoint, getPreviewConnectionPath } from "./geometry";
import type {
  GridraCanvasNode,
  GridraConnectionSegment,
  GridraNodeConnection,
} from "./types";

export function GridraConnectionLayer<TNode extends GridraCanvasNode>({
  connections,
  gridColumns,
  gridRows,
  nodes,
  onConnectionSelect,
  previewConnection,
  selectedConnectionKeys,
}: {
  connections: GridraNodeConnection[];
  gridColumns: number;
  gridRows: number;
  nodes: TNode[];
  onConnectionSelect: (connection: GridraNodeConnection) => void;
  previewConnection?: {
    sourceId: GridraId;
    originKind: "input" | "output";
    currentGridPoint: GridraPoint;
  };
  selectedConnectionKeys: string[];
}) {
  const segments = getConnectionSegments(connections, nodes, gridColumns, gridRows);
  const selectedKeySet = new Set(selectedConnectionKeys);
  let previewPath: string | null = null;

  if (previewConnection) {
    const sourceNode = nodes.find((n) => n.id === previewConnection.sourceId);

    if (sourceNode) {
      const sourcePoint = getConnectionPoint(
        sourceNode.placement,
        previewConnection.originKind === "output" ? "output" : "input",
        gridColumns,
        gridRows,
      );
      const targetPoint = previewConnection.currentGridPoint;

      if (previewConnection.originKind === "output") {
        previewPath = getPreviewConnectionPath(sourcePoint, targetPoint, gridColumns);
      } else {
        previewPath = getPreviewConnectionPath(targetPoint, sourcePoint, gridColumns);
      }
    }
  }

  if (segments.length === 0 && previewPath === null) {
    return null;
  }

  return (
    <svg
      aria-hidden="true"
      className="gridra-connection-layer"
      preserveAspectRatio="none"
      viewBox={`0 0 ${gridColumns} ${gridRows}`}
    >
      {segments.map((segment, index) => (
        <path
          className={[
            "gridra-connection-line",
            selectedKeySet.has(getConnectionKey(segment.connection))
              ? "gridra-connection-line--selected"
              : null,
          ]
            .filter(Boolean)
            .join(" ")}
          d={segment.path}
          data-gridra-connection-source-id={segment.connection.sourceId}
          data-gridra-connection-target-id={segment.connection.targetId}
          key={`${segment.connection.sourceId}:${segment.connection.targetId}:${index}`}
          onClick={(event) => {
            event.stopPropagation();
            onConnectionSelect(segment.connection);
          }}
        />
      ))}
      {previewPath && (
        <path
          className="gridra-connection-line gridra-connection-line--preview"
          d={previewPath}
        />
      )}
    </svg>
  );
}

function getConnectionSegments<TNode extends GridraCanvasNode>(
  connections: GridraNodeConnection[],
  nodes: TNode[],
  gridColumns: number,
  gridRows: number,
): GridraConnectionSegment[] {
  return connections.flatMap((connection) => {
    const source = nodes.find((node) => node.id === connection.sourceId);
    const target = nodes.find((node) => node.id === connection.targetId);

    if (!source || !target) {
      return [];
    }

    return [
      {
        connection,
        path: getConnectionPath(
          source.placement,
          target.placement,
          gridColumns,
          gridRows,
        ),
      },
    ];
  });
}
