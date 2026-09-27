import { getFirebaseIdToken, signOutFirebase, type FirebaseUser } from "@/lib/firebase-auth";

export type User = Pick<FirebaseUser, "uid" | "displayName" | "email" | "photoURL">;
export const getSessionToken = getFirebaseIdToken;
export async function removeSessionToken() { await signOutFirebase(); }
export async function setSessionToken(_token: string) { /* Firebase manages refreshable sessions internally. */ }
export async function getUserInfo(): Promise<User | null> { const user = (await import("@/lib/firebase-auth")).firebaseAuth.currentUser; return user ? { uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL } : null; }
export async function setUserInfo(_user: User) { /* Firebase Auth is the source of truth. */ }
export async function clearUserInfo() { /* Firebase Auth clears account state on sign out. */ }
