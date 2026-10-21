import { useGridraRadio } from "@gridra-ui/headless";
import { useGridraCheckbox } from "@gridra-ui/headless";
import { useGridraField } from "@gridra-ui/headless";
import { useGridraToastQueue } from "@gridra-ui/headless";
import { useGridraCommandPalette } from "@gridra-ui/headless";
import { useGridraContextMenu } from "@gridra-ui/headless";
import { useGridraDropdownMenu } from "@gridra-ui/headless";
import { useGridraDialog } from "@gridra-ui/headless";
import { useGridraHoverCard } from "@gridra-ui/headless";
import { useGridraTooltip } from "@gridra-ui/headless";
import { useGridraPopover } from "@gridra-ui/headless";
import { useGridraSplitPane } from "@gridra-ui/headless";
import { useGridraSidebar } from "@gridra-ui/headless";
import { useGridraTreeView } from "@gridra-ui/headless";
import { useGridraMenu } from "@gridra-ui/headless";
import { useGridraStepper } from "@gridra-ui/headless";
import { useGridraPagination } from "@gridra-ui/headless";
import { useGridraSelectableGrid } from "@gridra-ui/headless";
// Live examples use the same props as the snippets in data/components.
import { createContext, useContext, useId, useState } from "react";
import type { ReactNode } from "react";
import {
  GridraAccordion,
  GridraAlert,
  GridraAvatar,
  GridraBadge,
  GridraBox,
  GridraBreadcrumb,
  GridraButton,
  GridraCanvasOverlay,
  GridraCard,
  GridraCheckbox,
  GridraCommandPalette,
  GridraConnectionHandle,
  GridraContextMenu,
  GridraDescriptionList,
  GridraDialog,
  GridraDivider,
  GridraDragHandle,
  GridraDropdownMenu,
  GridraEmptyState,
  GridraErrorMessage,
  GridraField,
  GridraGridLayout,
  GridraHoverCard,
  GridraIconButton,
  GridraInput,
  GridraInspectorPanel,
  GridraKbd,
  GridraLabel,
  GridraList,
  GridraMenu,
  GridraMinimap,
  GridraNode,
  GridraPagination,
  GridraPanel,
  GridraPopover,
  GridraProgress,
  GridraPropertiesPanel,
  GridraRadio,
  GridraResizeHandle,
  GridraSelect,
  GridraSelectableGrid,
  GridraSelectionBox,
  GridraSidebar,
  GridraSkeleton,
  GridraSlider,
  GridraSnapGuides,
  GridraSpinner,
  GridraSplitPane,
  GridraStack,
  GridraStackItem,
  GridraStat,
  GridraStatusIndicator,
  GridraSwitch,
  GridraTabs,
  GridraTextarea,
  GridraToastProvider,
  GridraToolbar,
  GridraTooltip,
  GridraTreeView,
  useToast,
} from "@gridra-ui/react";
import {
  useGridraCanvas,
  useGridraTabs,
  useGridraAccordion,
} from "@gridra-ui/headless";
import type {
  GridraBuiltInThemeName,
  GridraCanvasState,
  GridraCanvasNode,
  GridraInspectorValue,
  GridraNodePropertiesValue,
  GridraNodePropertiesSchema,
  GridraPropertiesPatch,
} from "@gridra-ui/react";

export const ExampleThemeContext =
  createContext<GridraBuiltInThemeName>("dark");

const avatarImageUrl = "https://i.pravatar.cc/96?img=12";

const accordionItems = [
  { id: "general", title: "General", content: "General settings content." },
  { id: "account", title: "Account", content: "Account settings content." },
  { id: "security", title: "Security", content: "Security settings content." },
];

const menuItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "nodes", label: "Nodes" },
  { id: "connections", label: "Connections" },
];

const commandItems = [
  { id: "new", label: "New File", description: "Create", group: "File" },
  { id: "open", label: "Open", description: "Browse", group: "File" },
  { id: "save", label: "Save", group: "File" },
  { type: "separator" as const },
  { id: "undo", label: "Undo", group: "Edit" },
  { id: "redo", label: "Redo", group: "Edit" },
];

const tabItems = [
  {
    id: "general",
    label: "General",
    content: <GridraBox padding="md">General settings</GridraBox>,
  },
  {
    id: "account",
    label: "Account",
    content: <GridraBox padding="md">Account settings</GridraBox>,
  },
  {
    id: "security",
    label: "Security",
    content: <GridraBox padding="md">Security settings</GridraBox>,
  },
];

const treeItems = [
  {
    id: "src",
    label: "src",
    children: [
      {
        id: "components",
        label: "components",
        children: [{ id: "button", label: "Button.tsx" }],
      },
      { id: "index", label: "index.ts" },
    ],
  },
  {
    id: "public",
    label: "public",
    children: [{ id: "favicon", label: "favicon.ico" }],
  },
];

function ExampleToastAction({
  variant,
}: {
  variant: "basic" | "duration" | "queue" | "top";
}) {
  const { show } = useToast();

  return (
    <GridraButton
      onClick={() => {
        if (variant === "queue") {
          show("First");
          show("Second");
          show("Third");
        } else if (variant === "duration")
          show("This stays longer", { duration: 5000 });
        else show("File saved successfully");
      }}
    >
      {variant === "queue"
        ? "Show queued toasts"
        : variant === "duration"
          ? "Show 5-second toast"
          : variant === "top"
            ? "Show top toast"
            : "Show toast"}
    </GridraButton>
  );
}

function ExampleGridraAccordion1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-accordion">
      <GridraAccordion
        items={[
          {
            id: "general",
            title: "General",
            content: "General settings content.",
          },
          {
            id: "account",
            title: "Account",
            content: "Account settings content.",
          },
          {
            id: "security",
            title: "Security",
            content: "Security settings content.",
          },
        ]}
      />
    </div>
  );
}

function ExampleGridraAccordion2() {
  const items = accordionItems;
  const [value, setValue] = useState<string[]>(["general"]);

  return (
    <div className="docs-example-content docs-example-content--gridra-accordion">
      <GridraAccordion
        type="multiple"
        value={value}
        onValueChange={(next) => setValue(Array.isArray(next) ? next : [])}
        items={items}
      />
    </div>
  );
}

function ExampleGridraAccordion3() {
  const items = accordionItems;

  return (
    <div className="docs-example-content docs-example-content--gridra-accordion">
      <GridraAccordion collapsible={true} items={items} />
    </div>
  );
}

function ExampleGridraAlert1() {
  const [toast, setToast] = useState(false);

  return (
    <div className="docs-example-content docs-example-content--gridra-alert">
      <>
        <GridraButton onClick={() => setToast(true)}>
          Show alert toast
        </GridraButton>
        <div className="toast-viewport">
          {toast && (
            <GridraAlert
              action={
                <GridraButton
                  size="sm"
                  variant="ghost"
                  onClick={() => setToast(false)}
                >
                  Dismiss
                </GridraButton>
              }
              heading="Update available"
              tone="info"
            >
              A new version v2.1.0 is ready to install.
            </GridraAlert>
          )}
        </div>
      </>
    </div>
  );
}

function ExampleGridraAlert2() {
  const [error, setError] = useState(false);

  return (
    <div className="docs-example-content docs-example-content--gridra-alert">
      <>
        <GridraButton onClick={() => setError(true)}>
          Simulate error
        </GridraButton>
        <div className="toast-viewport">
          {error && (
            <GridraAlert
              action={
                <GridraButton
                  size="sm"
                  variant="ghost"
                  onClick={() => setError(false)}
                >
                  Dismiss
                </GridraButton>
              }
              heading="Connection lost"
              tone="danger"
            >
              Unable to reach the server. Check your network connection.
            </GridraAlert>
          )}
        </div>
      </>
    </div>
  );
}

function ExampleGridraAlert3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-alert">
      {["info", "success", "warning", "danger"].map((tone) => (
        <GridraAlert
          key={tone}
          tone={tone as "info" | "success" | "warning" | "danger"}
        >
          {tone} message content
        </GridraAlert>
      ))}
    </div>
  );
}

function ExampleGridraAvatar1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-avatar">
      <GridraAvatar alt="User" shape="square" size="sm" src={avatarImageUrl} />
      <GridraAvatar alt="User" shape="rounded" size="md" src={avatarImageUrl} />
      <GridraAvatar alt="User" shape="circle" size="lg" src={avatarImageUrl} />
    </div>
  );
}

function ExampleGridraAvatar2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-avatar">
      <GridraAvatar fallback="UI" shape="circle" size={34} />
      <GridraAvatar
        alt="User"
        monochrome
        shape="circle"
        size="lg"
        src={avatarImageUrl}
      />
    </div>
  );
}

