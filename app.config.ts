import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Aethel",
  slug: "aethel",
  version: "1.1.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "aethel",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: { supportsTablet: true, bundleIdentifier: "com.aethel.app", infoPlist: { ITSAppUsesNonExemptEncryption: false } },
  android: { adaptiveIcon: { backgroundColor: "#175B55", foregroundImage: "./assets/images/android-icon-foreground.png", backgroundImage: "./assets/images/android-icon-background.png", monochromeImage: "./assets/images/android-icon-monochrome.png" }, edgeToEdgeEnabled: true, predictiveBackGestureEnabled: false, package: "com.aethel.app", permissions: ["POST_NOTIFICATIONS"] },
  extra: { eas: { projectId: "ea838198-bbce-464e-a1c4-5b7e6e816b26" } },
  web: { bundler: "metro", output: "static", favicon: "./assets/images/favicon.png" },
  plugins: [
    "expo-router",
    ["expo-local-authentication", { faceIDPermission: "Allow Aethel to use Face ID to protect your vault." }],
    ["expo-splash-screen", { image: "./assets/images/splash-icon.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#FAFAF9" }],
    ["expo-build-properties", { android: { buildArchs: ["armeabi-v7a", "arm64-v8a"], minSdkVersion: 24 } }],
  ],
  experiments: { typedRoutes: true, reactCompiler: true },
};
export default config;
