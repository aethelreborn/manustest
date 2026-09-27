import * as Api from "@/lib/_core/api";
import * as Auth from "@/lib/_core/auth";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform } from "react-native";

type UseAuthOptions = { autoFetch?: boolean };

export function useAuth(options?: UseAuthOptions) {
  const { autoFetch = true } = options ?? {};
  const [user, setUser] = useState<Auth.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (Platform.OS === "web") {
        const apiUser = await Api.getMe();
        if (!apiUser) { setUser(null); await Auth.clearUserInfo(); return; }
        const userInfo: Auth.User = { id: apiUser.id, openId: apiUser.openId, name: apiUser.name, email: apiUser.email, loginMethod: apiUser.loginMethod, lastSignedIn: new Date(apiUser.lastSignedIn) };
        setUser(userInfo);
        await Auth.setUserInfo(userInfo);
        return;
      }
      const token = await Auth.getSessionToken();
      const cachedUser = await Auth.getUserInfo();
      if (token && cachedUser) setUser(cachedUser);
      else setUser(null);
    } catch (err) { setError(err instanceof Error ? err : new Error("Failed to fetch user")); setUser(null); } finally { setLoading(false); }
  }, []);

  const logout = useCallback(async () => { try { await Api.logout(); } catch { /* local logout still clears the session */ } finally { await Auth.removeSessionToken(); await Auth.clearUserInfo(); setUser(null); setError(null); } }, []);
  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  useEffect(() => { if (!autoFetch) { setLoading(false); return; } void fetchUser(); }, [autoFetch, fetchUser]);
  return { user, loading, error, isAuthenticated, refresh: fetchUser, logout };
}