function ExampleGridraBadge1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-badge">
      <GridraBadge variant="outline">Production</GridraBadge>
      <GridraBadge variant="outline" tone="success" size="sm">
        Healthy
      </GridraBadge>
    </div>
  );
}

function ExampleGridraBadge2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-badge">
      <GridraBadge>Default</GridraBadge>
      <GridraBadge tone="accent">Accent</GridraBadge>
      <GridraBadge tone="muted">Muted</GridraBadge>
    </div>
  );
}

function ExampleGridraBadge3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-badge">
      <GridraBadge shape="pill" size="sm" tone="success">
        Success
      </GridraBadge>
      <GridraBadge shape="rounded" tone="warning">
        Warning
      </GridraBadge>
      <GridraBadge tone="danger">Danger</GridraBadge>
    </div>
  );
}

function ExampleGridraBreadcrumb1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-breadcrumb">
      <GridraBreadcrumb
        items={[
          { id: "home", label: "Home", href: "/" },
          { id: "projects", label: "Projects", href: "/projects" },
          { id: "detail", label: "My Project", current: true },
        ]}
      />
    </div>
  );
}

function ExampleGridraBreadcrumb2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-breadcrumb">
      <GridraBreadcrumb
        maxItems={4}
        items={[
          { id: "home", label: "Home", href: "/" },
          { id: "a", label: "Category", href: "/category" },
          { id: "b", label: "Subcategory", href: "/category/sub" },
          { id: "c", label: "Item", href: "/category/sub/item" },
          { id: "d", label: "Details", href: "/category/sub/item/details" },
          { id: "detail", label: "Edit", current: true },
        ]}
      />
    </div>
  );
}

function ExampleGridraBreadcrumb3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-breadcrumb">
      <GridraBreadcrumb
        items={[
          { id: "home", label: "Home", href: "/" },
          {
            id: "projects",
            label: "Projects",
            href: "/projects",
            parentId: "home",
          },
          {
            id: "detail",
            label: "Detail",
            href: "/projects/1",
            current: true,
            parentId: "projects",
          },
        ]}
        onHierarchyInvalid={(issues) => console.warn(issues)}
      />
    </div>
  );
}

function ExampleGridraButton1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-button">
      <GridraButton size="sm">Small</GridraButton>
      <GridraButton>Default</GridraButton>
      <GridraButton size="lg">Large</GridraButton>
    </div>
  );
}

function ExampleGridraButton2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-button">
      <GridraButton variant="primary">Primary</GridraButton>
      <GridraButton variant="ghost">Ghost</GridraButton>
      <GridraButton loading>Loading</GridraButton>
      <GridraButton pressed>Pressed</GridraButton>
    </div>
  );
}

function ExampleGridraCanvasOverlay1() {
  const [state, setState] = useState<
    GridraCanvasState<GridraCanvasNode & { label: string }>
  >({
    nodes: [
      {
        id: "source",
        label: "Source",
        placement: { column: 1, row: 1, columnSpan: 2 },
      },
      {
        id: "target",
        label: "Target",
        placement: { column: 4, row: 2, columnSpan: 2 },
      },
    ],
    connections: [],
    selectedIds: ["source"],
    selectedConnections: [],
  });
  const canvas = useGridraCanvas({
    state,
    onStateChange: setState,
    grid: { columns: 6, rows: 3 },
    interactions: { dragging: true, resizing: true, connecting: true },
  });

  return (
    <div className="docs-example-content docs-example-content--gridra-canvas-overlay">
      <section
        {...canvas.getContainerProps({
          style: { height: 220, width: "100%", gap: 10, padding: 10 },
        })}
      >
        {canvas.nodes.map((node) => (
          <GridraNode key={node.id} {...canvas.getNodeProps(node.id)}>
            {node.label}
          </GridraNode>
        ))}
        <GridraCanvasOverlay {...canvas.overlayProps} />
      </section>
    </div>
  );
}

function ExampleGridraCard1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-card">
      <GridraCard
        heading="Pipeline"
        description="Last run completed"
        footer="Updated 2m ago"
      >
        <GridraBadge variant="outline" tone="success">
          Healthy
        </GridraBadge>
      </GridraCard>
    </div>
  );
}

function ExampleGridraCheckbox1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-checkbox">
      <GridraCheckbox
        defaultChecked
        description="Aligns nodes to the grid"
        label="Snap"
        size="lg"
      />
    </div>
  );
}

function ExampleGridraCommandPalette1() {
  const theme = useContext(ExampleThemeContext);
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");

  return (
    <div className="docs-example-content docs-example-content--gridra-command-palette">
      <GridraButton onClick={() => setOpen(true)}>
        Open command palette
      </GridraButton>
      <GridraCommandPalette
        theme={theme}
        open={open}
        onOpenChange={setOpen}
        items={[
          {
            id: "new",
            label: "New File",
            description: "Create",
            group: "File",
          },
          { id: "open", label: "Open", description: "Browse", group: "File" },
          { id: "save", label: "Save", group: "File" },
          { type: "separator" as const },
          { id: "undo", label: "Undo", group: "Edit" },
          { id: "redo", label: "Redo", group: "Edit" },
        ]}
        onAction={setAction}
      />
      <output aria-live="polite">{action ? "Selected: " + action : ""}</output>
    </div>
  );
}

function ExampleGridraCommandPalette2() {
  const items = commandItems;
  const theme = useContext(ExampleThemeContext);
  const [action, handle] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div className="docs-example-content docs-example-content--gridra-command-palette">
      <>
        <GridraButton onClick={() => setOpen(true)}>Cmd Palette</GridraButton>
        <GridraCommandPalette
          theme={theme}
          items={items}
          open={open}
          onOpenChange={(next) => setOpen(next)}
          onAction={(id) => {
            handle(id);
            setOpen(false);
          }}
        />
      </>
      <output aria-live="polite">{action ? "Selected: " + action : ""}</output>
    </div>
  );
}

function ExampleGridraConnectionHandle1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-connection-handle">
      <div className="docs-inline-preview">
        <GridraConnectionHandle kind="input" position="inline" />
        <GridraConnectionHandle kind="output" position="inline" active />
      </div>
    </div>
  );
}

function ExampleGridraContextMenu1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-context-menu">
      <GridraContextMenu
        items={[
          { id: "new", label: "New" },
          { id: "open", label: "Open" },
          { type: "separator" as const },
          { id: "delete", label: "Delete", destructive: true },
        ]}
        onAction={(id) => console.log(id)}
      >
        <GridraBox border="default" padding="md" surface="input">
          <GridraLabel>Right-click here</GridraLabel>
        </GridraBox>
      </GridraContextMenu>
    </div>
  );
}

function ExampleGridraContextMenu2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-context-menu">
      <GridraContextMenu
        items={[
          { id: "save", label: "Save" },
          { id: "rename", label: "Rename", disabled: true },
          { type: "separator" as const },
          { id: "close", label: "Close" },
        ]}
      >
        <GridraBox border="default" padding="md" surface="input">
          <GridraLabel>Right-click or ContextMenu key</GridraLabel>
        </GridraBox>
      </GridraContextMenu>
    </div>
  );
}

function ExampleGridraDescriptionList1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-description-list">
      <GridraDescriptionList
        items={[
          { term: "Owner", description: "Design systems" },
          { term: "Status", description: "Ready" },
        ]}
      />
    </div>
  );
}

function ExampleGridraDialog1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-dialog">
      <GridraDialog
        title="Confirm"
        description="Are you sure you want to proceed?"
        content={
          <GridraStack gap="sm">
            <GridraButton variant="primary">Proceed</GridraButton>
            <GridraButton variant="ghost">Cancel</GridraButton>
          </GridraStack>
        }
      >
        <GridraButton>Open Dialog</GridraButton>
      </GridraDialog>
    </div>
  );
}

function ExampleGridraDialog2() {
  const [open, setOpen] = useState(false);

  return (
    <div className="docs-example-content docs-example-content--gridra-dialog">
      <GridraDialog
        content={<GridraLabel>Settings content</GridraLabel>}
        onOpenChange={(next) => setOpen(next)}
        open={open}
        title="Settings"
      >
        <GridraButton>Configure</GridraButton>
      </GridraDialog>
    </div>
  );
}

function ExampleGridraDialog3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-dialog">
      <GridraDialog
        content={
          <GridraBox padding="md" surface="input">
            Full-width content
          </GridraBox>
        }
        size="fullscreen"
        title="Editor"
      >
        <GridraButton>Expand</GridraButton>
      </GridraDialog>
    </div>
  );
}

