import { useEffect, useState } from "react";
import { CopyButton } from "./copy-button";
import { highlightDocsCode } from "./highlight";
import type { DocsCodeLanguage } from "./types";

export function CodeBlock({
  code,
  language = "tsx"
}: {
  code: string;
  language?: DocsCodeLanguage;
}) {
  const [highlightedCode, setHighlightedCode] = useState<string>();

  useEffect(() => {
    let active = true;

    setHighlightedCode(undefined);
    highlightDocsCode(code, language)
      .then((html) => {
        if (active) {
          setHighlightedCode(html);
        }
      })
      .catch(() => {
        if (active) {
          setHighlightedCode(undefined);
        }
      });

    return () => {
      active = false;
    };
  }, [code, language]);

  return (
    <div className="docs-code-block">
      <div className="docs-code-block__header">
        <span className="docs-code-block__lang">{language}</span>
        <CopyButton text={code} />
      </div>
      {highlightedCode ? (
        <div
          className="docs-code-block__highlight"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      ) : (
        <pre className="docs-code-block__pre">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
