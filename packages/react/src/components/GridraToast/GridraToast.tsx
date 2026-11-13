import { useGridraToastQueue, GridraToastContext } from "@gridra-ui/headless";
import type { GridraThemeName } from "../../theme";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";
import { useGridraPortalTheme } from "../../internal/portalTheme";

export type GridraToastPosition = "top" | "bottom";

// packages/theme/src/base.css の .gridra-toast--exiting にある gridra-toast-out / gridra-toast-out-top の
// アニメーション時間 (150ms) と揃え、退出アニメーションの完了後に次の Toast へ進める。
const EXIT_ANIMATION_DURATION = 150;

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
    exitDuration: EXIT_ANIMATION_DURATION,
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