function ExampleGridraDivider1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-divider">
      <GridraDivider spacing="none" tone="muted" />
      <GridraDivider inset spacing="md" tone="strong" />
    </div>
  );
}

function ExampleGridraDivider2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-divider">
      <GridraDivider orientation="vertical" spacing="lg" />
    </div>
  );
}

function ExampleGridraDragHandle1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-drag-handle">
      <GridraDragHandle position="inline" />
    </div>
  );
}

function ExampleGridraDropdownMenu1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-dropdown-menu">
      <GridraDropdownMenu
        items={[
          { id: "new", label: "New" },
          { id: "open", label: "Open" },
          { type: "separator" as const },
          { id: "delete", label: "Delete", destructive: true },
        ]}
        onAction={(id) => console.log(id)}
      >
        <GridraButton>Actions</GridraButton>
      </GridraDropdownMenu>
    </div>
  );
}

function ExampleGridraDropdownMenu2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-dropdown-menu">
      <GridraDropdownMenu
        items={[
          { id: "save", label: "Save" },
          { id: "rename", label: "Rename", disabled: true },
          { type: "separator" as const },
          { id: "close", label: "Close" },
        ]}
      >
        <GridraButton>File</GridraButton>
      </GridraDropdownMenu>
    </div>
  );
}

function ExampleGridraErrorMessage1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-error-message">
      <GridraErrorMessage>This field is required</GridraErrorMessage>
    </div>
  );
}

function ExampleGridraErrorMessage2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-error-message">
      <GridraErrorMessage tone="warning">
        Password strength is moderate
      </GridraErrorMessage>
    </div>
  );
}

function ExampleGridraErrorMessage3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-error-message">
      <GridraErrorMessage role="alert">Connection failed</GridraErrorMessage>
    </div>
  );
}

function ExampleGridraStatusIndicator1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-status-indicator">
      <GridraStatusIndicator label="Online" tone="success" />
      <GridraStatusIndicator label="Disconnected" tone="danger" />
      <GridraStatusIndicator label="Pending" tone="warning" />
    </div>
  );
}

function ExampleGridraStatusIndicator2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-status-indicator">
      <GridraStatusIndicator label="Syncing" pulse size="sm" />
    </div>
  );
}

function ExampleGridraStatusIndicator3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-status-indicator">
      <GridraStatusIndicator tone="success" />
    </div>
  );
}

function ExampleGridraField1() {
  const fieldId = useId();

  return (
    <div className="docs-example-content docs-example-content--gridra-field">
      <GridraField
        label="Name"
        required
        error="Required"
        control={<GridraInput />}
      />
      <GridraField
        label="Columns"
        hint="1 to 24"
        control={<GridraInput type="number" defaultValue="12" />}
      />
    </div>
  );
}

function ExampleGridraField2() {
  const fieldId = useId();

  return (
    <div className="docs-example-content docs-example-content--gridra-field">
      <GridraField hint="1 to 24" htmlFor={fieldId} label="Columns" required>
        <GridraInput id={fieldId} defaultValue="12" size="sm" />
      </GridraField>
    </div>
  );
}

function ExampleGridraField3() {
  const fieldId = useId();

  return (
    <div className="docs-example-content docs-example-content--gridra-field">
      <GridraField
        orientation="horizontal"
        error="Required"
        htmlFor={fieldId}
        label="Name"
      >
        <GridraInput id={fieldId} invalid />
      </GridraField>
    </div>
  );
}

function ExampleGridraGridLayout1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-grid-layout">
      <GridraGridLayout columns="auto" minColumnWidth={200} gap="sm">
        <GridraBadge size="sm">Card A</GridraBadge>
        <GridraBadge size="sm">Card B</GridraBadge>
        <GridraBadge size="sm">Card C</GridraBadge>
      </GridraGridLayout>
    </div>
  );
}

function ExampleGridraGridLayout2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-grid-layout">
      <GridraGridLayout columns={2} gap="md">
        <GridraBadge size="sm">Field 1</GridraBadge>
        <GridraBadge size="sm">Field 2</GridraBadge>
      </GridraGridLayout>
    </div>
  );
}

function ExampleGridraGridLayout3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-grid-layout">
      <GridraGridLayout columns={3} gap="sm" rowGap="lg" columnGap="xs">
        <GridraBadge size="sm">One</GridraBadge>
        <GridraBadge size="sm">Two</GridraBadge>
        <GridraBadge size="sm">Three</GridraBadge>
      </GridraGridLayout>
    </div>
  );
}

function ExampleGridraHoverCard1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-hover-card">
      <GridraHoverCard
        content={
          <GridraStack gap="sm" style={{ minWidth: 200 }}>
            <GridraLabel>User Profile</GridraLabel>
            <GridraStack gap="xs">
              <GridraBadge>Premium</GridraBadge>
              <GridraBadge tone="muted">Member since 2024</GridraBadge>
            </GridraStack>
          </GridraStack>
        }
      >
        <GridraAvatar fallback="UN" size="md" />
      </GridraHoverCard>
    </div>
  );
}

function ExampleGridraHoverCard2() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="docs-example-content docs-example-content--gridra-hover-card">
      <GridraHoverCard
        content={<GridraLabel>Controlled content</GridraLabel>}
        open={isOpen}
        onOpenChange={(next) => setIsOpen(next)}
      >
        <GridraButton>Info</GridraButton>
      </GridraHoverCard>
    </div>
  );
}

function ExampleGridraHoverCard3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-hover-card">
      <GridraHoverCard
        width="320px"
        minWidth="240px"
        maxHeight="40vh"
        content={<GridraLabel>Fixed-width preview content</GridraLabel>}
      >
        <GridraButton>Preview</GridraButton>
      </GridraHoverCard>
    </div>
  );
}

function ExampleGridraIconButton1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-icon-button">
      <GridraIconButton label="Preview" pressed size="sm">
        P
      </GridraIconButton>
      <GridraIconButton label="Add" variant="ghost">
        +
      </GridraIconButton>
      <GridraIconButton label="Refresh" loading size="lg" />
    </div>
  );
}

function ExampleGridraInput1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-input">
      <GridraInput aria-label="Small" defaultValue="Small" size="sm" />
      <GridraInput aria-label="Default" defaultValue="Default" />
      <GridraInput aria-label="Large" defaultValue="Large" size="lg" />
    </div>
  );
}

function ExampleGridraInput2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-input">
      <GridraInput
        aria-label="Invalid"
        defaultValue="Invalid"
        invalid
        size="lg"
      />
    </div>
  );
}

function ExampleGridraInput3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-input">
      <GridraInput label="Project name" placeholder="Untitled" />
    </div>
  );
}

function ExampleGridraInspectorPanel1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-inspector-panel">
      <GridraInspectorPanel />
    </div>
  );
}

function ExampleGridraInspectorPanel2() {
  const [node, setNode] = useState<GridraInspectorValue>({
    id: "a",
    label: "Node A",
    placement: { x: 1, y: 2, w: 3, h: 4 },
  });

  return (
    <div className="docs-example-content docs-example-content--gridra-inspector-panel">
      <GridraInspectorPanel
        selectedNode={node}
        onChange={(patch) =>
          setNode((previous) => ({
            ...previous,
            ...patch,
            placement: { ...previous.placement, ...patch.placement },
          }))
        }
      />
    </div>
  );
}

function ExampleGridraKbd1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-kbd">
      <GridraStack direction="horizontal" inline align="center" gap="xs">
        <GridraKbd>Ctrl</GridraKbd>
        <GridraKbd>K</GridraKbd>
      </GridraStack>
    </div>
  );
}

function ExampleGridraLabel1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-label">
      <GridraLabel>Properties</GridraLabel>
    </div>
  );
}

function ExampleGridraList1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-list">
      <GridraList
        items={["Import nodes", "Validate edges", "Publish layout"]}
      />
    </div>
  );
}

function ExampleGridraMenu1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-menu">
      <GridraBox
        border="default"
        padding="md"
        surface="input"
        style={{ width: 200 }}
      >
        <GridraMenu
          defaultActiveId="nodes"
          items={[
            { id: "nodes", label: "Nodes" },
            { id: "connections", label: "Connections" },
            { type: "separator" as const },
            { id: "preferences", label: "Preferences" },
          ]}
        />
      </GridraBox>
    </div>
  );
}

