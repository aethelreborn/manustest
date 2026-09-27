import { Platform } from "react-native";

export type ColorScheme = "light" | "dark";

export type ThemeColorPalette = {
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  primary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  inkSoft: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
};

export const Colors: Record<ColorScheme, ThemeColorPalette> = {
  light: {
    background: "#FAFAF9", surface: "#FFFFFF", foreground: "#1A1A1E", muted: "#73757B", primary: "#3B6E6B", border: "#E8E7E4", success: "#4C9A6A", warning: "#D9A441", error: "#D64545", info: "#3F6FBF", inkSoft: "#F1F0ED", tint: "#3B6E6B", icon: "#73757B", tabIconDefault: "#9A9B9E", tabIconSelected: "#3B6E6B",
  },
  dark: {
    background: "#121316", surface: "#1C1E22", foreground: "#F2F2F3", muted: "#9B9DA3", primary: "#5FA39F", border: "#2C2E33", success: "#6FBF8A", warning: "#E0B65C", error: "#E06767", info: "#6C93D6", inkSoft: "#25272C", tint: "#5FA39F", icon: "#9B9DA3", tabIconDefault: "#7D8088", tabIconSelected: "#5FA39F",
  },
};

export const Fonts = Platform.select({ ios: { sans: "system", rounded: "system", mono: "ui-monospace" }, default: { sans: "sans-serif", rounded: "sans-serif", mono: "monospace" }, web: { sans: "system-ui", rounded: "system-ui", mono: "ui-monospace" } });
