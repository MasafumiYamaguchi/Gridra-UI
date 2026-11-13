import { componentDocs } from "./data";
import * as ts from "typescript";
import { expect, it } from "vitest";
import { stepperDoc } from "./data/components/gridra-stepper";
import { timelineDoc } from "./data/components/gridra-timeline";
import { canvasHookDoc } from "./data/components/use-gridra-canvas";

// 各コンポーネントのdocは、headless hookを使う例をこのタイトルで載せている。
const HEADLESS_EXAMPLE_TITLE = "Custom markup with headless hook";

const headlessExamples = {
  name: "headless",
  examples: componentDocs.flatMap((doc) =>
    doc.examples.filter(
      (example) =>
        // canvas hookのdocはそれ自体がheadless APIの説明なので、全exampleを対象にする。
        doc.name === canvasHookDoc.name ||
        example.title === HEADLESS_EXAMPLE_TITLE,
    ),
  ),
};

it("finds headless examples to typecheck", () => {
  // タイトルやdoc名が変わって0件になると下のテストが空振りするため、件数を確かめる。
  expect(
    headlessExamples.examples.filter(
      (example) => example.title === HEADLESS_EXAMPLE_TITLE,
    ).length,
  ).toBeGreaterThan(0);
  expect(canvasHookDoc.examples.length).toBeGreaterThan(0);
});

it.each([stepperDoc, timelineDoc, headlessExamples])(
  "typechecks $name examples as standalone React modules",
  (doc) => {
    const sources = new Map(
      doc.examples.map((example, index) => [
        ts.sys.resolvePath(
          `src/${doc.name}-${index}-${example.title.toLowerCase().replaceAll(" ", "-")}.tsx`,
        ),
        example.code,
      ]),
    );
    const options: ts.CompilerOptions = {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      jsx: ts.JsxEmit.ReactJSX,
      strict: true,
      skipLibCheck: true,
      noEmit: true,
    };
    const host = ts.createCompilerHost(options);
    const originalGetSourceFile = host.getSourceFile.bind(host);
    host.getSourceFile = (
      fileName,
      languageVersion,
      onError,
      shouldCreateNewSourceFile,
    ) => {
      const code = sources.get(ts.sys.resolvePath(fileName));

      return code === undefined
        ? originalGetSourceFile(
            fileName,
            languageVersion,
            onError,
            shouldCreateNewSourceFile,
          )
        : ts.createSourceFile(
            fileName,
            code,
            languageVersion,
            true,
            ts.ScriptKind.TSX,
          );
    };
    const program = ts.createProgram({
      rootNames: [...sources.keys()],
      options,
      host,
    });
    const diagnostics = ts
      .getPreEmitDiagnostics(program)
      .map((diagnostic) =>
        ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
      );

    expect(diagnostics).toEqual([]);
  },
);