function ExampleGridraMenu2() {
  const items = menuItems;

  return (
    <div className="docs-example-content docs-example-content--gridra-menu">
      <GridraMenu
        items={items}
        renderItem={(item, state) => (
          <GridraStack
            direction="horizontal"
            inline
            align="center"
            gap="sm"
            fullWidth
            justify="between"
          >
            <span>{item.label}</span>
            {state.active ? (
              <GridraBadge size="sm" tone="accent">
                Active
              </GridraBadge>
            ) : null}
          </GridraStack>
        )}
      />
    </div>
  );
}

function ExampleGridraMenu3() {
  const items = menuItems;
  const [active, setActive] = useState<string | undefined>("dashboard");

  return (
    <div className="docs-example-content docs-example-content--gridra-menu">
      <GridraMenu
        items={items}
        activeId={active}
        onActiveIdChange={(next) => setActive(next)}
      />
    </div>
  );
}

function ExampleGridraMinimap1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-minimap">
      <GridraMinimap
        gridColumns={12}
        gridRows={6}
        nodes={[
          {
            id: "a",
            placement: { column: 2, row: 2, columnSpan: 4, rowSpan: 2 },
          },
          {
            id: "b",
            placement: { column: 8, row: 1, columnSpan: 3, rowSpan: 2 },
          },
        ]}
        selectedIds={["a"]}
        viewport={{ x: 1, y: 1, width: 6, height: 3 }}
      />
    </div>
  );
}

function ExampleGridraNode1() {
  const [selected, setSelected] = useState(false);

  const toggle = () => setSelected((current) => !current);

  return (
    <div className="docs-example-content docs-example-content--gridra-node">
      <GridraNode aria-pressed={selected} onClick={toggle}>
        Input
      </GridraNode>
    </div>
  );
}

function ExampleGridraNode2() {
  const [state, setState] = useState<
    GridraCanvasState<GridraCanvasNode & { label: string }>
  >({
    nodes: [
      {
        id: "source",
        label: "Source",
        placement: { column: 1, row: 1, columnSpan: 2 },
      },
      {
        id: "target",
        label: "Target",
        placement: { column: 4, row: 2, columnSpan: 2 },
      },
    ],
    connections: [],
    selectedIds: ["source"],
    selectedConnections: [],
  });
  const canvas = useGridraCanvas({
    state,
    onStateChange: setState,
    grid: { columns: 6, rows: 3 },
    interactions: { dragging: true, resizing: true, connecting: true },
  });
  const node = canvas.nodes[0];

  return (
    <div className="docs-example-content docs-example-content--gridra-node">
      <section
        {...canvas.getContainerProps({
          style: { height: 200, width: "100%", gap: 10, padding: 10 },
        })}
      >
        <GridraNode
          {...canvas.getNodeProps(node.id)}
          dragHandle={
            <GridraDragHandle {...canvas.getDragHandleProps(node.id)} />
          }
          resizeHandle={
            <GridraResizeHandle {...canvas.getResizeHandleProps(node.id)} />
          }
        >
          {node.label}
        </GridraNode>
        <GridraCanvasOverlay {...canvas.overlayProps} />
      </section>
    </div>
  );
}

function ExampleGridraPagination1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-pagination">
      <GridraPagination
        totalItems={150}
        defaultPage={1}
        defaultPageSize={25}
        onPageChange={(page, prev) => console.log("Page:", page)}
        onPageSizeChange={(size, prev) => console.log("PageSize:", size)}
      />
    </div>
  );
}

function ExampleGridraPagination2() {
  const items = Array.from({ length: 150 }, (_, id) => ({ id }));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  return (
    <div className="docs-example-content docs-example-content--gridra-pagination">
      <GridraPagination
        totalItems={items.length}
        page={page}
        pageSize={pageSize}
        onPageChange={(next) => setPage(next)}
        onPageSizeChange={(next) => {
          setPageSize(next);
          setPage(1);
        }}
      />
    </div>
  );
}

function ExampleGridraPagination3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-pagination">
      <GridraPagination
        totalItems={1000}
        pageSizeOptions={[5, 15, 30]}
        showFirstLast={false}
        showSummary={false}
        siblingCount={2}
        boundaryCount={2}
      />
    </div>
  );
}

function ExampleGridraPanel1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-panel">
      <GridraPanel heading="Tools" header={<GridraBadge>PRO</GridraBadge>}>
        <GridraLabel>Body content</GridraLabel>
      </GridraPanel>
    </div>
  );
}

function ExampleGridraPopover1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-popover">
      <GridraPopover
        content={
          <GridraStack gap="sm" style={{ minWidth: 160 }}>
            <GridraLabel>Options</GridraLabel>
            <GridraStack gap="xs">
              <GridraCheckbox label="Snap to grid" defaultChecked />
              <GridraCheckbox label="Show labels" />
            </GridraStack>
          </GridraStack>
        }
      >
        <GridraButton>Settings</GridraButton>
      </GridraPopover>
    </div>
  );
}

function ExampleGridraPopover2() {
  const [open, setOpen] = useState(false);

  return (
    <div className="docs-example-content docs-example-content--gridra-popover">
      <GridraPopover
        content={<GridraLabel>Controlled content</GridraLabel>}
        open={open}
        onOpenChange={(next) => setOpen(next)}
      >
        <GridraButton>Toggle</GridraButton>
      </GridraPopover>
    </div>
  );
}

function ExampleGridraPopover3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-popover">
      <GridraPopover content="Unreachable" disabled>
        <GridraButton>Disabled trigger</GridraButton>
      </GridraPopover>
    </div>
  );
}

function ExampleGridraProgress1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-progress">
      <GridraProgress label="Upload progress" value={65} />
    </div>
  );
}

function ExampleGridraProgress2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-progress">
      <GridraProgress label="Loading data" />
    </div>
  );
}

function ExampleGridraProgress3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-progress">
      <GridraProgress
        label="Disk usage"
        max={1024}
        size="lg"
        tone="warning"
        value={873}
      />
    </div>
  );
}

function ExampleGridraPropertiesPanel1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-properties-panel">
      <GridraPropertiesPanel />
    </div>
  );
}

function ExampleGridraPropertiesPanel2() {
  const [properties, setProperties] = useState<GridraNodePropertiesValue>({
    mode: "merge",
    intensity: 50,
  });

  const updateProperties = (patch: GridraPropertiesPatch) =>
    setProperties((previous) => {
      const next = { ...previous };
      for (const [id, value] of Object.entries(patch))
        if (value !== undefined) next[id] = value;

      return next;
    });

  const schema: GridraNodePropertiesSchema = {
    transform: [
      {
        id: "mode",
        label: "Mode",
        kind: "select",
        options: [
          { value: "merge", label: "Merge" },
          { value: "replace", label: "Replace" },
        ],
      },
      { id: "intensity", label: "Intensity", kind: "number", min: 0, max: 100 },
    ],
  };

  return (
    <div className="docs-example-content docs-example-content--gridra-properties-panel">
      <GridraPropertiesPanel
        selectedNodeId="node-1"
        selectedNodeType="transform"
        value={properties}
        schema={schema}
        onChange={updateProperties}
      />
    </div>
  );
}

function ExampleGridraRadio1() {
  const densityName = useId();

  return (
    <div className="docs-example-content docs-example-content--gridra-radio">
      <GridraRadio
        defaultChecked
        description="Dense controls"
        label="Compact"
        name={densityName}
        size="sm"
      />
      <GridraRadio
        description="More breathing room"
        label="Comfort"
        name={densityName}
        size="lg"
      />
    </div>
  );
}

function ExampleGridraResizeHandle1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-resize-handle">
      <GridraResizeHandle position="inline" />
    </div>
  );
}

function ExampleGridraSelect1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-select">
      <GridraSelect aria-label="Mode" defaultValue="select" size="sm">
        <option value="select">Select</option>
        <option value="pan">Pan</option>
      </GridraSelect>
    </div>
  );
}

function ExampleGridraSelectableGrid1() {
  const [selectedId, setSelectedId] = useState<string | null>("a");

  return (
    <div className="docs-example-content docs-example-content--gridra-selectable-grid">
      <GridraSelectableGrid
        columns={2}
        items={[
          { id: "a", label: "Input" },
          { id: "b", label: "Output" },
        ]}
        selectedId={selectedId}
        onSelectionChange={setSelectedId}
      />
    </div>
  );
}

function ExampleGridraSelectionBox1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-selection-box">
      <GridraSelectionBox rect={{ x: 8, y: 8, width: 120, height: 48 }} />
    </div>
  );
}

function ExampleGridraSelectionBox2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-selection-box">
      <GridraSelectionBox
        placement={{ column: 1, row: 1, columnSpan: 2, rowSpan: 1 }}
      />
    </div>
  );
}

