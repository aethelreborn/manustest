import { useCallback, useEffect, useState } from "react";
import { createTRPCClient } from "@/lib/trpc";
import { signOutFirebase, useFirebaseUser } from "@/lib/firebase-auth";

export type AppUser = { id: number; openId: string; name: string | null; email: string | null; loginMethod: string | null; lastSignedIn: Date };
export function useAuth() {
  const firebaseUser = useFirebaseUser();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    let active = true;
    if (!firebaseUser) { setUser(null); setLoading(false); return () => { active = false; }; }
    setLoading(true);
    void createTRPCClient().auth.me.query().then((sqlUser) => { if (active) setUser(sqlUser ? { ...sqlUser, lastSignedIn: new Date(sqlUser.lastSignedIn) } : null); }).catch((reason) => { if (active) { setError(reason instanceof Error ? reason : new Error("Failed to load account")); setUser(null); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [firebaseUser]);
  const logout = useCallback(async () => { await signOutFirebase(); setUser(null); }, []);
  return { user, loading, error, isAuthenticated: Boolean(firebaseUser && user), refresh: () => undefined, logout };
}
