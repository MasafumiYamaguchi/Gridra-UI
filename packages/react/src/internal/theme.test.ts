import { afterEach, describe, expect, it } from "vitest";
import {
  getGridraThemeClassName,
  getGridraThemeClassNameFromClassName,
  getGridraThemeClassNameFromName,
  removeGridraThemeClassNames,
} from "./theme";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("theme helpers", () => {
  it("creates classes for built-in and custom kebab-case names", () => {
    expect(getGridraThemeClassNameFromName("dark")).toBe("gridra-theme-dark");
    expect(getGridraThemeClassNameFromName("studio-blue")).toBe(
      "gridra-theme-studio-blue",
    );
  });

  it("rejects names that cannot form one theme class", () => {
    expect(getGridraThemeClassNameFromName("Studio Blue")).toBeUndefined();
    expect(getGridraThemeClassNameFromName("studio_blue")).toBeUndefined();
  });

  it("finds any prefixed theme class in a className string", () => {
    expect(
      getGridraThemeClassNameFromClassName(
        "custom gridra-theme-midnight another",
      ),
    ).toBe("gridra-theme-midnight");
  });

  it("removes only Gridra theme classes", () => {
    expect(
      removeGridraThemeClassNames(
        "custom gridra-theme-light another gridra-theme-forest",
      ),
    ).toBe("custom another");
  });

  it("prefers the nearest custom theme ancestor", () => {
    document.body.innerHTML = `
      <div class="gridra-theme-forest">
        <div class="gridra-theme-studio-blue">
          <button id="anchor">Anchor</button>
        </div>
      </div>
    `;
    const anchor = document.querySelector("#anchor") as HTMLElement;

    expect(getGridraThemeClassName(anchor)).toBe("gridra-theme-studio-blue");
  });

  it("falls back to the first document theme when no anchor is available", () => {
    document.body.innerHTML = '<div class="gridra-theme-ember" />';

    expect(getGridraThemeClassName()).toBe("gridra-theme-ember");
  });
});