function ExampleGridraSidebar1() {
  const [open, setOpen] = useState(true);

  return (
    <div className="docs-example-content docs-example-content--gridra-sidebar">
      <GridraSidebar
        side="left"
        open={open}
        onOpenChange={setOpen}
        width={260}
        collapsedWidth={0}
      >
        <GridraBox padding="sm" surface="input">
          Sidebar content
        </GridraBox>
      </GridraSidebar>
    </div>
  );
}

function ExampleGridraSidebar2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-sidebar">
      <GridraSidebar side="right" resizable minWidth={180} maxWidth={360}>
        <GridraBox padding="sm" surface="input">
          Inspector
        </GridraBox>
      </GridraSidebar>
    </div>
  );
}

function ExampleGridraSkeleton1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-skeleton">
      <GridraSkeleton height={120} width="100%" />
    </div>
  );
}

function ExampleGridraSkeleton2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-skeleton">
      <GridraSkeleton rows={4} variant="text" />
    </div>
  );
}

function ExampleGridraSkeleton3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-skeleton">
      <GridraSkeleton height={40} variant="circle" width={40} />
    </div>
  );
}

function ExampleGridraEmptyState1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-empty-state">
      <GridraEmptyState
        description="Create your first canvas to get started."
        heading="No canvases yet"
        icon={
          <svg
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M8 12h8m-4-4v8" />
          </svg>
        }
        primaryAction={<GridraButton>Create canvas</GridraButton>}
        secondaryAction={<GridraButton variant="ghost">Import</GridraButton>}
      />
    </div>
  );
}

function ExampleGridraEmptyState2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-empty-state">
      <GridraEmptyState
        description="This folder is empty."
        heading="No files"
      />
    </div>
  );
}

function ExampleGridraSlider1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-slider">
      <GridraSlider
        aria-label="Opacity"
        defaultValue="72"
        max={100}
        min={0}
        showValue
        size="lg"
        valueFormatter={(value) => `${value}%`}
      />
    </div>
  );
}

function ExampleGridraSnapGuide1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-snap-guide">
      <GridraSnapGuides
        guides={[
          { end: 72, orientation: "vertical", position: 48 },
          { end: 120, orientation: "horizontal", position: 36 },
        ]}
      />
    </div>
  );
}

function ExampleGridraSpinner1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-spinner">
      <GridraSpinner label="Loading small" size="sm" tone="muted" />
      <GridraSpinner label="Loading" />
      <GridraSpinner
        label="Loading large"
        size="lg"
        speed="slow"
        tone="accent"
      />
    </div>
  );
}

function ExampleGridraSplitPane1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-split-pane">
      <GridraSplitPane defaultSize={60} minSize={20} maxSize={80}>
        <GridraBox padding="sm" surface="input">
          Pane A
        </GridraBox>
        <GridraBox padding="sm" surface="input">
          Pane B
        </GridraBox>
      </GridraSplitPane>
    </div>
  );
}

function ExampleGridraSplitPane2() {
  const [size, setSize] = useState(50);

  return (
    <div className="docs-example-content docs-example-content--gridra-split-pane">
      <GridraSplitPane
        orientation="vertical"
        size={size}
        onSizeChange={setSize}
      >
        <GridraBox padding="sm" surface="input">
          Top
        </GridraBox>
        <GridraBox padding="sm" surface="input">
          Bottom
        </GridraBox>
      </GridraSplitPane>
    </div>
  );
}

function ExampleGridraSplitPane3() {
  const [sizes, setSizes] = useState([30, 40, 30]);

  return (
    <div className="docs-example-content docs-example-content--gridra-split-pane">
      <GridraSplitPane sizes={sizes} onSizesChange={setSizes}>
        <GridraBox padding="sm" surface="input">
          Pane A
        </GridraBox>
        <GridraBox padding="sm" surface="input">
          Pane B
        </GridraBox>
        <GridraBox padding="sm" surface="input">
          Pane C
        </GridraBox>
      </GridraSplitPane>
    </div>
  );
}

function ExampleGridraStack1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-stack">
      <GridraStack
        direction="horizontal"
        wrap
        align="center"
        gap="sm"
        rowGap="md"
      >
        <GridraBadge>One</GridraBadge>
        <GridraBadge>Two</GridraBadge>
      </GridraStack>
    </div>
  );
}

function ExampleGridraStack2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-stack">
      <GridraStack
        direction="horizontal"
        inline
        align="center"
        gap="sm"
        separator="/"
      >
        <span>First</span>
        <span>Second</span>
      </GridraStack>
    </div>
  );
}

function ExampleGridraStack3() {
  return (
    <div className="docs-example-content docs-example-content--gridra-stack">
      <GridraStack
        direction="horizontal"
        inline
        align="center"
        gap="sm"
        fullWidth
      >
        <span>Label</span>
        <GridraStackItem grow />
        <GridraBadge>Action</GridraBadge>
      </GridraStack>
    </div>
  );
}

function ExampleGridraStack4() {
  return (
    <div className="docs-example-content docs-example-content--gridra-stack">
      <GridraStack gap="sm" padding="sm" surface="raised" border="default">
        <GridraBadge size="sm">One</GridraBadge>
        <GridraBadge size="sm">Two</GridraBadge>
      </GridraStack>
    </div>
  );
}

function ExampleGridraStack5() {
  return (
    <div className="docs-example-content docs-example-content--gridra-stack">
      <GridraStack
        direction="horizontal"
        gap="md"
        justify="between"
        padding="sm"
        surface="input"
      >
        <GridraBadge size="sm">Left</GridraBadge>
        <GridraBadge size="sm">Right</GridraBadge>
      </GridraStack>
    </div>
  );
}

function ExampleGridraStack6() {
  return (
    <div className="docs-example-content docs-example-content--gridra-stack">
      <GridraStack align="center" justify="center" fullHeight>
        <GridraBadge>Centered</GridraBadge>
      </GridraStack>
    </div>
  );
}

function ExampleGridraStat1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-stat">
      <GridraStat label="Nodes" value="128" description="+12 since last run" />
    </div>
  );
}

function ExampleGridraSwitch1() {
  const [checked, setChecked] = useState(true);

  return (
    <div className="docs-example-content docs-example-content--gridra-switch">
      <GridraSwitch
        checked={checked}
        onCheckedChange={setChecked}
        description="Shows live editor state"
        label="Preview"
        size="lg"
      />
    </div>
  );
}

function ExampleGridraTabs1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-tabs">
      <GridraTabs
        items={[
          {
            id: "general",
            label: "General",
            content: <GridraBox padding="md">General settings</GridraBox>,
          },
          {
            id: "account",
            label: "Account",
            content: <GridraBox padding="md">Account settings</GridraBox>,
          },
          {
            id: "security",
            label: "Security",
            content: <GridraBox padding="md">Security settings</GridraBox>,
          },
        ]}
      />
    </div>
  );
}

function ExampleGridraTabs2() {
  const items = tabItems;
  const [tab, setTab] = useState("general");

  return (
    <div className="docs-example-content docs-example-content--gridra-tabs">
      <GridraTabs
        items={items}
        selectedId={tab}
        onSelectionChange={(next) => setTab(next)}
      />
    </div>
  );
}

function ExampleGridraTabs3() {
  const items = tabItems;

  return (
    <div className="docs-example-content docs-example-content--gridra-tabs">
      <GridraTabs items={items} activationMode="manual" variant="boxed" />
    </div>
  );
}

function ExampleGridraTextarea1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-textarea">
      <GridraTextarea aria-label="Notes" defaultValue="Small note" size="sm" />
      <GridraTextarea aria-label="Notes" defaultValue="Default note" />
      <GridraTextarea aria-label="Notes" defaultValue="Large note" size="lg" />
    </div>
  );
}

function ExampleGridraToast1() {
  const theme = useContext(ExampleThemeContext);

  return (
    <div className="docs-example-content docs-example-content--gridra-toast">
      <GridraToastProvider theme={theme}>
        <ExampleToastAction variant="basic" />
      </GridraToastProvider>
    </div>
  );
}

function ExampleGridraToast2() {
  const theme = useContext(ExampleThemeContext);

  return (
    <div className="docs-example-content docs-example-content--gridra-toast">
      <GridraToastProvider theme={theme}>
        <ExampleToastAction variant="duration" />
      </GridraToastProvider>
    </div>
  );
}

function ExampleGridraToast3() {
  const theme = useContext(ExampleThemeContext);

  return (
    <div className="docs-example-content docs-example-content--gridra-toast">
      <GridraToastProvider theme={theme}>
        <ExampleToastAction variant="queue" />
      </GridraToastProvider>
    </div>
  );
}

