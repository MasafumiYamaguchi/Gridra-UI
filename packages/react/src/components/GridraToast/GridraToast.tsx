import { useGridraToastQueue, GridraToastContext } from "@gridra-ui/headless";
import type { GridraThemeName } from "../../theme";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useGridraPortalTheme } from "../../internal/portalTheme";

export type GridraToastPosition = "top" | "bottom";

export type {
  GridraToastOptions,
  GridraToastContextValue,
} from "@gridra-ui/headless";

export { useToast } from "@gridra-ui/headless";

export function GridraToastProvider({
  children,
  position = "bottom",
  theme,
}: {
  children: ReactNode;
  position?: GridraToastPosition;
  theme?: GridraThemeName;
}) {
  const { currentToast, exiting, show } = useGridraToastQueue({
    exitDuration: 150,
  });
  const portalTheme = useGridraPortalTheme(
    undefined,
    theme,
    currentToast !== null,
  );
  const viewportClassName = [
    "gridra-portal-root",
    "gridra-toast__portal",
    portalTheme.className,
    "gridra-toast__viewport",
    position === "top" && "gridra-toast__viewport--top",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <GridraToastContext.Provider value={{ show }}>
      {children}
      {/* アプリのレイアウトに影響させないため、表示中のToastだけをbody直下へPortalする。 */}
      {currentToast &&
        createPortal(
          <div className={viewportClassName} style={portalTheme.style}>
            <div
              className={[
                "gridra-toast",
                exiting && "gridra-toast--exiting",
                currentToast.options.className,
              ]
                .filter(Boolean)
                .join(" ")}
              role={currentToast.options.role}
            >
              {currentToast.message}
            </div>
          </div>,
          document.body,
        )}
    </GridraToastContext.Provider>
  );
}
