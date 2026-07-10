# GRIDRA UIのテーマ設定

GRIDRA UIのテーマは、`GridraRoot`で選択するCSSカスタムプロパティの
パレットです。公開ThemeProviderやJavaScriptのトークンオブジェクトは
必要ありません。

## 組み込みテーマ

実行時にテーマを切り替える場合は、コンポーネントCSSとすべての名前付き
パレットを読み込みます。

```ts
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/themes.css";
```

`dark`、`light`、`midnight`、`forest`、`ember`から選択します。

```tsx
<GridraRoot theme="forest">...</GridraRoot>
```

1種類だけ使う場合は個別のCSSファイルをimportできます。`theme`を省略した
場合は後方互換のDark fallbackが使われます。`theme` propがない場合は、従来の
`gridra-theme-*` classも引き続き認識されます。

## カスタムテーマ

カスタム名は小文字英数字のkebab-caseにします。`gridra-theme-`接頭辞を持つ
classをアプリ側のCSSに定義し、`base.css`より後に読み込んでください。

```css
.gridra-theme-studio-blue {
  color-scheme: dark;
  --gridra-color-background: #08121f;
  --gridra-color-surface: #0d1b2d;
  /* 以下の必須トークンをすべて定義します。 */
}
```

```tsx
<GridraRoot theme="studio-blue">...</GridraRoot>
```

テーマclassはDialog、Menu、Popover、Tooltip、ToastなどのPortalにも引き継がれ、
コンポーネントを再マウントせずに切り替えられます。

## 必須トークン契約

各カラーテーマは次の35トークンを定義します。

- 基本色: `--gridra-color-background`、`--gridra-color-surface`、
  `--gridra-color-surface-raised`、`--gridra-color-surface-input`、
  `--gridra-color-node-pattern`、`--gridra-color-text`、
  `--gridra-color-muted-text`、`--gridra-color-border`、
  `--gridra-color-border-strong`、`--gridra-color-accent`、
  `--gridra-color-selected`、`--gridra-color-focus`、
  `--gridra-shadow-selected`。
- Info: `--gridra-color-info`、`--gridra-color-info-surface`、
  `--gridra-color-info-text`、`--gridra-color-info-solid`。
- Success: `--gridra-color-success`、`--gridra-color-success-surface`、
  `--gridra-color-success-text`、`--gridra-color-success-solid`。
- Warning: `--gridra-color-warning`、`--gridra-color-warning-surface`、
  `--gridra-color-warning-text`、`--gridra-color-warning-solid`。
- Danger: `--gridra-color-danger`、`--gridra-color-danger-surface`、
  `--gridra-color-danger-text`、`--gridra-color-danger-solid`。
- CanvasとOverlay: `--gridra-color-backdrop`、`--gridra-color-handle`、
  `--gridra-color-handle-strong`、`--gridra-color-node-label`、
  `--gridra-color-canvas-subtle`、`--gridra-color-snap-line`。

サイズ、間隔、タイポグラフィ、角丸などの非カラートークンは`base.css`が管理します。
カラーテーマからコンポーネントの形状や操作方法は変更しません。
