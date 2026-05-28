import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { GridraInspectorPanel } from "./GridraInspectorPanel";

afterEach(() => {
  cleanup();
});

describe("GridraInspectorPanel", () => {
  const baseNode = {
    id: "node-1",
    label: "Node A",
    placement: { x: 2, y: 3, w: 4, h: 5 },
  };

  it("renders empty state when no node is selected", () => {
    render(<GridraInspectorPanel />);
    expect(screen.getByText("No node selected")).toBeTruthy();
    expect(screen.queryByTestId("inspector-label")).toBeNull();
  });

  it("renders empty state when selectedNode is null", () => {
    render(<GridraInspectorPanel selectedNode={null} />);
    expect(screen.getByText("No node selected")).toBeTruthy();
  });

  it("renders field values when a node is selected", () => {
    render(<GridraInspectorPanel selectedNode={baseNode} />);

    expect(screen.queryByText("No node selected")).toBeNull();
    expect((screen.getByTestId("inspector-label") as HTMLInputElement).value).toBe("Node A");
    expect((screen.getByTestId("inspector-x") as HTMLInputElement).value).toBe("2");
    expect((screen.getByTestId("inspector-y") as HTMLInputElement).value).toBe("3");
    expect((screen.getByTestId("inspector-w") as HTMLInputElement).value).toBe("4");
    expect((screen.getByTestId("inspector-h") as HTMLInputElement).value).toBe("5");
  });

  it("emits onChange with label patch when label input changes", () => {
    const handleChange = vi.fn();
    render(
      <GridraInspectorPanel selectedNode={baseNode} onChange={handleChange} />,
    );

    fireEvent.change(screen.getByTestId("inspector-label"), {
      target: { value: "Renamed" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({ label: "Renamed" });
  });

  it("emits onChange with placement patch when x changes", () => {
    const handleChange = vi.fn();
    render(
      <GridraInspectorPanel selectedNode={baseNode} onChange={handleChange} />,
    );

    fireEvent.change(screen.getByTestId("inspector-x"), {
      target: { value: "10" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith({ placement: { x: 10 } });
  });

  it("emits onChange with placement patch when y changes", () => {
    const handleChange = vi.fn();
    render(
      <GridraInspectorPanel selectedNode={baseNode} onChange={handleChange} />,
    );

    fireEvent.change(screen.getByTestId("inspector-y"), {
      target: { value: "20" },
    });

    expect(handleChange).toHaveBeenCalledWith({ placement: { y: 20 } });
  });

  it("emits onChange with placement patch when w changes", () => {
    const handleChange = vi.fn();
    render(
      <GridraInspectorPanel selectedNode={baseNode} onChange={handleChange} />,
    );

    fireEvent.change(screen.getByTestId("inspector-w"), {
      target: { value: "30" },
    });

    expect(handleChange).toHaveBeenCalledWith({ placement: { w: 30 } });
  });

  it("emits onChange with placement patch when h changes", () => {
    const handleChange = vi.fn();
    render(
      <GridraInspectorPanel selectedNode={baseNode} onChange={handleChange} />,
    );

    fireEvent.change(screen.getByTestId("inspector-h"), {
      target: { value: "40" },
    });

    expect(handleChange).toHaveBeenCalledWith({ placement: { h: 40 } });
  });

  it("does not emit onChange when disabled", () => {
    const handleChange = vi.fn();
    render(
      <GridraInspectorPanel
        disabled
        selectedNode={baseNode}
        onChange={handleChange}
      />,
    );

    fireEvent.change(screen.getByTestId("inspector-label"), {
      target: { value: "Renamed" },
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("disables inputs when disabled is true", () => {
    render(<GridraInspectorPanel disabled selectedNode={baseNode} />);

    expect(
      (screen.getByTestId("inspector-label") as HTMLInputElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByTestId("inspector-x") as HTMLInputElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByTestId("inspector-y") as HTMLInputElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByTestId("inspector-w") as HTMLInputElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByTestId("inspector-h") as HTMLInputElement).disabled,
    ).toBe(true);
  });

  it("does not emit onChange for empty or non-numeric placement values", () => {
    const handleChange = vi.fn();
    render(
      <GridraInspectorPanel selectedNode={baseNode} onChange={handleChange} />,
    );

    fireEvent.change(screen.getByTestId("inspector-x"), {
      target: { value: "" },
    });
    fireEvent.change(screen.getByTestId("inspector-x"), {
      target: { value: "abc" },
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not emit onChange for Infinity placement value", () => {
    const handleChange = vi.fn();
    render(
      <GridraInspectorPanel selectedNode={baseNode} onChange={handleChange} />,
    );

    fireEvent.change(screen.getByTestId("inspector-x"), {
      target: { value: "Infinity" },
    });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("calls onCommit when Enter is pressed in label input", () => {
    const handleCommit = vi.fn();
    render(
      <GridraInspectorPanel
        selectedNode={baseNode}
        onCommit={handleCommit}
      />,
    );

    fireEvent.keyDown(screen.getByTestId("inspector-label"), {
      key: "Enter",
    });

    expect(handleCommit).toHaveBeenCalledTimes(1);
  });
});
