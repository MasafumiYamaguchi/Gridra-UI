import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  GridraButton,
  GridraCanvasArea,
  GridraField,
  GridraGrid,
  GridraInput,
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
  const [gridColumns, setGridColumns] = useState(12);
  const [gridRows, setGridRows] = useState(6);
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
        placement: { column: 8, row: 1, columnSpan: 4, rowSpan: 2 }
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
            <GridraButton
              onClick={() =>
                setTheme((current) =>
                  current === "gridra-theme-dark" ? "gridra-theme-light" : "gridra-theme-dark"
                )
              }
              variant="ghost"
            >
              Theme
            </GridraButton>
          }
        >
          <div className="playground-grid-controls">
            <GridraField htmlFor="playground-grid-columns" label="Columns">
              <GridraInput
                id="playground-grid-columns"
                min={1}
                onChange={(event) => setGridColumns(Number(event.target.value))}
                type="number"
                value={gridColumns}
              />
            </GridraField>
            <GridraField htmlFor="playground-grid-rows" label="Rows">
              <GridraInput
                id="playground-grid-rows"
                min={1}
                onChange={(event) => setGridRows(Number(event.target.value))}
                type="number"
                value={gridRows}
              />
            </GridraField>
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
