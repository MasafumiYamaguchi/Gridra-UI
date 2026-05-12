import { createHighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import type { DocsCodeLanguage } from "./types";

const DOCS_THEME = "github-dark-default";
const highlighterPromise = createHighlighterCore({
  engine: createJavaScriptRegexEngine(),
  langs: [
    import("@shikijs/langs/tsx"),
    import("@shikijs/langs/typescript"),
    import("@shikijs/langs/css"),
    import("@shikijs/langs/bash")
  ],
  themes: [import("@shikijs/themes/github-dark-default")]
});

export async function highlightDocsCode(code: string, language: DocsCodeLanguage) {
  const highlighter = await highlighterPromise;

  return highlighter.codeToHtml(code, {
    lang: language,
    theme: DOCS_THEME
  });
}
