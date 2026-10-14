import { GridraTimeline } from "@gridra-ui/react";
import type { ComponentDoc } from "../../types";
import { TimelineExample } from "./timeline-example";
import timelineExampleSource from "./timeline-example.tsx?raw";

function exampleCode(orientation: "vertical" | "horizontal") {
  return `${timelineExampleSource.trimEnd()}

export default function Example() {
  return <TimelineExample orientation="${orientation}" />;
}
`;
}

const undatedItems = [
  { id: "design", title: "Design", description: "Research the problem and define the interface." },
  { id: "build", title: "Build", description: "Implement and share the project." },
];
const undatedCode = `import { GridraTimeline } from "@gridra-ui/react";

export default function Example() {
  return <GridraTimeline
  aria-label="Project milestones"
  size="sm"
  items={[
    { id: "design", title: "Design", description: "Research the problem and define the interface." },
    { id: "build", title: "Build", description: "Implement and share the project." },
  ]}
/>;
}`;

export const timelineDoc: ComponentDoc = {
  category: "Display",
  name: "GridraTimeline",
  summary: "Read-only chronological entries for portfolio history, career milestones, and project activity.",
  description: "GridraTimeline displays an ordered list of dates, titles, and descriptions connected by a rail and square markers. It defaults to vertical orientation and keeps the supplied item order. Descriptions can include paragraphs, lists, and links. It does not infer completed/current/pending states or turn entries into buttons.",
  importExample: 'import { GridraTimeline } from "@gridra-ui/react";',
  props: [
    { name: "items", type: "readonly GridraTimelineItem[]", required: true, description: "Entries with a stable unique id, title, optional description, display date, and machine-readable dateTime." },
    { name: "orientation", type: '"vertical" | "horizontal"', default: '"vertical"', description: "Vertical history or a horizontal sequence that scrolls inside its own container when needed." },
    { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Title, description, date, marker, and spacing scale." },
    { name: "aria-label", type: "string", description: "Names the ordered list when no surrounding heading supplies context." },
    { name: "aria-labelledby", type: "string", description: "References an existing heading to name the list." },
  ],
  propsDescription: "Each item requires id: string and title: ReactNode. description?: ReactNode accepts rich content. date?: string is the display text; dateTime?: string is a valid HTML time value, such as 2026-10 or an ISO datetime. With dateTime, the date uses a time element; without it, ranges and text such as 'Present' use a span. dateTime alone is also used as display text.",
  options: ["vertical by default", "horizontal with local scrolling", "sizes: sm | md | lg", "optional dates and descriptions", "HTML ordered-list attributes"],
  features: [
    "Native ol/li semantics with decorative rails and markers hidden from assistive technology.",
    "Stable item ids preserve DOM identity when entries move.",
    "Display dates and machine-readable times are independent.",
    "Rich descriptions and ordinary links remain usable.",
    "Long text wraps; horizontal entries retain a readable minimum width.",
  ],
  usage: "Use GridraTimeline for a portfolio biography, work history, published projects, or activity records. Supply items oldest-first or newest-first in the desired reading order. Keep date formatting and sorting in the host application. Apply a Gridra theme class to the surrounding DOM as with other components.",
  avoid: "Use GridraStepper for workflows with a current step and completed-step backtracking. Timeline has no workflow state or selection callback. Do not assign a single dateTime to a date range; omit dateTime when the display is a range rather than one date. Keep headings and page navigation in the host application.",
  notes: "The portfolio example contains illustrative history. Use title={<h3>…</h3>} when entries should participate in the page heading structure; choose the heading level to match the surrounding page. For long horizontal histories, --gridra-timeline-column-width controls each entry's minimum width and --gridra-timeline-gap controls spacing.",
  accessibility: "The root is an ordered list with role=list so custom marker styling preserves list semantics. Provide aria-label or aria-labelledby when the list needs a name. Machine-readable dates use time with datetime. Rails and markers have aria-hidden=true. Entries add no tab stops, progressbar, current-step, or disabled semantics; links and other controls supplied by the caller retain their native behavior.",
  compositions: ["GridraTimeline + GridraBox: portfolio section.", "GridraTimeline + headings and links: career history with project details."],
  preview: <TimelineExample />,
  previewCode: exampleCode("vertical"),
  examples: [
    { title: "Portfolio history", description: "Vertical history with a dated entry, rich content and a project link, plus an ongoing date range.", code: exampleCode("vertical"), preview: <TimelineExample /> },
    { title: "Horizontal milestones", description: "The same history arranged horizontally; narrow containers scroll locally.", code: exampleCode("horizontal"), preview: <TimelineExample orientation="horizontal" /> },
    { title: "Without dates", description: "A compact sequence with titles and descriptions only.", code: undatedCode, preview: <GridraTimeline aria-label="Project milestones" size="sm" items={undatedItems} /> },
  ],
};
