import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AethelProvider } from "@/lib/aethel-store";
import { AethelPreferencesProvider } from "@/lib/aethel-preferences";
import { ThemeProvider } from "@/lib/theme-provider";

export default function RootLayout() {
  return <ThemeProvider><AethelPreferencesProvider><AethelProvider><StatusBar style="auto" /><Stack initialRouteName="index" screenOptions={{ headerShown: false, animation: "none" }} /></AethelProvider></AethelPreferencesProvider></ThemeProvider>;
}
