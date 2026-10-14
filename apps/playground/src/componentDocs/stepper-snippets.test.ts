import * as ts from "typescript";
import { expect, it } from "vitest";
import { stepperDoc } from "./data/components/gridra-stepper";

it("typechecks all four Stepper examples as standalone React modules", () => {
  const sources = new Map(stepperDoc.examples.map((example) => [
    ts.sys.resolvePath(`src/stepper-example-${example.title.toLowerCase()}.tsx`), example.code,
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
