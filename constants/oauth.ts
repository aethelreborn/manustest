import * as Linking from "expo-linking";
import * as ReactNative from "react-native";

const bundleId = "space.manus.aethel";
const schemeFromBundleId = "aethel";
const env = { portal: process.env.EXPO_PUBLIC_OAUTH_PORTAL_URL ?? "", server: process.env.EXPO_PUBLIC_OAUTH_SERVER_URL ?? "", appId: process.env.EXPO_PUBLIC_APP_ID ?? "", ownerId: process.env.EXPO_PUBLIC_OWNER_OPEN_ID ?? "", ownerName: process.env.EXPO_PUBLIC_OWNER_NAME ?? "", apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "", deepLinkScheme: schemeFromBundleId };
export const OAUTH_PORTAL_URL = env.portal;
export const OAUTH_SERVER_URL = env.server;
export const APP_ID = env.appId;
export const OWNER_OPEN_ID = env.ownerId;
export const OWNER_NAME = env.ownerName;
export const API_BASE_URL = env.apiBaseUrl;
export function getApiBaseUrl() { if (API_BASE_URL) return API_BASE_URL.replace(/\/$/, ""); if (ReactNative.Platform.OS === "web" && typeof window !== "undefined" && window.location) { const { protocol, hostname } = window.location; const apiHostname = hostname.replace(/^8081-/, "3000-"); if (apiHostname !== hostname) return `${protocol}//${apiHostname}`; } return ""; }
export const SESSION_TOKEN_KEY = "app_session_token";
export const USER_INFO_KEY = "manus-runtime-user-info";
const encodeState = (value: string) => typeof globalThis.btoa === "function" ? globalThis.btoa(value) : value;
export const getRedirectUri = () => ReactNative.Platform.OS === "web" ? `${getApiBaseUrl()}/api/oauth/callback` : Linking.createURL("/oauth/callback", { scheme: env.deepLinkScheme });
export const getLoginUrl = () => { if (!OAUTH_PORTAL_URL || !APP_ID) throw new Error("Manus OAuth is not configured"); const url = new URL(`${OAUTH_PORTAL_URL}/app-auth`); url.searchParams.set("appId", APP_ID); url.searchParams.set("redirectUri", getRedirectUri()); url.searchParams.set("state", encodeState(getRedirectUri())); url.searchParams.set("type", "signIn"); return url.toString(); };
export async function startOAuthLogin() { const loginUrl = getLoginUrl(); if (ReactNative.Platform.OS === "web") { if (typeof window !== "undefined") window.location.href = loginUrl; return null; } if (!(await Linking.canOpenURL(loginUrl))) throw new Error("OAuth URL cannot be opened"); await Linking.openURL(loginUrl); return null; }
