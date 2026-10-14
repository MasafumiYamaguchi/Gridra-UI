# Development Notes

## API整理の方針（1.0未満）

重複したコンポーネントや曖昧なAPIを整理する際は、破壊的変更を許容する。
旧APIとの互換性だけを理由に別名やラッパーを残さず、使い分けを減らす。
削除するAPIと移行先は、PRの説明と該当ドキュメントに明記する。
追加するコードの説明コメントは日本語で記述する。

## Testing Workflow

Codex should add or update tests together with implementation changes when the behavior is meaningful enough to verify.

When adding or changing functionality:

1. Codex implements the production code.
2. Codex adds focused tests for the changed behavior.
3. Codex runs the relevant test command.
4. Codex runs typecheck or build when the change affects exported APIs or application wiring.
5. Codex summarizes what was tested and any remaining risk.

Codex may add new test files or new test cases by default when adding a component or behavior.

Testing preferences:

- Keep tests focused on public behavior and stable DOM/API contracts.
- Put React component tests beside the component implementation, inside `packages/react/src/components/<ComponentName>`.
- Avoid over-testing implementation details that would make refactors noisy.
- Prefer adding narrow regression tests for interaction logic such as selection, dragging, resizing, and connections.
- If a test would require brittle browser geometry, explain the tradeoff and cover the stable part instead.

## Canvas API

`useGridraCanvas` is controlled-only: `state` and `onStateChange(next, previous)`.
The caller owns nodes with placement, connections and both selection arrays.
The hook owns only transient pointer operations and preview geometry.
Do not introduce a required canvas/root component or parallel placement/selection sources.
Visual nodes take ordinary button props and `aria-pressed`; getters supply the interaction bindings.

## Controlled State Contracts

Use controlled and uncontrolled APIs consistently when a component owns user-editable state.

- Prefer `value` / `defaultValue` / `onValueChange` for generic values.
- Prefer domain-specific names when they make the API clearer, such as `open` / `defaultOpen` / `onOpenChange`, `selectedId` / `defaultSelectedId` / `onSelectionChange`, or `expandedIds` / `defaultExpandedIds` / `onExpandedIdsChange`.
- Change callbacks should receive `(next, previous)` when the previous value is meaningful to consumers.
- Controlled props should be treated as the source of truth. Internal state should only update when the controlling prop is `undefined`.
- Do not fire change callbacks when the requested next value is equivalent to the current resolved value.
- Sanitize invalid, missing, disabled, or out-of-range values before rendering.
- When a component has both a raw prop value and a sanitized resolved value, emit callback `previous` values based on the public resolved behavior, not surprising internal fallback details.
- Keep sanitization in the component when it depends on component-specific data such as valid item ids, disabled items, page counts, or min/max ranges.
- Use `useControllableValue` for simple state contracts. Keep a local implementation only when resolved state needs component-specific fallback or validation before callback emission.

## Option Surface Guidelines

Treat option complexity as an API design problem, not only a typing problem.

- Start with the smallest prop surface that supports the primary use case.
- Prefer explicit domain props over generic `options` bags when the setting changes public behavior.
- Group settings into an object only when consumers naturally think about them as one concept, such as positioning, pagination, or formatting.
- Prefer composition slots or item metadata when the caller needs to customize rendered content, not just toggle a visual variant.
- Avoid adding booleans that can conflict with existing variants or modes; use a single discriminated mode when states are mutually exclusive.
- Document the recommended path before documenting every escape hatch.
- When an option affects controlled state, accessibility, layout, or event timing, add at least one focused test around that interaction.

Test case coverage should include both expected paths and failure or edge paths.

When adding or changing behavior, consider these test angles:

- Normal path: the intended user action or API call produces the expected visible result or state update.
- Invalid input: missing, malformed, unsupported, or out-of-range values are ignored, clamped, rejected, or surfaced in the documented way.
- Boundary values: minimum, maximum, empty, single-item, and repeated-item cases behave consistently.
- Disabled or unavailable state: interactions do nothing, preserve state, or expose the expected disabled affordance.
- Conflicting interactions: overlapping actions such as drag while selected, resize after selection, cancel during an operation, or repeated pointer events do not leave stale state behind.
- Regression cases: a previously fixed bug gets a focused test that would fail if the bug returns.
- Error recovery: failures leave the component or API in a stable state and allow the user to continue where applicable.

For each meaningful behavior change, Codex should decide whether at least one negative or edge-case test is useful. If not adding one, summarize why the normal-path coverage is sufficient.

## Component Test Checklist

