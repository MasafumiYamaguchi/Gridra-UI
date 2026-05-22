# GRIDRA UI

[English](README.md) | [日本語](README.ja.md)

GRIDRA UI は、密度の高いパネル型 GRIDRA スタイルのインターフェースを作るための React ファーストなコンポーネントライブラリです。

## アーキテクチャ

GRIDRA UI は npm workspaces を使ったモノレポ構成です。React コンポーネント、フレームワーク非依存の基本型、テーマ用 CSS を分けることで、それぞれの責務を小さく保っています。

```text
apps/playground
  @gridra-ui/react と @gridra-ui/theme を使うローカル確認・ドキュメント用アプリ

packages/react
  React コンポーネントとインタラクション層

packages/core
  フレームワークに依存しない ID、幾何型、小さな状態ヘルパー

packages/theme
  base CSS 変数と light/dark テーマプリセット
```

主な依存方向は次の通りです。

```text
@gridra-ui/playground
  -> @gridra-ui/react
      -> @gridra-ui/core
  -> @gridra-ui/theme
```

`@gridra-ui/theme` は JavaScript の依存としてではなく、明示的な CSS import として利用します。これにより、利用側アプリが必要なテーマだけを選べます。

## ランタイム層

- **Core layer**: `packages/core/src/index.ts` に、共有 ID、幾何プリミティブ、選択状態ヘルパー、point/rect ユーティリティを置きます。
- **React component layer**: `packages/react/src/components/*` に公開 UI プリミティブを置きます。公開 export は `packages/react/src/index.ts` に集約します。
- **Canvas interaction layer**: `GridraCanvasArea` がノード選択、ドラッグ、リサイズ、範囲選択、ノード間接続を制御します。
- **Connection rendering layer**: `GridraConnectionLayer` は正規化済みノードと connection record を受け取り、SVG path に変換して線を描画します。
- **Theme layer**: `packages/theme/src/base.css` が CSS 変数の契約と構造クラスを定義し、`light.css` と `dark.css` がプリセット値を提供します。
- **Playground/docs layer**: `apps/playground/src/main.tsx` がデモアプリをマウントします。`/docs` は `apps/playground/src/componentDocs` のコンポーネントドキュメントを表示します。

## Canvas と接続モデル

Canvas はグリッドベースです。ノードは ID とグリッド配置を持ちます。

```text
node
  id
  placement
    column
    row
    columnSpan
    rowSpan
```

接続は軽量な record として保持します。

```text
connection
  sourceId -> targetId
```

インタラクションの流れは次のようになります。

```text
handle 上で pointer down
  -> GridraCanvasArea が接続中の状態を保持
  -> pointer move で preview 用の grid point を更新
  -> GridraConnectionLayer が preview SVG path を描画
  -> 対応する handle 上で pointer up すると sourceId -> targetId を作成
  -> onNodeConnectionsChange / onNodeConnect で利用側へ通知
```

接続線の path 計算は Canvas の geometry helper 側にあります。ノード配置を現在のグリッドサイズに合わせて正規化し、input/output の anchor point に変換します。SVG の接続レイヤーは Canvas と同じグリッド座標系を使います。

```text
node placement
  -> input/output anchor point
  -> cubic Bezier path
  -> SVG path in grid viewBox
```

この設計では、接続レイヤーはほぼ表示専用です。ノード状態、配置状態、接続の更新処理は持たず、受け取ったデータから描画用 segment を作り、既存の線に対する選択イベントだけを上位へ返します。

## Controlled State Pattern

インタラクティブな Canvas 状態は `useControllableValue` により controlled / uncontrolled の両方に対応します。

- `selectedId` / `defaultSelectedId`
- `selectedIds` / `defaultSelectedIds`
- `nodeConnections` / `defaultNodeConnections`
- `nodePlacements` / `defaultNodePlacements`

controlled prop が渡された場合、GRIDRA UI は対応する change callback を呼び、利用側が次の値を再度渡すことを期待します。default value だけが渡された場合は、コンポーネント内部で状態を保持します。

## Packages

