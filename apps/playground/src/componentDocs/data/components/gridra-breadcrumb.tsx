import { GridraBox, GridraBreadcrumb } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const breadcrumbDoc: ComponentDoc = {
    category: "Navigation",
    name: "GridraBreadcrumb",
    summary: "Hierarchical path indicator using items with href, supporting current/disabled states and optional parentId validation.",
    description:
      "GridraBreadcrumb renders a breadcrumb trail as an ordered list inside a navigation landmark. Items can be links (href), current page indicators, or disabled entries. An optional maxItems prop collapses long trails with an ellipsis. When items carry parentId, the component validates that each item chains from the previous one and reports issues via onHierarchyInvalid.",
    importExample: 'import { GridraBreadcrumb } from "@gridra-ui/react";',
    props: [
      { name: "items", type: "GridraBreadcrumbItem[]", required: true, description: "Array of { id, label, href?, current?, disabled?, parentId? }." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Font size of breadcrumb items." },
      { name: "separator", type: "ReactNode", default: '"/"', description: "Visual separator between items." },
      { name: "maxItems", type: "number", description: "Maximum visible items before collapsing middle with ellipsis. Clamped to minimum 3." },
      { name: "onHierarchyInvalid", type: "(issues: GridraBreadcrumbHierarchyIssue[]) => void", description: "Called when parentId validation detects broken or missing parent references." },
      { name: "aria-label", type: "string", default: '"Breadcrumb"', description: "Accessible label for the nav landmark." },
    ],
    options: [
      "sizes: sm | md | lg",
      "custom separator via ReactNode",
      "maxItems collapse with ellipsis",
      "optional parentId hierarchy validation",
    ],
    features: [
      "Rendered as nav with aria-label and ol/li structure.",
      "Items with href render as anchor links. Items without href render as spans.",
      "current items get aria-current='page' and no link.",
      "disabled items get a disabled class and no link.",
      "Separator is aria-hidden and only rendered between items.",
      "maxItems collapses excess items: first item + ellipsis + tail items.",
      "Hierarchy validation triggers onHierarchyInvalid and sets data-gridra-invalid-hierarchy on the nav.",
    ],
    usage: "Use GridraBreadcrumb to show the user's location within a hierarchical structure. Pass an array of trail items in order from root to leaf. For simple flat trails, omit parentId. For validated hierarchy, include parentId on each non-root item pointing to the previous item's id.",
    avoid: "GridraBreadcrumb does not compute paths from a tree structure automatically. Pass the trail in display order. It does not integrate with client-side routers (use href for plain links, or wrap with your router's Link component).",
    examples: [
      {
        title: "Basic breadcrumb",
        code: `<GridraBreadcrumb
  items={[
    { id: "home", label: "Home", href: "/" },
    { id: "projects", label: "Projects", href: "/projects" },
    { id: "detail", label: "My Project", current: true },
  ]}
/>`,
      },
      {
        title: "With maxItems collapse",
        code: `<GridraBreadcrumb
  maxItems={4}
  items={[
    { id: "home", label: "Home", href: "/" },
    { id: "a", label: "Category", href: "/category" },
    { id: "b", label: "Subcategory", href: "/category/sub" },
    { id: "c", label: "Item", href: "/category/sub/item" },
    { id: "d", label: "Details", href: "/category/sub/item/details" },
    { id: "detail", label: "Edit", current: true },
  ]}
/>`,
      },
      {
        title: "Validated parentId chain",
        code: `<GridraBreadcrumb
  items={[
    { id: "home", label: "Home", href: "/" },
    { id: "projects", label: "Projects", href: "/projects", parentId: "home" },
    { id: "detail", label: "Detail", href: "/projects/1", current: true, parentId: "projects" },
  ]}
  onHierarchyInvalid={(issues) => console.warn(issues)}
/>`,
      },
    ],
    preview: (
      <GridraBox padding="md">
        <GridraBreadcrumb
          items={[
            { id: "home", label: "Home", href: "#" },
            { id: "projects", label: "Projects", href: "#" },
            { id: "nested", label: "Nested", href: "#", parentId: "projects" },
            { id: "current", label: "Current Page", current: true, parentId: "nested" },
          ]}
        />
      </GridraBox>
    ),
    accessibility:
      "Root element is a nav with aria-label='Breadcrumb' (customizable). Items are ol > li. Current page has aria-current='page'. Separators have aria-hidden='true'. When hierarchy is invalid, data-gridra-invalid-hierarchy='true' is set on the nav. Links are standard anchor elements.",
  };