Use this checklist when adding a component or refactoring shared component behavior.

- Root contract: stable root element, base class name, variant/size class names, and `className` passthrough.
- Attribute passthrough: relevant native props, `style`, `id`, `aria-*`, and `data-*` land on the intended element.
- Accessibility: role, label, description, current/selected/expanded/disabled state, and decorative `aria-hidden` behavior match the public contract.
- Controlled state: controlled props do not mutate internal state directly, uncontrolled defaults initialize once, and callbacks receive `(next, previous)` where promised.
- Disabled state: pointer, keyboard, and callback behavior are inert or constrained as documented.
- Keyboard interaction: arrow keys, Home/End, Enter/Space, Escape, Tab, and focus return are covered for interactive widgets where applicable.
- Boundary values: empty arrays, single item, duplicate ids, missing ids, invalid numbers, min/max, and clamped values behave predictably.
- Composition: custom render props, custom children, existing event handlers, and refs compose without stealing consumer behavior.
- Portal/floating behavior: open/close state, outside pointerdown, Escape, scroll/resize repositioning, and theme inheritance are covered when relevant.
- Spatial interaction: pointer capture, drag/resize cancellation, snap guides, selection modifiers, duplicate connection rejection, and callback emission are covered for canvas-like components.

## Local verification and documentation

依存関係はルートで `npm ci` を実行し、lockfile のバージョンを使います。
`npm run test` は core / React / theme の検証と playground のテストを実行します。
`npm run typecheck` は TypeScript project references 全体、`npm run build` は
core / React の配布ファイルと Vite playground（コンポーネントドキュメント）をビルドします。
現在 lint スクリプト、Storybook、GitHub Actions workflow はありません。
変更時は `git diff --check` も実行してください（静的 lint の代わりではありません）。

対象を絞る例:

```bash
npm --workspace @gridra-ui/react test -- GridraSplitPane
npm --workspace @gridra-ui/playground test -- example-scenes
npm --workspace @gridra-ui/playground run build
```

SplitPane は `splitPaneSizing.ts` に純粋な割合計算を置き、コンポーネント側で
状態・DOM・入力イベントを扱います。ポインターとキーボードの更新は同じ関数を通し、
同じ割合への操作では通知しません。pointer cancel / capture 喪失でドラッグを終了します。
公開 exports、CSS class / custom property 名は変更しないでください。

ドキュメントの props / コード例は `apps/playground/src/componentDocs/data/components/`、
操作可能な例は `example-scenes.tsx` にあります。両方を同時に更新し、
`example-scenes.test.tsx` で操作を検証してください。README のクイックスタートは
`apps/playground/src/QuickStart.tsx` と揃え、通常の型検査とビルドで確認します。

## PR の実画面スクリーンショット（必須）

フロント変更（React コンポーネント、CSS・テーマ、レイアウト、操作状態、
playground / docs の表示等）を含む PR は、実ブラウザで撮影した画像を
**PR 本文に直接埋め込むことを必須**とします。
[PR テンプレート](.github/PULL_REQUEST_TEMPLATE.md) に従ってください。

- 同じページ・テーマ・画面幅で変更前後を比較し、撮影対象の両コミット SHA、
  ブラウザ、画面幅 × 高さ（CSS px）、状態を明記します。
- 影響するモバイル／デスクトップを掲載し、開閉、フォーカス、disabled 等、
  変更に関係する主要状態を含めます。新規画面で変更前が存在しない等の例外は理由を明記します。
- GitHub の添付画像、または公開リポジトリ内画像のコミット SHA 固定 URL 等を使い、
  レビュアーが GitHub 上で表示できることを確認します。
  ローカルパス、非公開 Library URL、画像へのリンクだけでは完了扱いにしません。
- public リポジトリ向けにアプリのみを撮影し、個人情報・ブラウザの認証情報等を含めません。
- UI に影響しない変更だけの場合は、スクリーンショット欄に具体的な理由付きで `N/A` と記載します。
- 取得やアップロードができない場合はチェックを未完了に保ち、不足する画像と
  具体的なブロッカーを PR 本文と作業報告に記載します。画像なし・閲覧未確認でチェックを付けず、
  スクリーンショット対応完了と報告しないでください。
- 後続コミットで UI が変わったら再撮影します。画像・説明だけを追加した場合は、
  撮影対象 SHA と最新 SHA の間に UI の変更がないことを明記して再利用できます。

これは作業者・レビュアーが守る必須のレビュー手順です。テンプレートだけで自動的に
強制される CI ゲートにはなりません。今回このための CI やブランチ保護条件は追加しません。
