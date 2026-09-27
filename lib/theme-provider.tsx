import React, { createContext, useContext, useMemo, useState } from "react";

import type { ColorScheme } from "@/constants/theme";

const ThemeContext = createContext<{ scheme: ColorScheme; setScheme: (scheme: ColorScheme) => void }>({ scheme: "light", setScheme: () => undefined });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = useState<ColorScheme>("light");
  const value = useMemo(() => ({ scheme, setScheme }), [scheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() { return useContext(ThemeContext); }
export function useThemeContext() { return useContext(ThemeContext); }
