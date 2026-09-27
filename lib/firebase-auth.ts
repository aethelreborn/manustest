import { makeRedirectUri, useAutoDiscovery, useAuthRequest, ResponseType } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as SecureStore from "expo-secure-store";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signInWithPopup, signOut, type User } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

import { firebaseConfig, firebaseGoogleWebClientId } from "@/constants/firebase";

WebBrowser.maybeCompleteAuthSession();
const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export type FirebaseUser = User;
type StoredFirebaseSession = { uid: string; displayName: string | null; email: string | null; photoURL: string | null; idToken: string };
const SESSION_KEY = "aethel-firebase-session";

function toStoredSession(user: User, idToken: string): StoredFirebaseSession { return { uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL, idToken }; }
async function persistNativeSession(user: User) { if (Platform.OS === "web") return; const idToken = await user.getIdToken(); await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(toStoredSession(user, idToken))); }
async function getStoredNativeSession(): Promise<StoredFirebaseSession | null> { if (Platform.OS === "web") return null; const raw = await SecureStore.getItemAsync(SESSION_KEY); if (!raw) return null; try { const session = JSON.parse(raw) as StoredFirebaseSession; return session.uid && session.idToken ? session : null; } catch { return null; } }

export function useFirebaseUser() {
  const [user, setUser] = useState<FirebaseUser | StoredFirebaseSession | null>(firebaseAuth.currentUser);
  useEffect(() => { let active = true; void getStoredNativeSession().then((stored) => { if (active && !firebaseAuth.currentUser && stored) setUser(stored); }); const unsubscribe = onAuthStateChanged(firebaseAuth, (next) => { if (active) { setUser(next); if (next) void persistNativeSession(next); } }); return () => { active = false; unsubscribe(); }; }, []);
  return user;
}

export async function getFirebaseIdToken() { const current = firebaseAuth.currentUser; if (current) { const idToken = await current.getIdToken(); if (Platform.OS !== "web") await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(toStoredSession(current, idToken))); return idToken; } const stored = await getStoredNativeSession(); return stored?.idToken ?? null; }
export async function signInWithGoogleWeb() { if (Platform.OS !== "web") throw new Error("Web Google sign-in is only available on web"); const result = await signInWithPopup(firebaseAuth, new GoogleAuthProvider()); return result.user; }

export function useGoogleSignIn() {
  const discovery = useAutoDiscovery("https://accounts.google.com");
  const [request, response, promptAsync] = useAuthRequest({ clientId: firebaseGoogleWebClientId, redirectUri: makeRedirectUri({ scheme: "aethel" }), responseType: ResponseType.IdToken, scopes: ["openid", "profile", "email"] }, discovery);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => { if (response?.type !== "success") return; const idToken = response.authentication?.idToken ?? response.params?.id_token; if (!idToken) { setError(new Error("Google did not return an ID token")); return; } void signInWithCredential(firebaseAuth, GoogleAuthProvider.credential(idToken)).then((credential) => persistNativeSession(credential.user)).catch((reason) => setError(reason instanceof Error ? reason : new Error("Firebase sign-in failed"))); }, [response]);
  const signIn = useCallback(async () => { setError(null); try { if (Platform.OS === "web") { await signInWithGoogleWeb(); return; } if (!firebaseGoogleWebClientId) throw new Error("Set EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID for native Google sign-in"); await promptAsync(); } catch (reason) { const nextError = reason instanceof Error ? reason : new Error("Google sign-in failed"); setError(nextError); throw nextError; } }, [promptAsync]);
  return { request, response, signIn, error };
}

export async function signOutFirebase() { await signOut(firebaseAuth); if (Platform.OS !== "web") await SecureStore.deleteItemAsync(SESSION_KEY); }
