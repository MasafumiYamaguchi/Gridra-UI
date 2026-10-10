import { useId, useState } from "react";
import { GRIDRA_BUILT_IN_THEME_NAMES } from "@gridra-ui/react";
import type { GridraBuiltInThemeName } from "@gridra-ui/react";
import type { ReactNode } from "react";
import { CodeBlock } from "./code-block";
import { CopyButton } from "./copy-button";
import type { CodeExample } from "./types";

export function DocsPreview({ preview, code, theme }: {
  preview: ReactNode;
  code: string;
  theme: GridraBuiltInThemeName;
}) {
  const id = useId();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [previewTheme, setPreviewTheme] = useState<GridraBuiltInThemeName>();
  const selectedTheme = previewTheme ?? theme;

  return <div className="docs-preview">
    <div className="docs-preview__toolbar">
      <div role="tablist" aria-label="Preview and code" className="docs-preview__tabs">
        {(["preview", "code"] as const).map((name) => <button key={name} type="button" role="tab"
          id={`${id}-${name}-tab`} aria-selected={tab === name} aria-controls={`${id}-${name}-panel`}
          tabIndex={tab === name ? 0 : -1} onClick={() => setTab(name)} onKeyDown={(event) => {
            if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
              event.preventDefault();
              const next = event.key === "Home" ? "preview" : event.key === "End" ? "code" : tab === "preview" ? "code" : "preview";
              setTab(next);
              document.getElementById(`${id}-${next}-tab`)?.focus();
            }
          }}>{name}</button>)}
      </div>
      <div className="docs-preview__themes" role="group" aria-label="Preview theme">
        <span>Preview theme</span>
        {GRIDRA_BUILT_IN_THEME_NAMES.map((name) => <button type="button" key={name}
          className={`docs-theme-swatch docs-theme-swatch--${name}`} aria-label={`${name} preview theme`}
          title={name} aria-pressed={selectedTheme === name} onClick={() => setPreviewTheme(name)} />)}
      </div>
    </div>
    <div role="tabpanel" id={`${id}-preview-panel`} aria-labelledby={`${id}-preview-tab`} hidden={tab !== "preview"}>
      <div className={`docs-preview__stage gridra-theme-${selectedTheme}`}>{preview}</div>
    </div>
    <div role="tabpanel" id={`${id}-code-panel`} aria-labelledby={`${id}-code-tab`} hidden={tab !== "code"}>
      <CodeBlock code={code} />
    </div>
  </div>;
}

export function ExampleCard({ example, number, theme }: {
  example: CodeExample;
  number: string;
  theme: GridraBuiltInThemeName;
}) {
  return <div className="docs-example">
    <div className="docs-example__header">
      <h4><span>{number}</span>{example.title}</h4>
      <CopyButton text={example.code} />
    </div>
    {example.description && <p className="docs-example__description">{example.description}</p>}
    {example.preview && <div className={`docs-preview__stage docs-preview__stage--example gridra-theme-${theme}`}>
      {example.preview}
    </div>}
    <CodeBlock code={example.code} language={example.language} header={false} />
  </div>;
}