- `@gridra-ui/core`: フレームワーク非依存の型、状態ヘルパー、幾何ヘルパー。
- `@gridra-ui/react`: React コンポーネント。
- `@gridra-ui/theme`: CSS 変数トークンとテーマプリセット。
- `@gridra-ui/playground`: ローカルで見た目と挙動を確認する Vite アプリ。

## ファイル構成

```text
.
|-- apps/
|   `-- playground/
|       |-- src/main.tsx                  # demo app and /docs route switch
|       |-- src/styles.css                # playground-only styles
|       `-- src/componentDocs/            # docs data, previews, and code examples
|-- packages/
|   |-- core/
|   |   `-- src/index.ts                  # shared IDs, geometry types, state helpers
|   |-- react/
|   |   `-- src/
|   |       |-- index.ts                  # public React package exports
|   |       |-- hooks/                    # shared React hooks
|   |       `-- components/
|   |           |-- GridraCanvasArea/     # grid canvas, hit testing, geometry, connections
|   |           |-- GridraNode/           # grid-positioned node primitive
|   |           |-- GridraConnectionHandle/
|   |           |-- GridraDragHandle/
|   |           |-- GridraResizeHandle/
|   |           `-- ...                   # panels, inputs, menus, layout primitives
|   `-- theme/
|       `-- src/
|           |-- base.css                  # base class styles and CSS variable contract
|           |-- dark.css                  # dark theme tokens
|           `-- light.css                 # light theme tokens
|-- COMPONENT_ROADMAP.md                  # component planning notes
|-- DEVELOPMENT_NOTES.md                  # development and testing workflow
|-- package.json                          # workspace scripts
`-- tsconfig.base.json                    # shared TypeScript compiler options
```

build 後には `dist` が生成されることがありますが、通常の変更対象は `src` 配下です。

## 使用技術

- **Language**: TypeScript
- **UI runtime**: ワークスペースでは React 19 を使用し、`@gridra-ui/react` は peer dependency として React `>=18.2.0` を宣言しています。
- **Build tooling**: TypeScript project references と、playground 用の Vite。
- **Testing**: Vitest、jsdom、React component test 用の Testing Library。
- **Styling**: CSS variables と `@gridra-ui/theme` からの package-level CSS exports。
- **Documentation/demo**: Vite playground。docs data は `apps/playground/src/componentDocs` に配置します。

## Scripts

- `npm run build`: すべての workspace を build します。
- `npm run typecheck`: すべての workspace を type-check します。
- `npm run test`: package tests を実行します。
- `npm run dev`: playground を起動します。

## Styling

利用側は base CSS を明示的に import し、その後 `gridra-theme-dark` のような theme class を追加するか、CSS variables を上書きします。

```ts
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/dark.css";
```

## Documentation And Syntax Highlighting

コンポーネントライブラリの packages は runtime UI primitives に集中させます。syntax highlighting を含むドキュメント専用の処理は、`@gridra-ui/playground` または将来の専用 docs app に置き、`@gridra-ui/react` や `@gridra-ui/theme` には入れません。

推奨方針:

- コード例は docs data model の中で plain source string として保持します。
- docs 専用の `CodeBlock` 抽象を通して描画し、highlighter を差し替えやすくします。
- 将来的な docs 実装では Shiki を優先します。VS Code 風の表示に近く、事前生成にも対応し、client-side highlighting が必要な場合も細かい bundle 制御ができます。
- 大きな all-language browser bundle を標準では読み込まないようにします。最初は `tsx`, `ts`, `css`, `bash` など、実際に表示する言語に絞ります。
- 公開 UI packages には syntax-highlighting dependency を入れません。docs highlighter の追加や変更が consumer bundle size に影響しないようにします。

実装ステップ:

1. docs 構造がまだ動いている間は、現在の plain `<pre><code>` renderer を継続します。
2. examples が安定したら、docs `CodeBlock` 境界の裏側に Shiki を導入します。
3. docs app に適した build pipeline ができたら、build-time または pre-rendered highlighting を優先します。
4. Vite playground で runtime highlighting が必要な場合は、full default bundle ではなく、cached singleton highlighter と必要最小限の language/theme bundle を使います。

Prism は小規模な browser-only highlighting では軽量な fallback になり得ますが、標準方針は fidelity と将来の docs 拡張性を考えて Shiki です。
