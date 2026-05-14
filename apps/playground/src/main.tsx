import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  GridraAvatar,
  GridraBadge,
  GridraButton,
  GridraCanvasArea,
  GridraCheckbox,
  GridraDivider,
  GridraField,
  GridraIconButton,
  GridraSelectableGrid,
  GridraInput,
  GridraLabel,
  GridraNode,
  type GridraNodeConnection,
  type GridraNodePlacements,
  GridraPanel,
  GridraRadio,
  GridraRoot,
  GridraSelect,
  GridraSlider,
  GridraSpinner,
  GridraSwitch,
  GridraTextarea,
  GridraToolbar
} from "@gridra-ui/react";
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/dark.css";
import { ComponentDocsPage } from "./componentDocs";
import "./styles.css";

const isDocsRoute = window.location.pathname === "/docs";

function Playground() {
  const avatarImageUrl = "https://i.pravatar.cc/96?img=12";
  const [theme, setTheme] = useState<"gridra-theme-light" | "gridra-theme-dark">("gridra-theme-dark");
  const [viewMode, setViewMode] = useState<"canvas" | "components">("canvas");
  const [selectedId, setSelectedId] = useState<string | null>("node-input");
  const [selectedIds, setSelectedIds] = useState<string[]>(["node-input"]);
  const [selectionPreviewVisible, setSelectionPreviewVisible] = useState(true);
  const [nodeConnectingEnabled, setNodeConnectingEnabled] = useState(true);
  const [nodeDraggingEnabled, setNodeDraggingEnabled] = useState(true);
  const [nodeResizingEnabled, setNodeResizingEnabled] = useState(true);
  const [controlDensity, setControlDensity] = useState<"compact" | "comfortable">("compact");
  const [controlNotes, setControlNotes] = useState("Dense controls for node editing.");
  const [controlOpacity, setControlOpacity] = useState(72);
  const [controlPreviewEnabled, setControlPreviewEnabled] = useState(true);
  const [controlSnapEnabled, setControlSnapEnabled] = useState(true);
  const [iconPreviewPressed, setIconPreviewPressed] = useState(false);
  const [nodeConnections, setNodeConnections] = useState<GridraNodeConnection[]>([
    { sourceId: "node-input", targetId: "node-transform" },
    { sourceId: "node-transform", targetId: "node-output" }
  ]);
  const [nodePlacements, setNodePlacements] = useState<GridraNodePlacements>({});
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
          <div className="playground-panel-section">
            <div className="playground-section-heading">
              <GridraLabel>Canvas</GridraLabel>
              <GridraBadge tone="muted">{gridColumns} x {gridRows}</GridraBadge>
            </div>
            <GridraField htmlFor="playground-selected-node" label="Selected Node">
              <GridraSelect
                id="playground-selected-node"
                onChange={(event) => {
                  setSelectedId(event.target.value);
                  setSelectedIds([event.target.value]);
                }}
                value={selectedId ?? ""}
              >
                {nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </GridraSelect>
            </GridraField>
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
          <GridraDivider />
          <GridraSelectableGrid
            columns={1}
            items={items}
            onSelectionChange={(nextSelectedId) => {
              setSelectedId(nextSelectedId);
              setSelectedIds(nextSelectedId ? [nextSelectedId] : []);
            }}
            selectedId={selectedId}
          />
        </GridraPanel>
      }
    >
      <GridraToolbar
        actions={[
          { id: "select", label: "Select", pressed: true },
          { id: "selection-box", label: "Box", pressed: selectionPreviewVisible },
          { id: "connect", label: "Connect", pressed: nodeConnectingEnabled },
          { id: "drag", label: "Drag", pressed: nodeDraggingEnabled },
          { id: "resize", label: "Resize", pressed: nodeResizingEnabled },
          { id: "components", label: "Components", pressed: viewMode === "components" },
          { id: "docs", label: "Docs" },
          { id: "pan", label: "Pan" },
          { id: "inspect", label: "Inspect" }
        ]}
        onAction={(id) => {
          if (id === "select") {
            setViewMode("canvas");
          }
          if (id === "selection-box") {
            setSelectionPreviewVisible((current) => !current);
          }
          if (id === "connect") {
            setNodeConnectingEnabled((current) => !current);
          }
          if (id === "drag") {
            setNodeDraggingEnabled((current) => !current);
          }
          if (id === "resize") {
            setNodeResizingEnabled((current) => !current);
          }
          if (id === "components") {
            setViewMode((current) => (current === "components" ? "canvas" : "components"));
          }
          if (id === "docs") {
            window.location.href = "/docs";
          }
        }}
      />
      {viewMode === "components" ? (
        <section className="playground-component-stage">
          <div className="playground-component-header">
            <div>
              <GridraLabel>Basic Controls</GridraLabel>
              <h1 className="playground-component-title">Component Check Surface</h1>
            </div>
            <div className="playground-status-row">
              <GridraAvatar alt="Demo avatar" fallback="UI" shape="circle" size="md" src={avatarImageUrl} />
              <GridraBadge tone="accent">{controlOpacity}%</GridraBadge>
              {controlPreviewEnabled ? <GridraSpinner label="Preview running" /> : null}
            </div>
          </div>
          <div className="playground-component-grid">
            <section className="playground-component-group">
              <div className="playground-section-heading">
                <GridraLabel>Actions</GridraLabel>
                <GridraBadge tone="muted">Button family</GridraBadge>
              </div>
              <div className="playground-control-row">
                <GridraButton variant="primary">Primary</GridraButton>
                <GridraButton>Default</GridraButton>
                <GridraButton variant="ghost">Ghost</GridraButton>
                <GridraIconButton
                  label="Toggle preview"
                  onClick={() => setIconPreviewPressed((current) => !current)}
                  pressed={iconPreviewPressed}
                >
                  P
                </GridraIconButton>
                <GridraIconButton label="Add item" variant="ghost">
                  +
                </GridraIconButton>
              </div>
            </section>
            <section className="playground-component-group">
              <div className="playground-section-heading">
                <GridraLabel>Boolean</GridraLabel>
                <GridraBadge>{controlPreviewEnabled ? "active" : "idle"}</GridraBadge>
              </div>
              <div className="playground-control-row">
                <GridraCheckbox
                  checked={controlSnapEnabled}
                  label="Snap"
                  onChange={(event) => setControlSnapEnabled(event.target.checked)}
                />
                <GridraSwitch
                  checked={controlPreviewEnabled}
                  label="Preview"
                  onClick={() => setControlPreviewEnabled((current) => !current)}
                />
              </div>
            </section>
            <section className="playground-component-group">
              <div className="playground-section-heading">
                <GridraLabel>Choice</GridraLabel>
                <GridraBadge>{controlDensity}</GridraBadge>
              </div>
              <div className="playground-control-row" role="radiogroup" aria-label="Density">
                <GridraRadio
                  checked={controlDensity === "compact"}
                  label="Compact"
                  name="playground-density"
                  onChange={() => setControlDensity("compact")}
                  value="compact"
                />
                <GridraRadio
                  checked={controlDensity === "comfortable"}
                  label="Comfort"
                  name="playground-density"
                  onChange={() => setControlDensity("comfortable")}
                  value="comfortable"
                />
              </div>
              <GridraField htmlFor="playground-demo-select" label="Selected Node">
                <GridraSelect id="playground-demo-select" defaultValue="input">
                  <option value="input">Input</option>
                  <option value="transform">Transform</option>
                  <option value="output">Output</option>
                </GridraSelect>
              </GridraField>
            </section>
            <section className="playground-component-group playground-component-group--wide">
              <div className="playground-section-heading">
                <GridraLabel>Input</GridraLabel>
                <GridraBadge tone="accent">{controlOpacity}%</GridraBadge>
              </div>
              <GridraField htmlFor="playground-opacity" label="Opacity">
                <div className="playground-slider-row">
                  <GridraSlider
                    id="playground-opacity"
                    max={100}
                    min={0}
                    onChange={(event) => setControlOpacity(Number(event.target.value))}
                    value={controlOpacity}
                  />
                  <GridraBadge tone="accent">{controlOpacity}%</GridraBadge>
                </div>
              </GridraField>
              <GridraField htmlFor="playground-notes" label="Notes">
                <GridraTextarea
                  id="playground-notes"
                  onChange={(event) => setControlNotes(event.target.value)}
                  value={controlNotes}
                />
              </GridraField>
            </section>
            <section className="playground-component-group">
              <div className="playground-section-heading">
                <GridraLabel>Display</GridraLabel>
                <GridraBadge tone="muted">Static</GridraBadge>
              </div>
              <div className="playground-control-row">
                <GridraAvatar alt="Demo avatar" fallback="UI" shape="square" size="sm" src={avatarImageUrl} />
                <GridraAvatar alt="Demo avatar" fallback="UI" shape="rounded" size="md" src={avatarImageUrl} />
                <GridraAvatar alt="Demo avatar" fallback="UI" monochrome shape="circle" size="lg" src={avatarImageUrl} />
                <GridraAvatar fallback="UI" shape="circle" size={34} />
                <GridraBadge>Default</GridraBadge>
                <GridraBadge tone="accent">Accent</GridraBadge>
                <GridraBadge tone="muted">Muted</GridraBadge>
              </div>
              <GridraDivider />
              <div className="playground-status-row">
                <GridraSpinner label="Preview running" />
                <GridraLabel>Preview running</GridraLabel>
              </div>
            </section>
          </div>
        </section>
      ) : (
        <GridraCanvasArea
          enableNodeConnecting={nodeConnectingEnabled}
          enableNodeDragging={nodeDraggingEnabled}
          enableNodeResizing={nodeResizingEnabled}
          enableRangeSelection={selectionPreviewVisible}
          gridColumns={gridColumns}
          gridRows={gridRows}
          nodeConnections={nodeConnections}
          nodePlacements={nodePlacements}
          nodes={nodes}
          onNodeConnectionsChange={setNodeConnections}
          onNodePlacementsChange={setNodePlacements}
          onSelectionChange={setSelectedId}
          onSelectionIdsChange={(nextSelectedIds) => {
            setSelectedIds(nextSelectedIds);
            setSelectedId(nextSelectedIds[0] ?? null);
          }}
          renderNode={(node, state) => (
            <GridraNode
              connectionHandles={state.connectionHandles}
              dragHandle={state.selected ? state.dragHandle : undefined}
              id={node.id}
              key={node.id}
              onSelect={(nextId) => {
                setSelectedId(nextId);
                setSelectedIds([nextId]);
              }}
              placement={node.placement}
              resizeHandle={state.selected ? state.resizeHandle : undefined}
              selected={state.selected}
            >
              {node.label ?? node.id}
            </GridraNode>
          )}
          selectedId={selectedId}
          selectedIds={selectedIds}
        />
      )}
    </GridraRoot>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isDocsRoute ? <ComponentDocsPage /> : <Playground />}
  </StrictMode>
);
