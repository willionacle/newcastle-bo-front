/**
 * View-token cache for member sensitive-data reveals
 * (NEWCASTLE_HANDOFF_FRONTEND_INTEGRATION §2.1).
 *
 * The server binds a viewToken (10 minutes) to the admin's session AND to one
 * member, so the cache is keyed per (member id, admin token). Memory only —
 * never persisted, and the operator's access password is never retained.
 */
const VIEW_TOKEN_TTL_MS = 10 * 60 * 1000;
// Drop a little early so a token is not sent seconds before it expires.
const EXPIRY_MARGIN_MS = 15 * 1000;

export interface SensitiveViewSession {
  get(userId: number, adminToken: string): string | undefined;
  accept(userId: number, adminToken: string, viewToken: string): void;
  /** Forget the token for one member (after a 403), or every token. */
  clear(userId?: number, adminToken?: string): void;
}

export function createSensitiveViewSession(): SensitiveViewSession {
  const tokens = new Map<string, { token: string; expiresAt: number }>();
  const keyOf = (userId: number, adminToken: string) => `${userId}\u0000${adminToken}`;

  return {
    get(userId, adminToken) {
      if (!adminToken) return undefined;
      const key = keyOf(userId, adminToken);
      const entry = tokens.get(key);
      if (!entry) return undefined;
      if (Date.now() >= entry.expiresAt) {
        tokens.delete(key);
        return undefined;
      }
      return entry.token;
    },
    accept(userId, adminToken, viewToken) {
      if (!adminToken || !viewToken) return;
      tokens.set(keyOf(userId, adminToken), {
        token: viewToken,
        expiresAt: Date.now() + VIEW_TOKEN_TTL_MS - EXPIRY_MARGIN_MS,
      });
    },
    clear(userId, adminToken) {
      if (userId === undefined) {
        tokens.clear();
        return;
      }
      if (adminToken === undefined) {
        const prefix = `${userId}\u0000`;
        for (const key of [...tokens.keys()]) if (key.startsWith(prefix)) tokens.delete(key);
        return;
      }
      tokens.delete(keyOf(userId, adminToken));
    },
  };
}
