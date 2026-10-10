import { describe, expect, it } from "vitest";
import { highlightDocsCode } from "./highlight";
import type { DocsCodeLanguage } from "./types";

function luminance(hex: string) {
  const channels = hex.replace("#", "").match(/../g)!.slice(0, 3).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

const samples: { language: DocsCodeLanguage; code: string }[] = [
  { language: "tsx", code: 'import { GridraBox } from "@gridra-ui/react";\n// Layout preview\n<GridraBox padding="md" disabled={false}>Content</GridraBox>' },
  { language: "ts", code: '// Node count\nconst count: number = 42;\nfunction label(value: string) { return value; }' },
  { language: "css", code: '/* Panel styles */\n.panel { display: grid; gap: 12px; color: #ffffff; }' },
  { language: "bash", code: '# Install packages\nnpm install @gridra-ui/react\necho "Installed"' },
];

describe("documentation syntax colors", () => {
  it.each(samples)("keeps $language syntax readable on the Light background", async ({ language, code }) => {
    const host = document.createElement("div");
    host.innerHTML = await highlightDocsCode(code, language);
    const pre = host.querySelector("pre")!;
    const background = pre.style.getPropertyValue("--shiki-light-bg").trim();
    expect(background).toBe("#ffffff");
    const tokens = Array.from(host.querySelectorAll<HTMLElement>("span[style]"));
    expect(tokens.length).toBeGreaterThan(0);
    for (const token of tokens) {
      const foreground = token.style.getPropertyValue("--shiki-light").trim();
      const contrast = (luminance(background) + 0.05) / (luminance(foreground) + 0.05);
      const isComment = /^(\/\/|\/\*|#)/.test(token.textContent!.trim());
      expect(contrast, `Contrast for ${JSON.stringify(token.textContent)} (${foreground})`)
        .toBeGreaterThanOrEqual(isComment ? 4.5 : 7);
      // Each token must also carry a dark color, without a fixed inline color
      // that would compete with the selected documentation theme.
      expect(token.style.getPropertyValue("--shiki-dark")).toBeTruthy();
      expect(token.style.color).toBe("");
    }
    expect(pre.textContent).toBe(code);
  });
});