function ExampleGridraToast4() {
  const theme = useContext(ExampleThemeContext);

  return (
    <div className="docs-example-content docs-example-content--gridra-toast">
      <GridraToastProvider theme={theme} position="top">
        <ExampleToastAction variant="top" />
      </GridraToastProvider>
    </div>
  );
}

function ExampleGridraToolbar1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-toolbar">
      <GridraToolbar
        actions={[
          { id: "select", label: "Select", pressed: true },
          { id: "pan", label: "Pan" },
        ]}
      />
    </div>
  );
}

function ExampleGridraTooltip1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-tooltip">
      <GridraTooltip content="Helpful hint" placement="top">
        <GridraButton size="sm">Hover me</GridraButton>
      </GridraTooltip>
    </div>
  );
}

function ExampleGridraTooltip2() {
  return (
    <div className="docs-example-content docs-example-content--gridra-tooltip">
      <GridraTooltip
        content="Longer text with width control."
        placement="right"
        size="lg"
        maxWidth={280}
      >
        <GridraIconButton label="Info">i</GridraIconButton>
      </GridraTooltip>
    </div>
  );
}

function ExampleGridraTreeView1() {
  return (
    <div className="docs-example-content docs-example-content--gridra-tree-view">
      <GridraTreeView
        items={[
          {
            id: "src",
            label: "src",
            children: [
              {
                id: "components",
                label: "components",
                children: [{ id: "button", label: "Button.tsx" }],
              },
              { id: "index", label: "index.ts" },
            ],
          },
          {
            id: "public",
            label: "public",
            children: [{ id: "favicon", label: "favicon.ico" }],
          },
        ]}
      />
    </div>
  );
}

function ExampleGridraTreeView2() {
  const items = treeItems;
  const [expanded, setExpanded] = useState<string[]>([]);

  return (
    <div className="docs-example-content docs-example-content--gridra-tree-view">
      <GridraTreeView
        items={items}
        expandedIds={expanded}
        onExpandedIdsChange={setExpanded}
      />
    </div>
  );
}

function ExampleGridraTreeView3() {
  const items = treeItems;

  return (
    <div className="docs-example-content docs-example-content--gridra-tree-view">
      <GridraTreeView
        items={items}
        renderItem={(item, state) => (
          <GridraStack direction="horizontal" inline gap="sm" align="center">
            <span>{item.label}</span>
            {state.hasChildren ? (
              <GridraBadge size="sm">Group</GridraBadge>
            ) : null}
          </GridraStack>
        )}
      />
    </div>
  );
}

function ExampleGridraTreeView4() {
  const items = treeItems;

  return (
    <div className="docs-example-content docs-example-content--gridra-tree-view">
      <GridraTreeView
        items={items}
        renderItem={(item, state) => (
          <GridraStack direction="horizontal" inline align="center" gap="xs">
            {!state.hasChildren ? <span>-</span> : null}
            <span>{item.label}</span>
          </GridraStack>
        )}
      />
    </div>
  );
}

function ExampleuseGridraCanvas1() {
  const [state, setState] = useState<
    GridraCanvasState<GridraCanvasNode & { label: string }>
  >({
    nodes: [
      {
        id: "source",
        label: "Source",
        placement: { column: 1, row: 1, columnSpan: 2 },
      },
      {
        id: "target",
        label: "Target",
        placement: { column: 4, row: 2, columnSpan: 2 },
      },
    ],
    connections: [],
    selectedIds: ["source"],
    selectedConnections: [],
  });
  const canvas = useGridraCanvas({ state, onStateChange: setState });

  return (
    <div className="docs-example-content docs-example-content--use-gridra-canvas">
      <section
        {...canvas.getContainerProps({ style: { height: 300, gap: 10 } })}
      >
        {canvas.nodes.map((node) => (
          <button key={node.id} {...canvas.getNodeProps(node.id)}>
            {node.label}
          </button>
        ))}
        <GridraCanvasOverlay {...canvas.overlayProps} />
      </section>
    </div>
  );
}

