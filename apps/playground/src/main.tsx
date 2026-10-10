import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  GRIDRA_BUILT_IN_THEME_NAMES,
  GridraAvatar,
  GridraBadge,
  GridraBox,
  GridraButton,
  GridraCanvasOverlay,
  GridraConnectionHandle,
  GridraDragHandle,
  GridraResizeHandle,
  useGridraCanvas,
  type GridraCanvasState,
  GridraCheckbox,
  GridraCluster,
  GridraDivider,
  GridraField,
  GridraGridLayout,
  GridraIconButton,
  GridraInline,
  GridraInlineItem,
  GridraSelectableGrid,
  GridraInput,
  GridraInspectorPanel,
  GridraLabel,
  GridraMinimap,
  GridraNode,
  type GridraNodePropertiesSchema,
  type GridraNodePropertiesValue,
  GridraPropertiesPanel,
  GridraRadio,
  GridraSelect,
  GridraSlider,
  GridraSidebar,
  GridraSplitPane,
  GridraSpinner,
  GridraStack,
  GridraSwitch,
  GridraTextarea,
  GridraTooltip,
  GridraToolbar
} from "@gridra-ui/react";
import type { GridraBuiltInThemeName } from "@gridra-ui/react";
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/themes.css";
import { ComponentDocsPage } from "./componentDocs";
import "./styles.css";

const isDocsRoute = window.location.pathname === "/docs";

type PlaygroundNodeType = "input" | "transform" | "output";

const propertiesSchema: GridraNodePropertiesSchema = {
  input: [
    { id: "sourceName", label: "Source Name", kind: "text" },
    { id: "enabled", label: "Enabled", kind: "toggle" }
  ],
  transform: [
    {
      id: "mode",
      label: "Mode",
      kind: "select",
      options: [
        { value: "merge", label: "Merge" },
        { value: "replace", label: "Replace" }
      ]
    },
    { id: "intensity", label: "Intensity", kind: "number", min: 0, max: 100, step: 1 }
  ],
  output: [
    { id: "targetName", label: "Target Name", kind: "text" },
    { id: "compress", label: "Compress", kind: "toggle" }
  ]
};

const baseNodes = [
  {
    id: "node-input",
    type: "input" as PlaygroundNodeType,
    label: "Input",
    placement: { column: 2, row: 2, columnSpan: 4, rowSpan: 2 }
  },
  {
    id: "node-transform",
    type: "transform" as PlaygroundNodeType,
    label: "Transform",
    placement: { column: 8, row: 5, columnSpan: 5, rowSpan: 2 }
  },
  {
    id: "node-output",
    type: "output" as PlaygroundNodeType,
    label: "Output",
    placement: { column: 8, row: 1, columnSpan: 4, rowSpan: 2 }
  }
] as const;

