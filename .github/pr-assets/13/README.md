# PR #13: GridraTimeline screenshots

撮影対象の実装: `62c4001f6d9c52de23b9c19f39d522bd83b05dbf`。
新規コンポーネントの追加のため、対応する変更前の表示はありません。
このディレクトリを追加するコミットは画像と撮影情報のみで、実装を変更していません。

ローカルの Playground `/docs#docs-GridraTimeline` を Chromium で表示し、
Light テーマ、device scale factor 2、reduced motion の条件で撮影しました。
デスクトップの CSS viewport は 1440 × 1000、モバイルは 390 × 844 です。
画像はページ全体ではなく、各例の実際の Live preview 領域を切り出したものです。
DOM や表示内容は撮影用に改変していません。

- `desktop-vertical` / `mobile-vertical`: Portfolio history の縦表示。
- `desktop-horizontal` / `mobile-horizontal`: Horizontal milestones の横表示、スクロール先頭。
- `mobile-horizontal-end`: 横表示を末尾までスクロールした状態。
- `mobile-undated`: Without dates の日時なし・sm 表示。

撮影時に縦・横表示の項目数が3件であること、モバイル横表示の内容が
表示幅を超えて末尾へスクロールできること、ブラウザーの pageerror がないことを確認しました。
本文中の経歴は既存のドキュメント用サンプルです。

| 画像 | PNG ピクセル寸法 |
| --- | --- |
| `desktop-horizontal.png` | 1636 × 422 |
| `desktop-vertical.png` | 1636 × 694 |
| `mobile-horizontal-end.png` | 696 × 390 |
| `mobile-horizontal.png` | 696 × 390 |
| `mobile-undated.png` | 696 × 320 |
| `mobile-vertical.png` | 696 × 778 |
