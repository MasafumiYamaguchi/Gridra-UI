import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  GridraCanvasArea,
  GridraGrid,
  GridraPanel,
  GridraRoot,
  GridraToolbar
} from "@gridra-ui/react";
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/dark.css";
import "./styles.css";

function Playground() {
  const [theme, setTheme] = useState<"gridra-theme-light" | "gridra-theme-dark">("gridra-theme-dark");
  const [selectedId, setSelectedId] = useState<string | null>("node-input");
  const [gridColumns, setGridColumns] = useState(24);
  const [gridRows, setGridRows] = useState(16);
  const nodes = useMemo(
    () => [
      {
        id: "node-input",
        label: "Input",
        placement: { column: 2, row: 2, columnSpan: 4, rowSpan: 2 }
      },
      {
        id: "node-transform",
        label: "Transform",
        placement: { column: 8, row: 5, columnSpan: 5, rowSpan: 2 }
      },
      {
        id: "node-output",
        label: "Output",
        placement: { column: 16, row: 3, columnSpan: 4, rowSpan: 2 }
      }
    ],
    []
  );
  const items = nodes.map((node) => ({ id: node.id, label: node.label }));

  return (
    <GridraRoot
      className={theme}
      panel={
        <GridraPanel
          heading="GRIDRA"
          header={
            <button
              className="playground-toggle"
              onClick={() =>
                setTheme((current) =>
                  current === "gridra-theme-dark" ? "gridra-theme-light" : "gridra-theme-dark"
                )
              }
              type="button"
            >
              Theme
            </button>
          }
        >
          <div className="playground-grid-controls">
            <label className="playground-grid-control">
              Columns
              <input
                min={1}
                onChange={(event) => setGridColumns(Number(event.target.value))}
                type="number"
                value={gridColumns}
              />
            </label>
            <label className="playground-grid-control">
              Rows
              <input
                min={1}
                onChange={(event) => setGridRows(Number(event.target.value))}
                type="number"
                value={gridRows}
              />
            </label>
          </div>
          <GridraGrid
            columns={1}
            items={items}
            onSelectionChange={setSelectedId}
            selectedId={selectedId}
          />
        </GridraPanel>
      }
    >
      <GridraToolbar
        actions={[
          { id: "select", label: "Select", pressed: true },
          { id: "pan", label: "Pan" },
          { id: "inspect", label: "Inspect" }
        ]}
      />
      <GridraCanvasArea
        gridColumns={gridColumns}
        gridRows={gridRows}
        nodes={nodes}
        onSelectionChange={setSelectedId}
        selectedId={selectedId}
      />
    </GridraRoot>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Playground />
  </StrictMode>
);