function Playground({
  onThemeChange,
  theme,
}: {
  onThemeChange: (theme: GridraBuiltInThemeName) => void;
  theme: GridraBuiltInThemeName;
}) {
  const avatarImageUrl = "https://i.pravatar.cc/96?img=12";
  const [viewMode, setViewMode] = useState<"canvas" | "components">("canvas");
  const [canvasState, setCanvasState] = useState<GridraCanvasState<{
    id: string; type: PlaygroundNodeType; label: string;
    placement: { column: number; row: number; columnSpan?: number; rowSpan?: number };
  }>>({
    nodes: baseNodes.map((node) => ({ ...node, placement: { ...node.placement } })),
    connections: [
      { sourceId: "node-input", targetId: "node-transform" },
      { sourceId: "node-transform", targetId: "node-output" },
    ],
    selectedIds: ["node-input"], selectedConnections: [],
  });
  const selectedIds = canvasState.selectedIds;
  const selectedId = selectedIds[0] ?? null;
  const setSelectedId = (id: string | null) => setCanvasState((current) => ({
    ...current, selectedIds: id ? [id] : [], selectedConnections: [],
  }));
  const [selectionPreviewVisible, setSelectionPreviewVisible] = useState(true);
  const [nodeConnectingEnabled, setNodeConnectingEnabled] = useState(true);
  const [nodeDraggingEnabled, setNodeDraggingEnabled] = useState(true);
  const [nodeResizingEnabled, setNodeResizingEnabled] = useState(true);
  const [controlDensity, setControlDensity] = useState<"compact" | "comfortable">("compact");
  const [controlNotes, setControlNotes] = useState("Dense controls for node editing.");
  const [controlOpacity, setControlOpacity] = useState(72);
  const [splitPaneOrientation, setSplitPaneOrientation] = useState<"horizontal" | "vertical">("horizontal");
  const [splitPaneSizes, setSplitPaneSizes] = useState([30, 40, 30]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarSide, setSidebarSide] = useState<"left" | "right">("left");
  const [sidebarResizable, setSidebarResizable] = useState(true);
  const [controlPreviewEnabled, setControlPreviewEnabled] = useState(true);
  const [controlSnapEnabled, setControlSnapEnabled] = useState(true);
  const [iconPreviewPressed, setIconPreviewPressed] = useState(false);
  const [nodePropertiesById, setNodePropertiesById] = useState<Record<string, GridraNodePropertiesValue>>({
    "node-input": { sourceName: "Source A", enabled: true },
    "node-transform": { mode: "merge", intensity: 50 },
    "node-output": { targetName: "Target A", compress: false }
  });
  const [gridColumns, setGridColumns] = useState(12);
  const [gridRows, setGridRows] = useState(6);
  const canvas = useGridraCanvas({
    state: canvasState, onStateChange: setCanvasState,
    grid: { columns: gridColumns, rows: gridRows },
    interactions: { connecting: nodeConnectingEnabled, dragging: nodeDraggingEnabled,
      resizing: nodeResizingEnabled, rangeSelection: selectionPreviewVisible },
  });
  const nodes = canvas.nodes;
  const items = nodes.map((node) => ({ id: node.id, label: node.label }));
  const selectedNode = useMemo(() => {
    if (!selectedId) {
      return null;
    }
    const node = nodes.find((candidate) => candidate.id === selectedId);
    if (!node) {
      return null;
    }
    return {
      id: node.id,
      label: node.label,
      placement: {
        x: node.placement.column,
        y: node.placement.row,
        w: node.placement.columnSpan ?? 1,
        h: node.placement.rowSpan ?? 1
      }
    };
  }, [nodes, selectedId]);
  const selectedNodeType = useMemo(() => {
    if (!selectedId) {
      return null;
    }
    return nodes.find((candidate) => candidate.id === selectedId)?.type ?? null;
  }, [nodes, selectedId]);

  const clampPlacement = (nextPlacement: {
    column: number;
    row: number;
    columnSpan: number;
    rowSpan: number;
  }) => {
    const clampedColumnSpan = Math.min(Math.max(1, nextPlacement.columnSpan), gridColumns);
    const clampedRowSpan = Math.min(Math.max(1, nextPlacement.rowSpan), gridRows);
    return {
      column: Math.min(Math.max(1, nextPlacement.column), gridColumns - clampedColumnSpan + 1),
      row: Math.min(Math.max(1, nextPlacement.row), gridRows - clampedRowSpan + 1),
      columnSpan: clampedColumnSpan,
      rowSpan: clampedRowSpan
    };
  };

  return (
    <div className={`playground-shell gridra-theme-${theme}`}>
        <GridraSidebar defaultOpen side="left" toggleSize={28}>
          <GridraBox fullHeight minHeightZero minWidthZero padding="md">
            <GridraStack gap="sm">
              <GridraInline align="center" justify="between">
                <h2 className="gridra-panel__title">GRIDRA</h2>
                <GridraSelect
                  aria-label="Theme"
                  onChange={(event) =>
                    onThemeChange(event.target.value as GridraBuiltInThemeName)
                  }
                  value={theme}
                >
                  {GRIDRA_BUILT_IN_THEME_NAMES.map((themeName) => (
                    <option key={themeName} value={themeName}>
                      {themeName[0].toUpperCase() + themeName.slice(1)}
                    </option>
                  ))}
                </GridraSelect>
              </GridraInline>
              <GridraStack gap="sm">
                <GridraInline align="center" justify="between">
                  <GridraLabel>Canvas</GridraLabel>
                  <GridraBadge tone="muted">{gridColumns} x {gridRows}</GridraBadge>
                </GridraInline>
                <GridraField htmlFor="playground-selected-node" label="Selected Node">
                  <GridraSelect
                    id="playground-selected-node"
                    onChange={(event) => {
                      setSelectedId(event.target.value);
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
                <GridraField label="Minimap">
                  <GridraMinimap
                    gridColumns={gridColumns}
                    gridRows={gridRows}
                    nodes={nodes}
                    selectedIds={selectedIds}
                    viewport={{
                      x: 0,
                      y: 0,
                      width: Math.max(1, Math.floor(gridColumns * 0.6)),
                      height: Math.max(1, Math.floor(gridRows * 0.6))
                    }}
                  />
                </GridraField>
              </GridraStack>
              <GridraDivider />
              <GridraSelectableGrid
                columns={1}
                items={items}
                onSelectionChange={(nextSelectedId) => {
                  setSelectedId(nextSelectedId);
                }}
                selectedId={selectedId}
              />
              <GridraDivider />
              <GridraInspectorPanel
                onChange={(patch) => {
                  if (!selectedId) {
                    return;
                  }
                  const nextLabel = patch.label;
                  if (typeof nextLabel === "string") {
                    setCanvasState((current) => ({ ...current, nodes: current.nodes.map((node) => node.id === selectedId ? { ...node, label: nextLabel } : node) }));
                  }
                  if (patch.placement) {
                    const currentPlacement =
                      canvasState.nodes.find((node) => node.id === selectedId)?.placement;
                    if (!currentPlacement) {
                      return;
                    }
                    const nextPlacement = clampPlacement({
                      column: patch.placement.x ?? currentPlacement.column,
                      row: patch.placement.y ?? currentPlacement.row,
                      columnSpan: patch.placement.w ?? currentPlacement.columnSpan ?? 1,
                      rowSpan: patch.placement.h ?? currentPlacement.rowSpan ?? 1
                    });
                    setCanvasState((current) => ({ ...current, nodes: current.nodes.map((node) => node.id === selectedId ? { ...node, placement: nextPlacement } : node) }));
                  }
                }}
                selectedNode={selectedNode}
              />
              <GridraDivider />
              <GridraPropertiesPanel
                onChange={(patch) => {
                  if (!selectedId) {
                    return;
                  }
                  const sanitizedPatch = Object.fromEntries(
                    Object.entries(patch).filter((entry) => entry[1] !== undefined)
                  ) as GridraNodePropertiesValue;
                  setNodePropertiesById((current) => ({
                    ...current,
                    [selectedId]: {
                      ...(current[selectedId] ?? {}),
                      ...sanitizedPatch
                    }
                  }));
                }}
                schema={propertiesSchema}
                selectedNodeId={selectedId}
                selectedNodeType={selectedNodeType}
                value={selectedId ? nodePropertiesById[selectedId] : undefined}
              />
            </GridraStack>
          </GridraBox>
        </GridraSidebar>
      <main className="playground-main">
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
        <GridraBox
          as="section"
          border="default"
          className="playground-component-stage"
          fullHeight
          padding="lg"
          scroll="auto"
        >
          <GridraInline align="start" className="playground-component-header" justify="between">
            <div>
              <GridraLabel>Basic Controls</GridraLabel>
              <h1 className="playground-component-title">Component Check Surface</h1>
            </div>
            <GridraInline align="center" gap="sm">
              <GridraAvatar alt="Demo avatar" fallback="UI" shape="circle" size="md" src={avatarImageUrl} />
              <GridraBadge tone="accent">{controlOpacity}%</GridraBadge>
              {controlPreviewEnabled ? <GridraSpinner label="Preview running" /> : null}
            </GridraInline>
          </GridraInline>
          <GridraGridLayout className="playground-component-grid" columns="auto" gap="md" minColumnWidth={220}>
            <GridraStack
              as="section"
              border="default"
              className="playground-component-group"
              gap="md"
              padding="md"
              surface="surface"
            >
              <GridraInline align="center" justify="between">
                <GridraLabel>Actions</GridraLabel>
                <GridraBadge tone="muted">Button family</GridraBadge>
              </GridraInline>
              <GridraCluster align="center" gap="sm">
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
            </GridraCluster>
          </GridraStack>
          <GridraStack
            as="section"
            border="default"
            className="playground-component-group"
            gap="md"
            padding="md"
            surface="surface"
          >
            <GridraInline align="center" justify="between">
              <GridraLabel>Boolean</GridraLabel>
              <GridraBadge>{controlPreviewEnabled ? "active" : "idle"}</GridraBadge>
            </GridraInline>
            <GridraCluster align="center" gap="sm">
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
            </GridraCluster>
          </GridraStack>
          <GridraStack
            as="section"
            border="default"
            className="playground-component-group"
            gap="md"
            padding="md"
            surface="surface"
          >
            <GridraInline align="center" justify="between">
              <GridraLabel>Tooltip</GridraLabel>
              <GridraBadge tone="muted">top/right/bottom/left</GridraBadge>
            </GridraInline>
            <GridraCluster align="center" gap="sm">
              <GridraTooltip content="Top hint" placement="top">
                <GridraButton size="sm">Top</GridraButton>
              </GridraTooltip>
              <GridraTooltip content="Right hint with max width override for numeric sizing." maxWidth={220} placement="right" size="lg">
                <GridraButton size="sm">Right</GridraButton>
              </GridraTooltip>
              <GridraTooltip content="Bottom hint" placement="bottom">
                <GridraButton size="sm">Bottom</GridraButton>
              </GridraTooltip>
              <GridraTooltip content="Left hint" placement="left" size="sm">
                <GridraButton size="sm">Left</GridraButton>
              </GridraTooltip>
            </GridraCluster>
          </GridraStack>
          <GridraStack
            as="section"
            border="default"
            className="playground-component-group"
            gap="md"
            padding="md"
            surface="surface"
          >
            <GridraInline align="center" justify="between">
              <GridraLabel>Choice</GridraLabel>
              <GridraBadge>{controlDensity}</GridraBadge>
            </GridraInline>
            <GridraCluster align="center" gap="sm" role="radiogroup" aria-label="Density">
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
              </GridraCluster>
              <GridraField htmlFor="playground-demo-select" label="Selected Node">
                <GridraSelect id="playground-demo-select" defaultValue="input">
                  <option value="input">Input</option>
                  <option value="transform">Transform</option>
                  <option value="output">Output</option>
              </GridraSelect>
            </GridraField>
          </GridraStack>
          <GridraStack
            as="section"
            border="default"
            className="playground-component-group playground-component-group--wide"
            gap="md"
            padding="md"
            surface="surface"
          >
            <GridraInline align="center" justify="between">
              <GridraLabel>Input</GridraLabel>
              <GridraBadge tone="accent">{controlOpacity}%</GridraBadge>
            </GridraInline>
            <GridraField htmlFor="playground-opacity" label="Opacity">
              <GridraInline align="center" gap="sm" fullWidth>
                <GridraInlineItem grow>
                  <GridraSlider
                  id="playground-opacity"
                  max={100}
                  min={0}
                  onChange={(event) => setControlOpacity(Number(event.target.value))}
                  value={controlOpacity}
                />
                </GridraInlineItem>
                <GridraBadge tone="accent">{controlOpacity}%</GridraBadge>
              </GridraInline>
            </GridraField>
              <GridraField htmlFor="playground-notes" label="Notes">
              <GridraTextarea
                id="playground-notes"
                onChange={(event) => setControlNotes(event.target.value)}
                value={controlNotes}
              />
            </GridraField>
          </GridraStack>
          <GridraStack
            as="section"
            border="default"
            className="playground-component-group playground-component-group--wide"
            gap="md"
            padding="md"
            surface="surface"
          >
            <GridraInline align="center" justify="between">
              <GridraLabel>Split Pane</GridraLabel>
              <GridraBadge tone="accent">
                {splitPaneSizes.map((value) => Math.round(value)).join(" / ")}%
              </GridraBadge>
            </GridraInline>
            <GridraCluster align="center" gap="sm">
              <GridraButton
                onClick={() => setSplitPaneOrientation("horizontal")}
                pressed={splitPaneOrientation === "horizontal"}
                size="sm"
              >
                Horizontal
              </GridraButton>
              <GridraButton
                onClick={() => setSplitPaneOrientation("vertical")}
                pressed={splitPaneOrientation === "vertical"}
                size="sm"
              >
                Vertical
              </GridraButton>
            </GridraCluster>
            <GridraBox border="default" style={{ height: 180 }} surface="raised">
              <GridraSplitPane
                maxSize={85}
                minSize={15}
                onSizesChange={setSplitPaneSizes}
                orientation={splitPaneOrientation}
                sizes={splitPaneSizes}
              >
                <GridraBox padding="sm" surface="input">
                  <GridraLabel>Pane A</GridraLabel>
                  <GridraBadge tone="muted">primary</GridraBadge>
                </GridraBox>
                <GridraBox padding="sm" surface="input">
                  <GridraLabel>Pane B</GridraLabel>
                  <GridraBadge tone="muted">secondary</GridraBadge>
                </GridraBox>
                <GridraBox padding="sm" surface="input">
                  <GridraLabel>Pane C</GridraLabel>
                  <GridraBadge tone="muted">tertiary</GridraBadge>
                </GridraBox>
              </GridraSplitPane>
            </GridraBox>
          </GridraStack>
          <GridraStack
            as="section"
            border="default"
            className="playground-component-group playground-component-group--wide"
            gap="md"
            padding="md"
            surface="surface"
          >
            <GridraInline align="center" justify="between">
              <GridraLabel>Sidebar</GridraLabel>
              <GridraBadge tone="muted">{sidebarOpen ? "open" : "closed"}</GridraBadge>
            </GridraInline>
            <GridraCluster align="center" gap="sm">
              <GridraButton onClick={() => setSidebarOpen((current) => !current)} size="sm">
                Toggle
              </GridraButton>
              <GridraButton
                onClick={() => setSidebarSide("left")}
                pressed={sidebarSide === "left"}
                size="sm"
              >
                Left
              </GridraButton>
              <GridraButton
                onClick={() => setSidebarSide("right")}
                pressed={sidebarSide === "right"}
                size="sm"
              >
                Right
              </GridraButton>
              <GridraCheckbox
                checked={sidebarResizable}
                label="Resizable"
                onChange={(event) => setSidebarResizable(event.target.checked)}
              />
            </GridraCluster>
            <GridraBox border="default" style={{ height: 180 }} surface="raised">
              <GridraInline fullWidth style={{ height: "100%" }}>
                {sidebarSide === "left" ? (
                  <>
                    <GridraSidebar
                      collapsedWidth={0}
                      maxWidth={340}
                      minWidth={180}
                      onOpenChange={(nextOpen) => setSidebarOpen(nextOpen)}
                      open={sidebarOpen}
                      resizable={sidebarResizable}
                      side={sidebarSide}
                      width={260}
                    >
                      <GridraBox fullHeight padding="sm" surface="input">
                        <GridraLabel>Navigation</GridraLabel>
                        <GridraBadge size="sm">left shell</GridraBadge>
                      </GridraBox>
                    </GridraSidebar>
                    <GridraBox fullWidth padding="sm" surface="input">
                      <GridraLabel>Main Area</GridraLabel>
                      <GridraBadge tone="muted">content</GridraBadge>
                    </GridraBox>
                  </>
                ) : (
                  <>
                    <GridraBox fullWidth padding="sm" surface="input">
                      <GridraLabel>Main Area</GridraLabel>
                      <GridraBadge tone="muted">content</GridraBadge>
                    </GridraBox>
                    <GridraSidebar
                      collapsedWidth={0}
                      maxWidth={340}
                      minWidth={180}
                      onOpenChange={(nextOpen) => setSidebarOpen(nextOpen)}
                      open={sidebarOpen}
                      resizable={sidebarResizable}
                      side={sidebarSide}
                      width={260}
                    >
                      <GridraBox fullHeight padding="sm" surface="input">
                        <GridraLabel>Inspector</GridraLabel>
                        <GridraBadge size="sm">right shell</GridraBadge>
                      </GridraBox>
                    </GridraSidebar>
                  </>
                )}
              </GridraInline>
            </GridraBox>
          </GridraStack>
          <GridraStack
            as="section"
            border="default"
            className="playground-component-group playground-component-group--wide"
            gap="md"
            padding="md"
            surface="surface"
          >
            <GridraInline align="center" justify="between">
              <GridraLabel>Constrained Box</GridraLabel>
              <GridraBadge tone="muted">maxWidth + marginInline</GridraBadge>
            </GridraInline>
            <GridraBox border="default" padding="sm" surface="raised">
              <GridraBox
                border="default"
                padding="sm"
                style={{ marginInline: "auto", maxWidth: 480 }}
                surface="input"
              >
                <GridraBadge size="sm">size=sm center</GridraBadge>
              </GridraBox>
            </GridraBox>
            <GridraBox border="default" padding="sm" surface="raised">
              <GridraBox
                border="default"
                padding="sm"
                style={{ marginInline: "auto 0", maxWidth: 220 }}
                surface="input"
              >
                <GridraBadge size="sm" tone="accent">align=end + maxWidth</GridraBadge>
              </GridraBox>
            </GridraBox>
          </GridraStack>
          <GridraStack
            as="section"
            border="default"
            className="playground-component-group"
            gap="md"
            padding="md"
            surface="surface"
          >
            <GridraInline align="center" justify="between">
              <GridraLabel>Display</GridraLabel>
              <GridraBadge tone="muted">Static</GridraBadge>
            </GridraInline>
            <GridraCluster align="center" gap="sm">
                <GridraAvatar alt="Demo avatar" fallback="UI" shape="square" size="sm" src={avatarImageUrl} />
                <GridraAvatar alt="Demo avatar" fallback="UI" shape="rounded" size="md" src={avatarImageUrl} />
                <GridraAvatar alt="Demo avatar" fallback="UI" monochrome shape="circle" size="lg" src={avatarImageUrl} />
                <GridraAvatar fallback="UI" shape="circle" size={34} />
                <GridraBadge>Default</GridraBadge>
                <GridraBadge tone="accent">Accent</GridraBadge>
                <GridraBadge tone="muted">Muted</GridraBadge>
              </GridraCluster>
              <GridraDivider />
              <GridraInline align="center" gap="sm">
                <GridraSpinner label="Preview running" />
                <GridraLabel>Preview running</GridraLabel>
              </GridraInline>
            </GridraStack>
          </GridraGridLayout>
        </GridraBox>
      ) : (
        <section {...canvas.getContainerProps({ className: "playground-canvas" })}>
          {nodes.map((node) => {
            const values = nodePropertiesById[node.id];
            const detail = String(values?.[node.type === "transform" ? "mode" : node.type === "input" ? "sourceName" : "targetName"] ?? "");
            const selected = selectedIds.includes(node.id);
            return (
              <GridraNode key={node.id} {...canvas.getNodeProps(node.id)}
                dragHandle={nodeDraggingEnabled && selected ? <GridraDragHandle position="top-right" {...canvas.getDragHandleProps(node.id)} /> : null}
                resizeHandle={nodeResizingEnabled && selected ? <GridraResizeHandle position="bottom-right" {...canvas.getResizeHandleProps(node.id)} /> : null}
                connectionHandles={nodeConnectingEnabled ? <>
                  <GridraConnectionHandle kind="input" position="left" {...canvas.getConnectionHandleProps(node.id, "input")} />
                  <GridraConnectionHandle kind="output" position="right" {...canvas.getConnectionHandleProps(node.id, "output")} />
                </> : null}>
                {detail ? `${node.label} · ${detail}` : node.label}
              </GridraNode>
            );
          })}
          <GridraCanvasOverlay {...canvas.overlayProps} />
        </section>
      )}
      </main>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState<GridraBuiltInThemeName>("dark");

  return isDocsRoute ? (
    <ComponentDocsPage onThemeChange={setTheme} theme={theme} />
  ) : (
    <Playground onThemeChange={setTheme} theme={theme} />
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
