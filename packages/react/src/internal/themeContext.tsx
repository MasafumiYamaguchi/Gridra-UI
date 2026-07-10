import {
  createContext,
  useContext,
  type ReactNode,
  type RefObject,
} from "react";
import { getGridraThemeClassName } from "./theme";

const GridraThemeClassContext = createContext<string | null | undefined>(
  undefined,
);

export function GridraThemeClassProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: string | null;
}) {
  return (
    <GridraThemeClassContext.Provider value={value}>
      {children}
    </GridraThemeClassContext.Provider>
  );
}

export function useGridraThemeClassName(
  anchorRef?: RefObject<HTMLElement | null>,
): string | undefined {
  const contextClassName = useContext(GridraThemeClassContext);
  if (contextClassName !== undefined) {
    return contextClassName ?? undefined;
  }
  return getGridraThemeClassName(anchorRef?.current);
}
