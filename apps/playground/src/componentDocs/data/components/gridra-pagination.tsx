import { GridraBox, GridraPagination } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";

export const paginationDoc: ComponentDoc = {
    category: "Navigation",
    name: "GridraPagination",
    summary: "Button-based pagination with page controls, page size selection, and item range summary.",
    description:
      "GridraPagination renders a navigation landmark with page buttons, first/previous/next/last controls, an optional page size selector, and summary text. It supports controlled and uncontrolled modes for both page and pageSize, generates page ranges with sibling/boundary-aware ellipsis, and normalizes invalid numeric props to safe display values without throwing errors.",
    importExample: 'import { GridraPagination } from "@gridra-ui/react";',
    props: [
      { name: "page", type: "number", description: "Controlled current page (1-based)." },
      { name: "defaultPage", type: "number", default: "1", description: "Initial page when uncontrolled." },
      { name: "onPageChange", type: "(next: number, previous: number) => void", description: "Callback when page changes via user interaction." },
      { name: "pageSize", type: "number", description: "Controlled items per page." },
      { name: "defaultPageSize", type: "number", default: "25", description: "Initial page size when uncontrolled." },
      { name: "onPageSizeChange", type: "(next: number, previous: number) => void", description: "Callback when page size changes." },
      { name: "totalItems", type: "number", default: "0", description: "Total number of items. 0, negatives, NaN, and Infinity are sanitized to 0. Decimals are floored." },
      { name: "pageSizeOptions", type: "number[]", default: "[10, 25, 50, 100]", description: "Available page size choices. Invalid entries are filtered; if empty, falls back to default." },
      { name: "siblingCount", type: "number", default: "1", description: "Number of page buttons shown on each side of the current page." },
      { name: "boundaryCount", type: "number", default: "1", description: "Number of page buttons always shown at the start and end." },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size variant for buttons and spacing." },
      { name: "showFirstLast", type: "boolean", default: "true", description: "Whether to show first and last page buttons." },
      { name: "showPageSize", type: "boolean", default: "true", description: "Whether to show the page size selector." },
      { name: "showSummary", type: "boolean", default: "true", description: 'Whether to show the item count summary, for example "1-25 of 100".' },
      { name: "disabled", type: "boolean", default: "false", description: "Disables all buttons and the page size selector." },
      { name: "aria-label", type: "string", default: '"Pagination"', description: "Accessible label for the navigation landmark." },
    ],
    options: [
      "sizes: sm | md | lg",
      "controlled or uncontrolled page",
      "controlled or uncontrolled pageSize",
      "showFirstLast, showPageSize, showSummary toggles",
      "siblingCount and boundaryCount for page range control",
      "custom pageSizeOptions array",
    ],
    features: [
      "Rendered as nav with configurable aria-label.",
      "Page buttons use aria-current='page' on the active page.",
      "First/previous buttons disable on first page; next/last disable on last page.",
      "Ellipsis slots rendered as aria-hidden spans when page range has gaps.",
      "Page size selector includes the current value even if absent from pageSizeOptions.",
      "Page resets to 1 automatically when pageSize changes.",
      "Numeric props are normalized before display: invalid pages clamp to the valid page range, invalid totals become 0, invalid page sizes fall back to 25, and decimals are floored.",
      "disabled prop disables all interactive elements.",
      "Zero totalItems renders gracefully with page 1, disabled boundaries, and 'No items' summary.",
    ],
    usage: "Use GridraPagination at the bottom of data tables, lists, or card grids to let users navigate through large datasets. Pair it with a backend or client-side pagination handler that reacts to onPageChange and onPageSizeChange callbacks. For simple use cases, pass totalItems and defaultPageSize; for controlled scenarios, provide page and pageSize with their callbacks.",
    avoid: "GridraPagination v1 is button-based only. Link-based pagination for SEO or URL-driven navigation is not supported in this version. It does not handle data fetching internally; callbacks must be wired to your data layer.",
    compositions: [
      "GridraPagination + data table: pagination footer.",
      "GridraPagination + GridraBox/GridraStack: layout within a card or toolbar.",
    ],
    examples: [
      {
        title: "Basic uncontrolled pagination",
        code: `<GridraPagination
  totalItems={150}
  defaultPage={1}
  defaultPageSize={25}
  onPageChange={(page, prev) => console.log("Page:", page)}
  onPageSizeChange={(size, prev) => console.log("PageSize:", size)}
/>`,
      },
      {
        title: "Controlled pagination",
        code: `const [page, setPage] = useState(1);
const [pageSize, setPageSize] = useState(25);

<GridraPagination
  totalItems={items.length}
  page={page}
  pageSize={pageSize}
  onPageChange={(next) => setPage(next)}
  onPageSizeChange={(next) => { setPageSize(next); setPage(1); }}
/>`,
      },
      {
        title: "Custom page size options and hidden controls",
        code: `<GridraPagination
  totalItems={1000}
  pageSizeOptions={[5, 15, 30]}
  showFirstLast={false}
  showSummary={false}
  siblingCount={2}
  boundaryCount={2}
/>`,
      },
    ],
    preview: (
      <GridraBox padding="md">
        <GridraPagination
          totalItems={245}
          defaultPage={3}
          defaultPageSize={25}
        />
      </GridraBox>
    ),
    accessibility:
      "Root element is a nav with aria-label='Pagination'. Each page button has aria-label='Page N' and the current page gets aria-current='page'. Previous/next/first/last buttons have descriptive aria-labels. Ellipsis indicators are aria-hidden='true'. The page size selector is a native select element. Boundary buttons are disabled when at the first or last page.",
  };
