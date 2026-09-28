import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from "expo-auth-session";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithPopup, signOut, type User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

import { firebaseConfig, firebaseGoogleWebClientId } from "@/constants/firebase";
import { buildGoogleAuthUrl, readGoogleIdToken } from "@/lib/google-auth-url";

WebBrowser.maybeCompleteAuthSession();
const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export type FirebaseUser = User;
type StoredFirebaseSession = { uid: string; displayName: string | null; email: string | null; photoURL: string | null; idToken: string };
const SESSION_KEY = "aethel-firebase-session";

export function getGoogleRedirectUri() {
  return makeRedirectUri({ scheme: "aethel", path: "oauth/callback" });
}

function toStoredSession(user: User, idToken: string): StoredFirebaseSession { return { uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL, idToken }; }
async function persistNativeSession(user: User) { if (Platform.OS === "web") return; const idToken = await user.getIdToken(); await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(toStoredSession(user, idToken))); }
async function getStoredNativeSession(): Promise<StoredFirebaseSession | null> { if (Platform.OS === "web") return null; const raw = await SecureStore.getItemAsync(SESSION_KEY); if (!raw) return null; try { const session = JSON.parse(raw) as StoredFirebaseSession; return session.uid && session.idToken ? session : null; } catch { return null; } }

export function useFirebaseUser() {
  const [user, setUser] = useState<FirebaseUser | StoredFirebaseSession | null>(firebaseAuth.currentUser);
  useEffect(() => { let active = true; void getStoredNativeSession().then((stored) => { if (active && !firebaseAuth.currentUser && stored) setUser(stored); }); const unsubscribe = onAuthStateChanged(firebaseAuth, (next) => { if (active) { setUser(next); if (next) void persistNativeSession(next); } }); return () => { active = false; unsubscribe(); }; }, []);
  return user;
}

export async function getFirebaseIdToken() { const current = firebaseAuth.currentUser; if (current) { const idToken = await current.getIdToken(); if (Platform.OS !== "web") await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(toStoredSession(current, idToken))); return idToken; } const stored = await getStoredNativeSession(); return stored?.idToken ?? null; }
export async function signInWithGoogleWeb() { if (Platform.OS !== "web") throw new Error("Google web sign-in is only available in a browser."); const result = await signInWithPopup(firebaseAuth, new GoogleAuthProvider()); return result.user; }

async function signInWithGoogleBrowser() {
  if (!firebaseGoogleWebClientId) throw new Error("Google sign-in is not configured. Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID.");
  const redirectUri = getGoogleRedirectUri();
  const nonceBytes = await Crypto.getRandomBytesAsync(16);
  const nonce = Array.from(nonceBytes).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  const authUrl = buildGoogleAuthUrl(firebaseGoogleWebClientId, redirectUri, nonce);
  const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
  if (result.type !== "success") throw new Error("Google sign-in was cancelled or the browser could not return to Aethel.");
  const idToken = readGoogleIdToken(result.url);
  if (!idToken) throw new Error(`Google did not return an ID token. Add this redirect URI to your Google OAuth client: ${redirectUri}`);
  const credential = await signInWithCredential(firebaseAuth, GoogleAuthProvider.credential(idToken));
  await persistNativeSession(credential.user);
  return credential.user;
}

export function useGoogleSignIn() {
  const [error, setError] = useState<Error | null>(null);
  const signIn = useCallback(async () => { setError(null); try { if (Platform.OS === "web") return await signInWithGoogleWeb(); return await signInWithGoogleBrowser(); } catch (reason) { const error = reason instanceof Error ? reason : new Error("Google sign-in failed."); setError(error); throw error; } }, []);
  return { signIn, error };
}

export async function signOutFirebase() { await signOut(firebaseAuth); if (Platform.OS !== "web") await SecureStore.deleteItemAsync(SESSION_KEY); }
