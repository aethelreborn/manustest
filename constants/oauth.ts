import * as ReactNative from "react-native";

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";
export function getApiBaseUrl() { if (API_BASE_URL) return API_BASE_URL.replace(/\/$/, ""); if (ReactNative.Platform.OS === "web" && typeof window !== "undefined" && window.location) { const { protocol, hostname } = window.location; const apiHostname = hostname.replace(/^8081-/, "3000-"); if (apiHostname !== hostname) return `${protocol}//${apiHostname}`; } return ""; }
