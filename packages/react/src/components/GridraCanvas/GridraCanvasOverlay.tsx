import { GridraSelectionBox } from "../GridraSelectionBox";
import { GridraSnapGuide } from "../GridraSnapGuide";
import { cx } from "../../internal/classNames";
import type { GridraCanvasOverlayProps } from "./types";

/** 描画だけを担当し、座標と接続選択のイベント処理はHookから受け取る。 */
export function GridraCanvasOverlay({
  width, height, segments, previewPath, selectionRect, snapGuides, gridLines = [],
  onConnectionSelect, className, style, ...props
}: GridraCanvasOverlayProps) {
  return (
    <div {...props} className={cx("gridra-canvas-overlay", className)}
      style={{ ...style, width, height }}>
      {gridLines.map((line) => (
        <GridraSnapGuide {...line} className="gridra-canvas-grid-line"
          key={`${line.orientation}:${line.position}`} />
      ))}
      {(segments.length > 0 || previewPath) && width > 0 && height > 0 ? (
        <svg className="gridra-connection-layer" aria-hidden="true"
          width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {segments.map((segment) => (
            <path key={JSON.stringify([segment.connection.sourceId, segment.connection.targetId])}
              className={cx("gridra-connection-line", segment.selected && "gridra-connection-line--selected")}
              d={segment.path}
              data-gridra-connection-source-id={segment.connection.sourceId}
              data-gridra-connection-target-id={segment.connection.targetId}
              onClick={(event) => {
                event.stopPropagation();
                onConnectionSelect?.(segment.connection);
              }} />
          ))}
          {previewPath ? <path className="gridra-connection-line gridra-connection-line--preview" d={previewPath} /> : null}
        </svg>
      ) : null}
      <GridraSelectionBox rect={selectionRect} />
      {snapGuides.map((guide) => (
        <GridraSnapGuide {...guide}
          key={`${guide.orientation}:${guide.position}:${guide.start}:${guide.end}`} />
      ))}
    </div>
  );
}
