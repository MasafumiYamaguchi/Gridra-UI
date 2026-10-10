# GRIDRA UIのテーマ設定

GRIDRA UIのテーマは、任意のDOMのclassで選択するCSSカスタムプロパティのパレットです。
テーマ用のProviderや画面レイアウト用の親コンポーネントは必要ありません。

## 組み込みテーマ

実行時にテーマを切り替える場合は、コンポーネントCSSとすべての名前付き
パレットを読み込みます。

```ts
import "@gridra-ui/theme/base.css";
import "@gridra-ui/theme/themes.css";
```

`dark`、`light`、`midnight`、`forest`、`ember`から選択します。

```tsx
<section className="gridra-theme-forest">...</section>
```

1種類だけ使う場合は個別のCSSファイルをimportできます。
テーマclassを省略すると、`base.css`に含まれるDarkの既定トークンを使います。
既定値は低詳細度の`:root`に置かれ、ページの寸法や余白は変更しません。
テーマclassを入れ子にすると、その領域だけ継承トークンを上書きできます。

組み込みパレットは、次のエディターテーマを配色の参考にしています。

- Dark: Gridra本来のモノクロパレット
- Light: VS Code標準のLight Modern
- Midnight: Tokyo Night拡張のパレット
- Forest: Everforestのmedium darkパレット
- Ember: Gruvbox Materialの暖色パレット

各名称はGridra側のプリセット名であり、参照元テーマそのものを再配布するものでは
ありません。

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
<section className="gridra-theme-studio-blue">...</section>
```

アンカーを持つPortalは、そのアンカーに継承されたGridraトークンと最寄りのテーマclassを引き継ぎます。
祖先のclassやinline styleを変更すると、開いているPortalも更新されます。
無関係な領域のテーマは引き継ぎません。

アンカーのない`GridraToastProvider`と`GridraCommandPalette`には、任意の`theme`名を指定できます。
省略時はdocumentのbodyとhtmlのテーマを使います。
明示したテーマ名が配色を決め、間隔やフォントなどの非カラートークンは継承します。


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
