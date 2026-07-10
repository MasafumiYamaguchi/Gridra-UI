import type { HTMLAttributes, ReactNode } from "react";
import type { GridraThemeName } from "../../theme";
import {
  getGridraThemeClassNameFromClassName,
  getGridraThemeClassNameFromName,
  removeGridraThemeClassNames,
} from "../../internal/theme";
import { GridraThemeClassProvider } from "../../internal/themeContext";

export interface GridraRootProps extends HTMLAttributes<HTMLDivElement> {
  panel?: ReactNode;
  panelPosition?: "left" | "right";
  theme?: GridraThemeName;
}

export function GridraRoot({
  children,
  className,
  panel,
  panelPosition = "left",
  theme,
  ...props
}: GridraRootProps) {
  const explicitThemeClassName = getGridraThemeClassNameFromName(theme);
  const inheritedClassName = explicitThemeClassName
    ? removeGridraThemeClassNames(className ?? "")
    : className;
  const resolvedThemeClassName =
    explicitThemeClassName ?? getGridraThemeClassNameFromClassName(className);
  const rootClassName = [
    "gridra-root",
    inheritedClassName,
    explicitThemeClassName,
  ]
    .filter(Boolean)
    .join(" ");
  // panelがある場合だけ左右配置用のmodifierを付ける。
  const shellClassName = [
    "gridra-root__shell",
    panel ? `gridra-root__shell--${panelPosition}` : null
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <GridraThemeClassProvider value={resolvedThemeClassName ?? null}>
      <div className={rootClassName} {...props}>
        <div className={shellClassName}>
          {/* panelPositionに応じてmainの前後へ同じpanelスロットを差し込む。 */}
          {panel && panelPosition === "left" ? panel : null}
          <main className="gridra-main">{children}</main>
          {panel && panelPosition === "right" ? panel : null}
        </div>
      </div>
    </GridraThemeClassProvider>
  );
}
