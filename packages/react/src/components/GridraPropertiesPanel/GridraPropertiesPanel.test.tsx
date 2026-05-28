import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GridraPropertiesPanel } from "./GridraPropertiesPanel";

afterEach(() => {
  cleanup();
});

const sampleSchema = {
  input: [
    { id: "sourceName", label: "Source Name", kind: "text" as const },
    { id: "enabled", label: "Enabled", kind: "toggle" as const },
  ],
  transform: [
    { id: "mode", label: "Mode", kind: "select" as const, options: [
      { value: "merge", label: "Merge" },
      { value: "replace", label: "Replace" },
    ]},
    { id: "intensity", label: "Intensity", kind: "number" as const, min: 0, max: 100, step: 1 },
  ],
  output: [
    { id: "targetName", label: "Target Name", kind: "text" as const },
    { id: "compress", label: "Compress", kind: "toggle" as const },
  ],
};

const sampleValue = {
  sourceName: "Source A",
  enabled: true,
  mode: "merge",
  intensity: 50,
  targetName: "Target A",
  compress: false,
};

describe("GridraPropertiesPanel", () => {
  it("renders empty state when nothing is selected", () => {
    render(<GridraPropertiesPanel />);
    expect(screen.getByText("No properties available")).toBeTruthy();
    expect(screen.queryByTestId("property-sourceName")).toBeNull();
  });

  it("renders empty state when selectedNodeId is missing", () => {
    render(
      <GridraPropertiesPanel
        schema={sampleSchema}
        selectedNodeType="input"
        value={sampleValue}
      />,
    );
    expect(screen.getByText("No properties available")).toBeTruthy();
  });

  it("renders empty state when schema is missing", () => {
    render(
      <GridraPropertiesPanel
        selectedNodeId="node-1"
        selectedNodeType="input"
        value={sampleValue}
      />,
    );
    expect(screen.getByText("No properties available")).toBeTruthy();
  });

  it("renders text field with value", () => {
    render(
      <GridraPropertiesPanel
        schema={sampleSchema}
        selectedNodeId="node-1"
        selectedNodeType="input"
        value={sampleValue}
      />,
    );
    const input = screen.getByTestId("property-sourceName") as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.value).toBe("Source A");
    expect(input.type).toBe("text");
  });

  it("renders toggle field with checked state", () => {
    render(
      <GridraPropertiesPanel
        schema={sampleSchema}
        selectedNodeId="node-1"
        selectedNodeType="input"
        value={sampleValue}
      />,
    );
    const toggle = screen.getByTestId("property-enabled");
    expect(toggle.getAttribute("aria-checked")).toBe("true");
  });

  it("renders select field with options", () => {
    render(
      <GridraPropertiesPanel
        schema={sampleSchema}
        selectedNodeId="node-1"
        selectedNodeType="transform"
        value={sampleValue}
      />,
    );
    const select = screen.getByTestId("property-mode") as HTMLSelectElement;
    expect(select).toBeTruthy();
    expect(select.value).toBe("merge");
    expect(select.querySelectorAll("option").length).toBe(2);
  });

  it("renders number field with value and constraints", () => {
    render(
      <GridraPropertiesPanel
        schema={sampleSchema}
        selectedNodeId="node-1"
        selectedNodeType="transform"
        value={sampleValue}
      />,
    );
    const input = screen.getByTestId("property-intensity") as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.type).toBe("number");
    expect(input.value).toBe("50");
    expect(input.getAttribute("min")).toBe("0");
    expect(input.getAttribute("max")).toBe("100");
    expect(input.getAttribute("step")).toBe("1");
  });

  it("emits onChange when text field changes", () => {
    const handleChange = vi.fn();
    render(
      <GridraPropertiesPanel
        schema={sampleSchema}
        selectedNodeId="node-1"
        selectedNodeType="input"
        value={sampleValue}
        onChange={handleChange}
      />,
    );
    fireEvent.change(screen.getByTestId("property-sourceName"), {
      target: { value: "New Source" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({ sourceName: "New Source" });
  });

  it("emits onChange when number field changes", () => {
    const handleChange = vi.fn();
    render(
      <GridraPropertiesPanel
        schema={sampleSchema}
        selectedNodeId="node-1"
        selectedNodeType="transform"
        value={sampleValue}
        onChange={handleChange}
      />,
    );
    fireEvent.change(screen.getByTestId("property-intensity"), {
      target: { value: "75" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({ intensity: 75 });
  });

  it("does not emit onChange for empty or non-numeric number values", () => {
    const handleChange = vi.fn();
    render(
      <GridraPropertiesPanel
        schema={sampleSchema}
        selectedNodeId="node-1"
        selectedNodeType="transform"
        value={sampleValue}
        onChange={handleChange}
      />,
    );
    fireEvent.change(screen.getByTestId("property-intensity"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByTestId("property-intensity"), {
      target: { value: "abc" },
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not emit onChange for Infinity number value", () => {
    const handleChange = vi.fn();
    render(
      <GridraPropertiesPanel
        schema={sampleSchema}
        selectedNodeId="node-1"
        selectedNodeType="transform"
        value={sampleValue}
        onChange={handleChange}
      />,
    );
    fireEvent.change(screen.getByTestId("property-intensity"), {
      target: { value: "Infinity" },
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("emits onChange when select field changes", () => {
    const handleChange = vi.fn();
    render(
      <GridraPropertiesPanel
        schema={sampleSchema}
        selectedNodeId="node-1"
        selectedNodeType="transform"
        value={sampleValue}
        onChange={handleChange}
      />,
    );
    fireEvent.change(screen.getByTestId("property-mode"), {
      target: { value: "replace" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({ mode: "replace" });
  });

  it("emits onChange when toggle field is clicked", () => {
    const handleChange = vi.fn();
    render(
      <GridraPropertiesPanel
        schema={sampleSchema}
        selectedNodeId="node-1"
        selectedNodeType="input"
        value={sampleValue}
        onChange={handleChange}
      />,
    );
    fireEvent.click(screen.getByTestId("property-enabled"));
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({ enabled: false });
  });

  it("does not emit onChange when disabled", () => {
    const handleChange = vi.fn();
    render(
      <GridraPropertiesPanel
        disabled
        schema={sampleSchema}
        selectedNodeId="node-1"
        selectedNodeType="input"
        value={sampleValue}
        onChange={handleChange}
      />,
    );
    fireEvent.change(screen.getByTestId("property-sourceName"), {
      target: { value: "X" },
    });
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("disables controls when disabled is true", () => {
    render(
      <GridraPropertiesPanel
        disabled
        schema={sampleSchema}
        selectedNodeId="node-1"
        selectedNodeType="input"
        value={sampleValue}
      />,
    );
    expect(
      (screen.getByTestId("property-sourceName") as HTMLInputElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByTestId("property-enabled") as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it("skips unknown field kinds", () => {
    const schemaWithUnknown = {
      custom: [
        { id: "known", label: "Known", kind: "text" as const },
        { id: "unknown", label: "Unknown", kind: "color" as any },
      ],
    };
    render(
      <GridraPropertiesPanel
        schema={schemaWithUnknown}
        selectedNodeId="node-1"
        selectedNodeType="custom"
        value={{ known: "A", unknown: "B" }}
      />,
    );
    expect(screen.getByTestId("property-known")).toBeTruthy();
    expect(screen.queryByTestId("property-unknown")).toBeNull();
  });
});
