import { useState } from "react";
import { GridraButton } from "@gridra-ui/react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <GridraButton
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      size="sm"
      variant="ghost"
    >
      {copied ? "Copied" : "Copy"}
    </GridraButton>
  );
}
