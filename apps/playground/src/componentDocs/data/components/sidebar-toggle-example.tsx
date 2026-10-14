import { useId, useState } from "react";
import { GridraSidebarToggle } from "@gridra-ui/react";

export function SidebarToggleExample() {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  return <div className="docs-example-content">
    <GridraSidebarToggle open={open} onOpenChange={setOpen} aria-controls={contentId} />
    <div id={contentId} hidden={!open}>Navigation content</div>
    <GridraSidebarToggle disabled aria-label="Unavailable navigation" />
  </div>;
}
