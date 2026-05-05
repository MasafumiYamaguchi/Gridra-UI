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
  const nodes = useMemo(
    () => [
      { id: "node-input", label: "Input", position: { x: 64, y: 72 } },
      { id: "node-transform", label: "Transform", position: { x: 280, y: 160 } },
      { id: "node-output", label: "Output", position: { x: 520, y: 92 } }
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
