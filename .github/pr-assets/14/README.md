# PR #14 visual evidence

Actual Chromium screenshots of `/docs#docs-GridraButton`, dark theme,
reduced motion, device scale factor 2. Only application content is captured.

| Files | CSS viewport | Source commit |
| --- | --- | --- |
| `before-mobile-{closed,open}.png` | 390 × 844 | `10e1ddf114b440db60af5650e1cd8b2810dec172` |
| `before-desktop.png` | 1440 × 1000 | `10e1ddf114b440db60af5650e1cd8b2810dec172` |
| `after-mobile-{closed,open}.png` | 390 × 844 | `f4f1033d7f209bf61ce7326c93ed4a2bb9f682b3` |
| `after-desktop.png` | 1440 × 1000 | `f4f1033d7f209bf61ce7326c93ed4a2bb9f682b3` |

The after images reuse the verified implementation captures. The commit adding
these files changes only review guidance and screenshots, not application code.
Before captures use an isolated archive of the base commit; Vite resolves the
archived theme CSS as well as the archived React/core sources.

Embed these images directly in PR #14 using public URLs pinned to the commit
that adds this directory. Do not replace them with local or private Library paths.
