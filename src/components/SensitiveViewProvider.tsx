import { createContext, ReactNode, useContext, useEffect, useMemo } from "react";
import useUserStore from "@/store/user.store";
import { createSensitiveViewSession, SensitiveViewSession } from "@/utils/sensitiveViewSession";

const Context = createContext<SensitiveViewSession | null>(null);

/**
 * Scopes the sensitive-data view tokens to one screen. Mounted around the
 * member detail page; leaving the page (or a different admin signing in)
 * drops every cached token. Without a provider, SensitiveReveal still works —
 * it simply asks for the access password on every reveal.
 */
export function SensitiveViewProvider({ children }: { children: ReactNode }) {
  const adminToken = useUserStore((state) => state.token);
  // A new admin session gets a fresh cache.
  const session = useMemo(() => createSensitiveViewSession(), [adminToken]);
  // Clearing (not disposing) is StrictMode-safe.
  useEffect(() => () => session.clear(), [session]);
  return <Context.Provider value={session}>{children}</Context.Provider>;
}

export function useSensitiveView() {
  return useContext(Context);
}