function ExampleHeadlessTabs() {
  const tabs = useGridraTabs({
    items: [
      { id: "overview", label: "Overview", content: "Custom overview" },
      { id: "details", label: "Details", content: "Custom details" },
    ],
  });

  return (
    <article>
      <div {...tabs.getTabListProps({ "aria-label": "Custom tabs" })}>
        {tabs.items.map((item) => (
          <button key={item.id} {...tabs.getTabProps(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      {tabs.selectedItem ? (
        <section {...tabs.getPanelProps(tabs.selectedItem.id)}>
          {tabs.selectedItem.content}
        </section>
      ) : null}
    </article>
  );
}

function ExampleHeadlessAccordion() {
  const accordion = useGridraAccordion({
    collapsible: true,
    items: [
      { id: "general", title: "General", content: "Custom general content" },
      { id: "account", title: "Account", content: "Custom account content" },
    ],
  });

  return (
    <article>
      {accordion.items.map((item) => (
        <section key={item.id}>
          <h3>
            <button {...accordion.getTriggerProps(item.id)}>
              {item.title}
            </button>
          </h3>
          <div {...accordion.getPanelProps(item.id)}>{item.content}</div>
        </section>
      ))}
    </article>
  );
}

function ExampleHeadlessGridraSelectableGrid() {
  const grid = useGridraSelectableGrid({ items: [{ id: "A" }, { id: "B" }] });

  return (
    <section>
      {grid.items.map((item) => (
        <button key={item.id} {...grid.getItemProps(item.id)}>
          {item.id}
        </button>
      ))}
    </section>
  );
}

function ExampleHeadlessGridraPagination() {
  const pagination = useGridraPagination({
    totalItems: 100,
    defaultPageSize: 10,
  });

  return (
    <nav aria-label="Custom pages">
      <output>Page {pagination.currentPage}</output>
      <button
        disabled={pagination.isLastPage}
        onClick={() => pagination.goToPage(pagination.currentPage + 1)}
      >
        Next
      </button>
    </nav>
  );
}

function ExampleHeadlessGridraStepper() {
  const stepper = useGridraStepper({
    items: [
      { id: "first", label: "First" },
      { id: "last", label: "Last" },
    ],
    defaultCurrentId: "last",
  });

  return (
    <nav aria-label="Custom steps">
      {stepper.steps.map((step) => (
        <button key={step.item.id} {...stepper.getStepProps(step.item.id)}>
          {step.item.label}
        </button>
      ))}
    </nav>
  );
}

function ExampleHeadlessGridraMenu() {
  const menu = useGridraMenu({
    items: [
      { id: "a", label: "A" },
      { id: "b", label: "B" },
    ],
  });

  return (
    <nav {...menu.getRootProps()} aria-label="Custom navigation">
      {menu.items.filter(menu.isCommand).map((item) => (
        <button key={item.id} {...menu.getItemProps(item.id)}>
          {item.label}
        </button>
      ))}
    </nav>
  );
}

function ExampleHeadlessGridraTreeView() {
  const tree = useGridraTreeView({
    items: [
      {
        id: "parent",
        label: "Parent",
        children: [{ id: "child", label: "Child" }],
      },
    ],
  });

  return (
    <div role="tree">
      {tree.flatItems.map((row) => (
        <div
          key={row.key}
          role="treeitem"
          aria-expanded={
            row.hasChildren ? tree.expandedSet.has(row.item.id) : undefined
          }
        >
          <div {...tree.getRowProps(row.item, row.hasChildren)}>
            {row.item.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExampleHeadlessGridraSidebar() {
  const sidebar = useGridraSidebar({ defaultOpen: true, resizable: true });

  return (
    <aside>
      <button aria-expanded={sidebar.currentOpen} onClick={sidebar.toggleOpen}>
        Toggle
      </button>
      <div hidden={!sidebar.currentOpen}>Custom sidebar content</div>
      <div
        {...sidebar.getSeparatorProps()}
        aria-label="Resize custom sidebar"
      />
    </aside>
  );
}

function ExampleHeadlessGridraSplitPane() {
  const split = useGridraSplitPane({ defaultSize: 50 });

  return (
    <section {...split.getContainerProps()}>
      <output>First pane {split.effectiveSizes[0]}%</output>
      <div {...split.getSeparatorProps(0)} aria-label="Custom separator" />
    </section>
  );
}

function ExampleHeadlessGridraPopover() {
  const popover = useGridraPopover();

  return (
    <section>
      <button {...popover.getTriggerProps()}>Open custom popover</button>
      {popover.currentOpen ? (
        <div {...popover.getContentProps()}>Custom popover content</div>
      ) : null}
    </section>
  );
}

function ExampleHeadlessGridraTooltip() {
  const tooltip = useGridraTooltip({ showDelay: 0 });

  return (
    <section>
      <button {...tooltip.getTriggerProps()}>Custom help</button>
      {tooltip.currentOpen ? (
        <div {...tooltip.getContentProps()}>Custom tooltip content</div>
      ) : null}
    </section>
  );
}

function ExampleHeadlessGridraHoverCard() {
  const card = useGridraHoverCard({ showDelay: 0, hideDelay: 0 });

  return (
    <section>
      <button {...card.getTriggerProps()}>Custom hover card</button>
      {card.currentOpen ? (
        <div {...card.getContentProps()} aria-label="Custom card">
          Custom card content
        </div>
      ) : null}
    </section>
  );
}

function ExampleHeadlessGridraDialog() {
  const dialog = useGridraDialog();

  return (
    <section>
      <button {...dialog.getTriggerProps()}>Open custom dialog</button>
      {dialog.currentOpen ? (
        <div {...dialog.getBackdropProps()}>
          <div {...dialog.getDialogProps()}>
            <h2 id={dialog.titleId}>Custom dialog</h2>
            <button {...dialog.getCloseProps()}>Close custom dialog</button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ExampleHeadlessGridraDropdownMenu() {
  const menu = useGridraDropdownMenu({ items: [{ id: "a", label: "Action" }] });

  return (
    <section>
      <button {...menu.getTriggerProps()}>Open custom menu</button>
      {menu.currentOpen ? (
        <div {...menu.getMenuProps()}>
          <button {...menu.getItemProps("a")}>Action</button>
        </div>
      ) : null}
    </section>
  );
}

function ExampleHeadlessGridraContextMenu() {
  const menu = useGridraContextMenu({ items: [{ id: "a", label: "Action" }] });

  return (
    <section>
      <button {...menu.getTargetProps()}>Custom context target</button>
      {menu.currentOpen ? (
        <div {...menu.getMenuProps()}>
          <button {...menu.getItemProps("a")}>Action</button>
        </div>
      ) : null}
    </section>
  );
}

function ExampleHeadlessGridraCommandPalette() {
  const palette = useGridraCommandPalette({
    items: [
      { id: "one", label: "First command" },
      { id: "two", label: "Second command" },
    ],
  });

  return (
    <section>
      <button onClick={() => palette.setOpen(true)}>Open custom palette</button>
      {palette.currentOpen ? (
        <div {...palette.getDialogProps()}>
          <h2 id={palette.titleId}>Custom commands</h2>
          <input
            {...palette.getInputProps({ "aria-label": "Search commands" })}
          />
          {palette.filteredCommands.map((item) => (
            <button key={item.id} {...palette.getItemProps(item.id)}>
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function ExampleHeadlessGridraToast() {
  const toast = useGridraToastQueue();

  return (
    <section>
      <button onClick={() => toast.show("Custom notification")}>
        Show custom toast
      </button>
      {toast.currentToast ? (
        <output role={toast.currentToast.options.role}>
          {toast.currentToast.message}
          <button onClick={toast.dismiss}>Dismiss</button>
        </output>
      ) : null}
    </section>
  );
}

function ExampleHeadlessGridraField() {
  const field = useGridraField({ hasHint: true, required: true });

  return (
    <section>
      <label {...field.labelProps}>Custom field</label>
      <input {...field.controlProps} />
      <p {...field.hintProps}>A helpful description</p>
    </section>
  );
}

function ExampleHeadlessGridraCheckbox() {
  const control = useGridraCheckbox({ hasDescription: true });

  return (
    <section>
      <label>
        <input {...control.inputProps} />
        Custom checkbox
      </label>
      <p {...control.descriptionProps}>Custom description</p>
    </section>
  );
}

function ExampleHeadlessGridraRadio() {
  const control = useGridraRadio({ hasDescription: true });

  return (
    <section>
      <label>
        <input {...control.inputProps} />
        Custom radio
      </label>
      <p {...control.descriptionProps}>Custom description</p>
    </section>
  );
}

export const examplePreviews: Record<string, Record<string, ReactNode>> = {
  "GridraAccordion": {
    "Custom markup with headless hook": <ExampleHeadlessAccordion />,
    "Default single accordion": <ExampleGridraAccordion1 />,
    "Multiple mode with controlled value": <ExampleGridraAccordion2 />,
    "Collapsible single mode": <ExampleGridraAccordion3 />,
  },
  "GridraAlert": {
    "Toast-style alert": <ExampleGridraAlert1 />,
    "Danger toast with action": <ExampleGridraAlert2 />,
    "All tones": <ExampleGridraAlert3 />,
  },
  "GridraAvatar": {
    "Image avatars": <ExampleGridraAvatar1 />,
    "Fallback and custom size": <ExampleGridraAvatar2 />,
  },
  "GridraBadge": {
    "Metadata labels (formerly GridraTag)": <ExampleGridraBadge1 />,
    "Tones": <ExampleGridraBadge2 />,
    "Shapes": <ExampleGridraBadge3 />,
  },
  "GridraBreadcrumb": {
    "Basic breadcrumb": <ExampleGridraBreadcrumb1 />,
    "With maxItems collapse": <ExampleGridraBreadcrumb2 />,
    "Validated parentId chain": <ExampleGridraBreadcrumb3 />,
  },
  "GridraButton": {
    "Sizes": <ExampleGridraButton1 />,
    "Variants and states": <ExampleGridraButton2 />,
  },
  "GridraCanvasOverlay": {
    "Explicit overlay placement": <ExampleGridraCanvasOverlay1 />,
  },
  "GridraCard": {
    "Summary card": <ExampleGridraCard1 />,
  },
  "GridraCheckbox": {
    "With label and description": <ExampleGridraCheckbox1 />,
  },
  "GridraCommandPalette": {
    "Basic command palette": <ExampleGridraCommandPalette1 />,
    "Controlled with trigger": <ExampleGridraCommandPalette2 />,
  },
  "GridraConnectionHandle": {
    "Input and output": <ExampleGridraConnectionHandle1 />,
  },
  "GridraContextMenu": {
    "Basic context menu": <ExampleGridraContextMenu1 />,
    "With disabled item": <ExampleGridraContextMenu2 />,
  },
  "GridraDescriptionList": {
    "Metadata pairs": <ExampleGridraDescriptionList1 />,
  },
  "GridraDialog": {
    "Basic trigger dialog": <ExampleGridraDialog1 />,
    "Controlled dialog": <ExampleGridraDialog2 />,
    "Fullscreen dialog": <ExampleGridraDialog3 />,
  },
  "GridraDivider": {
    "Horizontal dividers": <ExampleGridraDivider1 />,
    "Vertical divider": <ExampleGridraDivider2 />,
  },
  "GridraDragHandle": {
    "Default grip": <ExampleGridraDragHandle1 />,
  },
  "GridraDropdownMenu": {
    "Basic command menu": <ExampleGridraDropdownMenu1 />,
    "With disabled item": <ExampleGridraDropdownMenu2 />,
  },
  "GridraErrorMessage": {
    "Basic danger error": <ExampleGridraErrorMessage1 />,
    "Warning validation": <ExampleGridraErrorMessage2 />,
    "With alert role": <ExampleGridraErrorMessage3 />,
  },
  "GridraStatusIndicator": {
    "Basic statuses": <ExampleGridraStatusIndicator1 />,
    "Expanding ring for syncing": <ExampleGridraStatusIndicator2 />,
    "Dot-only": <ExampleGridraStatusIndicator3 />,
  },
  "GridraField": {
    "Automatic label and state wiring": <ExampleGridraField1 />,
    "Vertical field with hint": <ExampleGridraField2 />,
    "Horizontal field with error": <ExampleGridraField3 />,
  },
  "GridraGridLayout": {
    "Auto-fit card grid": <ExampleGridraGridLayout1 />,
    "Fixed 2-column form": <ExampleGridraGridLayout2 />,
    "Independent row and column gaps": <ExampleGridraGridLayout3 />,
  },
  "GridraHoverCard": {
    "Basic hover card": <ExampleGridraHoverCard1 />,
    "Controlled hover card": <ExampleGridraHoverCard2 />,
    "Sized hover card": <ExampleGridraHoverCard3 />,
  },
  "GridraIconButton": {
    "Icon buttons": <ExampleGridraIconButton1 />,
  },
  "GridraInput": {
    "Sizes": <ExampleGridraInput1 />,
    "Invalid state": <ExampleGridraInput2 />,
    "Labeled input": <ExampleGridraInput3 />,
  },
  "GridraInspectorPanel": {
    "Empty state": <ExampleGridraInspectorPanel1 />,
    "Editing a selected node": <ExampleGridraInspectorPanel2 />,
  },
  "GridraKbd": {
    "Shortcut hint": <ExampleGridraKbd1 />,
  },
  "GridraLabel": {
    "Basic label": <ExampleGridraLabel1 />,
  },
  "GridraList": {
    "Simple items": <ExampleGridraList1 />,
  },
  "GridraMenu": {
    "Sidebar menu pattern": <ExampleGridraMenu1 />,
    "Custom row content": <ExampleGridraMenu2 />,
    "Controlled active state": <ExampleGridraMenu3 />,
  },
  "GridraMinimap": {
    "Minimap overview": <ExampleGridraMinimap1 />,
  },
  "GridraNode": {
    "Standalone": <ExampleGridraNode1 />,
    "Hook bindings": <ExampleGridraNode2 />,
  },
  "GridraPagination": {
    "Custom markup with headless hook": <ExampleHeadlessGridraPagination />,
    "Basic uncontrolled pagination": <ExampleGridraPagination1 />,
    "Controlled pagination": <ExampleGridraPagination2 />,
    "Custom page size options and hidden controls": (
      <ExampleGridraPagination3 />
    ),
  },
  "GridraPanel": {
    "Panel with header": <ExampleGridraPanel1 />,
  },
  "GridraPopover": {
    "Basic popover": <ExampleGridraPopover1 />,
    "Controlled popover": <ExampleGridraPopover2 />,
    "Disabled popover": <ExampleGridraPopover3 />,
  },
  "GridraProgress": {
    "Determinate": <ExampleGridraProgress1 />,
    "Indeterminate": <ExampleGridraProgress2 />,
    "With tone and size": <ExampleGridraProgress3 />,
  },
  "GridraPropertiesPanel": {
    "Empty state": <ExampleGridraPropertiesPanel1 />,
    "Editing properties for a transform node": (
      <ExampleGridraPropertiesPanel2 />
    ),
  },
  "GridraRadio": {
    "Radio group": <ExampleGridraRadio1 />,
  },
  "GridraResizeHandle": {
    "Corner handle": <ExampleGridraResizeHandle1 />,
  },
  "GridraSelect": {
    "Basic select": <ExampleGridraSelect1 />,
  },
  "GridraSelectableGrid": {
    "Custom markup with headless hook": <ExampleHeadlessGridraSelectableGrid />,
    "Selectable grid": <ExampleGridraSelectableGrid1 />,
  },
  "GridraSelectionBox": {
    "Pixel rect": <ExampleGridraSelectionBox1 />,
    "Grid placement": <ExampleGridraSelectionBox2 />,
  },
  "GridraSidebar": {
    "Controlled left sidebar": <ExampleGridraSidebar1 />,
    "Right resizable sidebar": <ExampleGridraSidebar2 />,
  },
  "GridraSkeleton": {
    "Block": <ExampleGridraSkeleton1 />,
    "Text rows": <ExampleGridraSkeleton2 />,
    "Circle": <ExampleGridraSkeleton3 />,
  },
  "GridraEmptyState": {
    "With icon and action": <ExampleGridraEmptyState1 />,
    "Minimal": <ExampleGridraEmptyState2 />,
  },
  "GridraSlider": {
    "Slider with value": <ExampleGridraSlider1 />,
  },
  "GridraSnapGuide": {
    "Multiple guides": <ExampleGridraSnapGuide1 />,
  },
  "GridraSpinner": {
    "Sizes and tones": <ExampleGridraSpinner1 />,
  },
  "GridraSplitPane": {
    "Horizontal split": <ExampleGridraSplitPane1 />,
    "Vertical controlled split": <ExampleGridraSplitPane2 />,
    "Three-pane controlled split": <ExampleGridraSplitPane3 />,
  },
  "GridraStack": {
    "Wrapping group (formerly Cluster)": <ExampleGridraStack1 />,
    "Inline separators (formerly Inline)": <ExampleGridraStack2 />,
    "Trailing action": <ExampleGridraStack3 />,
    "Vertical stack": <ExampleGridraStack4 />,
    "Horizontal with justify between": <ExampleGridraStack5 />,
    "Centered alignment": <ExampleGridraStack6 />,
  },
  "GridraStat": {
    "Metric row": <ExampleGridraStat1 />,
  },
  "GridraSwitch": {
    "Switch with label": <ExampleGridraSwitch1 />,
  },
  "GridraTabs": {
    "Custom markup with headless hook": <ExampleHeadlessTabs />,
    "Basic horizontal tabs": <ExampleGridraTabs1 />,
    "Controlled tabs": <ExampleGridraTabs2 />,
    "Boxed variant with manual activation": <ExampleGridraTabs3 />,
  },
  "GridraTextarea": {
    "Textarea sizes": <ExampleGridraTextarea1 />,
  },
  "GridraToast": {
    "Basic toast": <ExampleGridraToast1 />,
    "With custom duration": <ExampleGridraToast2 />,
    "Quick burst (queued)": <ExampleGridraToast3 />,
    "Position at top": <ExampleGridraToast4 />,
  },
  "GridraToolbar": {
    "Action toolbar": <ExampleGridraToolbar1 />,
  },
  "GridraTooltip": {
    "Basic tooltip": <ExampleGridraTooltip1 />,
    "Custom width": <ExampleGridraTooltip2 />,
  },
  "GridraTreeView": {
    "Basic nested tree": <ExampleGridraTreeView1 />,
    "With controlled expand": <ExampleGridraTreeView2 />,
    "Custom row content": <ExampleGridraTreeView3 />,
    "Leaf marker prefix": <ExampleGridraTreeView4 />,
  },
  "useGridraCanvas": {
    "Your own container and buttons": <ExampleuseGridraCanvas1 />,
  },
};

examplePreviews["GridraStepper"] = {
  ...examplePreviews["GridraStepper"],
  "Custom markup with headless hook": <ExampleHeadlessGridraStepper />,
};

examplePreviews["GridraMenu"] = {
  ...examplePreviews["GridraMenu"],
  "Custom markup with headless hook": <ExampleHeadlessGridraMenu />,
};

examplePreviews["GridraTreeView"] = {
  ...examplePreviews["GridraTreeView"],
  "Custom markup with headless hook": <ExampleHeadlessGridraTreeView />,
};

examplePreviews["GridraSidebar"] = {
  ...examplePreviews["GridraSidebar"],
  "Custom markup with headless hook": <ExampleHeadlessGridraSidebar />,
};

examplePreviews["GridraSplitPane"] = {
  ...examplePreviews["GridraSplitPane"],
  "Custom markup with headless hook": <ExampleHeadlessGridraSplitPane />,
};

examplePreviews["GridraPopover"] = {
  ...examplePreviews["GridraPopover"],
  "Custom markup with headless hook": <ExampleHeadlessGridraPopover />,
};

examplePreviews["GridraTooltip"] = {
  ...examplePreviews["GridraTooltip"],
  "Custom markup with headless hook": <ExampleHeadlessGridraTooltip />,
};

examplePreviews["GridraHoverCard"] = {
  ...examplePreviews["GridraHoverCard"],
  "Custom markup with headless hook": <ExampleHeadlessGridraHoverCard />,
};

examplePreviews["GridraDialog"] = {
  ...examplePreviews["GridraDialog"],
  "Custom markup with headless hook": <ExampleHeadlessGridraDialog />,
};

examplePreviews["GridraDropdownMenu"] = {
  ...examplePreviews["GridraDropdownMenu"],
  "Custom markup with headless hook": <ExampleHeadlessGridraDropdownMenu />,
};

examplePreviews["GridraContextMenu"] = {
  ...examplePreviews["GridraContextMenu"],
  "Custom markup with headless hook": <ExampleHeadlessGridraContextMenu />,
};

examplePreviews["GridraCommandPalette"] = {
  ...examplePreviews["GridraCommandPalette"],
  "Custom markup with headless hook": <ExampleHeadlessGridraCommandPalette />,
};

examplePreviews["GridraToast"] = {
  ...examplePreviews["GridraToast"],
  "Custom markup with headless hook": <ExampleHeadlessGridraToast />,
};

examplePreviews["GridraField"] = {
  ...examplePreviews["GridraField"],
  "Custom markup with headless hook": <ExampleHeadlessGridraField />,
};

examplePreviews["GridraCheckbox"] = {
  ...examplePreviews["GridraCheckbox"],
  "Custom markup with headless hook": <ExampleHeadlessGridraCheckbox />,
};

examplePreviews["GridraRadio"] = {
  ...examplePreviews["GridraRadio"],
  "Custom markup with headless hook": <ExampleHeadlessGridraRadio />,
};
