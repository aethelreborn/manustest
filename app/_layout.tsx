import "../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { AethelProvider } from "@/lib/aethel-store";
import { ThemeProvider } from "@/lib/theme-provider";

export default function RootLayout() {
  return <ThemeProvider><AethelProvider><StatusBar style="auto" /><Stack initialRouteName="index" screenOptions={{ headerShown: false }} /></AethelProvider></ThemeProvider>;
}
