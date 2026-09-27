import { Platform } from "react-native";
export type ColorScheme = "light" | "dark";
export type ThemeColorPalette = { background: string; surface: string; foreground: string; muted: string; primary: string; border: string; success: string; warning: string; error: string; info: string; inkSoft: string; accentSoft: string; tint: string; icon: string; tabIconDefault: string; tabIconSelected: string };
export const Colors: Record<ColorScheme, ThemeColorPalette> = {
  light: { background: "#F4F5F1", surface: "#FFFFFF", foreground: "#102321", muted: "#667572", primary: "#175B55", border: "#DCE5E0", success: "#2D8A67", warning: "#C78225", error: "#C94A4A", info: "#3F6FBF", inkSoft: "#E6F0EC", accentSoft: "#D7ECE6", tint: "#175B55", icon: "#667572", tabIconDefault: "#93A49F", tabIconSelected: "#175B55" },
  dark: { background: "#0B1112", surface: "#132022", foreground: "#F2F7F4", muted: "#A6B8B3", primary: "#78D2C3", border: "#2A3D3D", success: "#74D2A6", warning: "#F0BD69", error: "#F07D7D", info: "#87A9F0", inkSoft: "#1B3130", accentSoft: "#193A37", tint: "#78D2C3", icon: "#A6B8B3", tabIconDefault: "#718783", tabIconSelected: "#78D2C3" },
};
export const Fonts = Platform.select({
  ios: { sans: "Avenir Next", rounded: "Avenir Next", mono: "Menlo", display: "Avenir Next" },
  android: { sans: "sans-serif", rounded: "sans-serif", mono: "monospace", display: "sans-serif" },
  default: { sans: "sans-serif", rounded: "sans-serif", mono: "monospace", display: "sans-serif" },
  web: { sans: "Georgia", rounded: "Georgia", mono: "ui-monospace", display: "Georgia" },
});
