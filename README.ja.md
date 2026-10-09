# GRIDRA UI

[English](README.md) | [日本語](README.ja.md)

GRIDRA UI は、高密度でパネル中心の GRIDRA らしいインターフェースを作るための React ファーストなコンポーネントライブラリです。

## ステータス

- 現在のバージョン: `0.1.0`
- npm でパッケージを公開済みです。
- 現時点では、ローカルの npm workspaces モノレポとして構成されています。

## パッケージ

- [`@gridra-ui/react`](https://www.npmjs.com/package/@gridra-ui/react): React コンポーネントとインタラクション層。
- [`@gridra-ui/core`](https://www.npmjs.com/package/@gridra-ui/core): フレームワークに依存しない ID、ジオメトリ型、状態ヘルパー。
- [`@gridra-ui/theme`](https://www.npmjs.com/package/@gridra-ui/theme): CSS 変数トークンと5つの組み込みテーマプリセット。
- `@gridra-ui/playground`: ローカル確認とコンポーネントドキュメント用の Vite アプリ。

## 導入

公開済みのランタイムパッケージを、次のように導入します。

```bash
npm install @gridra-ui/react @gridra-ui/theme
```

アプリケーション側では、テーマ CSS を明示的に import します。

```ts
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/themes.css";
```

実行時は、組み込みまたはカスタムテーマを選択します。

```tsx
<GridraRoot theme="midnight">...</GridraRoot>
```

`dark.css`や`light.css`など、個別プリセットのimportも引き続き利用できます。

## 開発

依存関係をインストールします。

```bash
npm install
```

playground を起動します。

```bash
npm run dev
```

チェックを実行します。

```bash
npm run test
npm run typecheck
npm run build
```

## アーキテクチャ

GRIDRA UI は npm workspaces を使ったモノレポです。React コンポーネントは描画とインタラクションに集中し、フレームワーク非依存のプリミティブやスタイルトークンは再利用しやすいように層を分けています。

```text
apps/playground
  @gridra-ui/react と @gridra-ui/theme を使うローカル確認・ドキュメント用アプリ

packages/react
  React コンポーネントとインタラクション層を export

packages/core
  フレームワーク非依存の ID、ジオメトリ型、小さな状態ヘルパーを提供

packages/theme
  カラートークン契約と5つの組み込みテーマプリセットを提供
```

主な依存方向は次の通りです。

```text
@gridra-ui/playground
  -> @gridra-ui/react
      -> @gridra-ui/core
  -> @gridra-ui/theme
```

`@gridra-ui/theme` は JavaScript 依存ではなく、明示的な CSS import として利用します。これにより、利用側アプリケーションが必要な視覚トークンだけを選べます。

## コンポーネント範囲

GRIDRA UI は、高密度なアプリケーション画面向けのプリミティブを含みます。

- 空間編集: canvas area、node、minimap、selection、drag/resize handle、connection handle、snap guide。
- パネルとレイアウト: panel、sidebar、split pane、stack/inline/cluster/grid layout utilities。
- コントロール: button、icon button、input、select、checkbox、radio、switch、slider、field、label。
- オーバーレイと操作: tooltip、popover、dialog、dropdown menu、context menu、command palette、hover card。
- ナビゲーションとフィードバック: tabs、breadcrumb、accordion、tree view、pagination、stepper、alert、toast、progress、skeleton、empty state。

現在の実装状況と今後の追加予定は [COMPONENT_ROADMAP.md](./COMPONENT_ROADMAP.md) を参照してください。

## スタイリングとテーマ

theme パッケージは、JavaScript ランタイムではなく CSS ファイルを公開します。

- `@gridra-ui/theme/base.css`: 基本クラススタイルと CSS 変数の契約。
- `@gridra-ui/theme/themes.css`: 実行時切り替え用の全組み込みテーマ。
- `@gridra-ui/theme/{dark,light,midnight,forest,ember}.css`: 個別プリセット。

利用側では`GridraRoot`の`theme` propでプリセットを選択するか、同じ必須トークンを持つ
`.gridra-theme-<name>`クラスを定義できます。完全な契約とカスタム例は
[THEMING.ja.md](./THEMING.ja.md)を参照してください。

## ドキュメント

playground には、ローカルのコンポーネントドキュメントと表示例があります。`npm run dev` を実行し、ターミナルに表示される Vite の URL を開いてください。

ドキュメント整備の計画は [DOCUMENTATION_BACKLOG.md](./DOCUMENTATION_BACKLOG.md) にあります。開発フロー、テスト方針、API 設計メモは [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md) を参照してください。

## 技術スタック

- TypeScript
- ワークスペース内では React 19 を使用し、`@gridra-ui/react` は peer dependency として React `>=18.2.0` を宣言
- TypeScript project references
- playground は Vite
- テストは Vitest、jsdom、Testing Library
- スタイリングは CSS 変数とテーマプリセット

## コンポーネントの選び方

新規コードでは、状態表示に `GridraBadge`、メタデータのラベル表示に
`GridraBadge variant="outline"` を使用してください。
1.0未満のAPI整理として、`GridraTag` と `GridraGrid` および関連する型を削除しました。
`GridraTag` は `GridraBadge variant="outline"` へ移行してください。
ラベルのサイズ、文字の大小、はみ出し対策は維持されます。
`.gridra-tag*` のCSSセレクターはBadgeのセレクターへ、
`--gridra-tag-*` の上書き設定は `--gridra-badge-outline-*` へ変更してください。
項目の選択には `GridraSelectableGrid`、レイアウトには `GridraGridLayout` を使用してください。

`GridraInline`、`GridraInlineItem`、`GridraCluster` および関連する型も削除しました。
`.gridra-inline*` / `.gridra-cluster*` のCSSセレクターはStackのセレクターへ変更してください。
その他の既存のpropsは維持し、以下のように移行できます。

```tsx
// 横並び（旧GridraInline）
<GridraStack direction="horizontal" inline align="center" gap="sm" />
// 折り返し（旧GridraCluster）
<GridraStack direction="horizontal" wrap align="center" gap="sm" rowGap="md" />
// 残りの幅を埋める子要素（旧GridraInlineItem）
<GridraStackItem grow />
```
