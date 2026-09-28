import { Platform } from "react-native";
export type ColorScheme = "light" | "dark";
export type ThemeColorPalette = { background: string; surface: string; foreground: string; muted: string; primary: string; border: string; success: string; warning: string; error: string; info: string; inkSoft: string; accentSoft: string; tint: string; icon: string; tabIconDefault: string; tabIconSelected: string };
export const Colors: Record<ColorScheme, ThemeColorPalette> = {
  light: { background: "#F6F2EA", surface: "#FFFDF8", foreground: "#1E1B2E", muted: "#77727E", primary: "#5B4B8A", border: "#E6DED2", success: "#3D8067", warning: "#C47D32", error: "#B95050", info: "#4D71A8", inkSoft: "#EFE8F7", accentSoft: "#E7E0F2", tint: "#5B4B8A", icon: "#77727E", tabIconDefault: "#9B93A4", tabIconSelected: "#5B4B8A" },
  dark: { background: "#12111A", surface: "#1D1A29", foreground: "#F9F7FF", muted: "#B9B1C8", primary: "#C9B8FF", border: "#3A3348", success: "#83D2AE", warning: "#F1BF78", error: "#F39A9A", info: "#9CB9F0", inkSoft: "#2B253A", accentSoft: "#302844", tint: "#C9B8FF", icon: "#B9B1C8", tabIconDefault: "#81788E", tabIconSelected: "#C9B8FF" },
};
export const Fonts = Platform.select({ ios: { display: "Avenir Next", body: "Avenir Next", mono: "Menlo" }, android: { display: "sans-serif-condensed", body: "sans-serif", mono: "monospace" }, web: { display: "ui-rounded", body: "system-ui", mono: "ui-monospace" }, default: { display: "sans-serif-condensed", body: "sans-serif", mono: "monospace" } });
