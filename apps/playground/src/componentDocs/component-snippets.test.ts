import { componentDocs } from "./data";
import * as ts from "typescript";
import { expect, it } from "vitest";
import { stepperDoc } from "./data/components/gridra-stepper";
import { timelineDoc } from "./data/components/gridra-timeline";

const headlessExamples = {name: "headless", examples: componentDocs.flatMap(doc => doc.examples.filter(example => doc.name === "useGridraCanvas" || example.title === "Custom markup with headless hook"))};

it.each([stepperDoc, timelineDoc, headlessExamples])("typechecks $name examples as standalone React modules", (doc) => {
  const sources = new Map(doc.examples.map((example, index) => [
    ts.sys.resolvePath(`src/${doc.name}-${index}-${example.title.toLowerCase().replaceAll(" ", "-")}.tsx`), example.code,
  ]));
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
  host.getSourceFile = (fileName, languageVersion, onError, shouldCreateNewSourceFile) => {
    const code = sources.get(ts.sys.resolvePath(fileName));
    return code === undefined
      ? originalGetSourceFile(fileName, languageVersion, onError, shouldCreateNewSourceFile)
      : ts.createSourceFile(fileName, code, languageVersion, true, ts.ScriptKind.TSX);
  };
  const program = ts.createProgram({ rootNames: [...sources.keys()], options, host });
  const diagnostics = ts.getPreEmitDiagnostics(program).map((diagnostic) =>
    ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
  expect(diagnostics).toEqual([]);
});
