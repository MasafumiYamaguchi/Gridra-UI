# GRIDRA UI

[English](README.md) | [日本語](README.ja.md)

GRIDRA UI は、高密度でパネル中心の GRIDRA らしいインターフェースを作るための React ファーストなコンポーネントライブラリです。

## ステータス

- 現在のバージョン: `0.1.0`
- npm でのパッケージ配布は今後対応予定です。
- 現時点では、ローカルの npm workspaces モノレポとして構成されています。

## パッケージ

- `@gridra-ui/react`: React コンポーネントとインタラクション層。
- `@gridra-ui/core`: フレームワークに依存しない ID、ジオメトリ型、状態ヘルパー。
- `@gridra-ui/theme`: CSS 変数トークンと light/dark テーマプリセット。
- `@gridra-ui/playground`: ローカル確認とコンポーネントドキュメント用の Vite アプリ。

## 導入

npm での配布は今後対応予定です。公開後は、次のように導入する想定です。

```bash
npm install @gridra-ui/react @gridra-ui/theme
```

アプリケーション側では、テーマ CSS を明示的に import します。

```ts
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/dark.css";
```

ライトテーマを使う場合は、`dark.css` の代わりに `light.css` を import します。

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
  base CSS 変数と light/dark テーマプリセットを提供
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
- `@gridra-ui/theme/dark.css`: ダークテーマプリセット。
- `@gridra-ui/theme/light.css`: ライトテーマプリセット。

利用側では、プリセットテーマを import するか、アプリケーション側の CSS で変数を上書きできます。

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
