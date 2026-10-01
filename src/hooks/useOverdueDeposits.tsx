import { useEffect, useRef, useState } from "react";
import { socket } from "@/api/socket";
import useUserStore from "@/store/user.store";

/** Pending deposit requests older than this (seconds) are flagged. 2m30s. */
export const OVERDUE_SECONDS = 150;

/** Full snapshot of pending deposit requests, pushed now and then every ~15 s. */
const SNAPSHOT_EVENT = "depositPendingSnapshot";
/** Ask for a snapshot right away. */
const SYNC_EVENT = "depositPendingSnapshot:sync";
/** Sent instead of data when the socket's admin token is missing/invalid/expired. */
const ERROR_EVENT = "depositPendingSnapshot:error";

/** Local interpolation of the elapsed time between pushes. */
const TICK_MS = 1000;

export interface PendingDeposit {
  id: number | string;
  transaction_type: "deposit" | "usdt";
  username: string;
  user_real_name: string;
  amount: number;
  status: "Applied" | "Waiting";
  created_at: string;
  /** Server-side elapsed seconds (the browser clock is not trusted). */
  elapsed_seconds: number;
}

export interface OverdueDeposit extends PendingDeposit {
  /** deposit_logs / USDT ids can collide, so the type is part of the key. */
  key: string;
  /** Elapsed seconds shown in the label. */
  ageSecondsDisplay: number;
}

export const overdueKey = (
  d: Pick<PendingDeposit, "transaction_type" | "id">
) => `deposit-overdue:${d.transaction_type}:${d.id}`;

interface Snapshot {
  items: PendingDeposit[];
  receivedAt: number;
}

/**
 * Last snapshot kept per tab so a reload doesn't blank the bar until the next push.
 * receivedAt is stored too, so elapsed time keeps counting across the reload.
 */
const CACHE_KEY = "deposit-overdue-snapshot";
/** Older cache is not trusted (a fresh snapshot arrives within seconds of connecting). */
const CACHE_STALE_MS = 60_000;

const readCache = (): Snapshot | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Snapshot;
    if (!Array.isArray(parsed?.items)) return null;
    if (typeof parsed?.receivedAt !== "number") return null;
    if (Date.now() - parsed.receivedAt > CACHE_STALE_MS) return null;

    return parsed;
  } catch {
    return null;
  }
};

const writeCache = (snapshot: Snapshot | null) => {
  try {
    if (snapshot) sessionStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
    else sessionStorage.removeItem(CACHE_KEY);
  } catch {
    // Private mode / quota: run on the socket alone
  }
};

const signatureOf = (list: OverdueDeposit[]) =>
  list.map((d) => `${d.key}@${d.ageSecondsDisplay}`).join("|");

const emptySnapshot = (): Snapshot => ({ items: [], receivedAt: Date.now() });

/**
 * Pending (Applied/Waiting) deposit requests older than OVERDUE_SECONDS.
 *
 * Rides the app's shared BO socket (`@/api/socket`, VITE_API_URL origin), which
 * useSocket (Layout) already connects with `auth: { token }` and reconnects on
 * token change / disconnects on logout. A second socket carrying the same
 * session token is exactly what sharedSocket.ts exists to avoid (duplicate-login
 * kicks, client request #21), so this hook only subscribes and emits.
 *
 * The server pushes the full pending list; the threshold is applied here. An
 * item missing from the next snapshot was processed, so it simply drops off.
 * On `depositPendingSnapshot:error` ("Unauthorized." / "Session expired.") the
 * data is cleared and nothing is shown until a valid session pushes again — no toast.
 */
const useOverdueDeposits = () => {
  const token = useUserStore((s) => s.token);
  const snapshotRef = useRef<Snapshot>(emptySnapshot());
  const signatureRef = useRef<string>("");
  const [overdue, setOverdue] = useState<OverdueDeposit[]>([]);

  useEffect(() => {
    if (!token) {
      writeCache(null);
      return;
    }

    // Restore from cache right away instead of waiting for the next push.
    snapshotRef.current = readCache() ?? emptySnapshot();

    // Interpolate between pushes so an item flips to overdue exactly on time.
    const evaluate = () => {
      const { items, receivedAt } = snapshotRef.current;
      const drift = (Date.now() - receivedAt) / 1000;

      const next = items.reduce<OverdueDeposit[]>((acc, item) => {
        const age = (Number(item.elapsed_seconds) || 0) + drift;
        if (age < OVERDUE_SECONDS) return acc;

        acc.push({
          ...item,
          key: overdueKey(item),
          ageSecondsDisplay: Math.floor(age),
        });
        return acc;
      }, []);

      // Oldest first
      next.sort((a, b) => b.ageSecondsDisplay - a.ageSecondsDisplay);

      const signature = signatureOf(next);
      if (signature === signatureRef.current) return;
      signatureRef.current = signature;
      setOverdue(next);
    };

    const requestSnapshot = () => socket.emit(SYNC_EVENT);

    const onSnapshot = (payload: { items?: PendingDeposit[] } | undefined) => {
      snapshotRef.current = {
        items: Array.isArray(payload?.items) ? payload!.items : [],
        receivedAt: Date.now(),
      };
      writeCache(snapshotRef.current);
      evaluate();
    };

    const onError = (_payload: { message?: string } | undefined) => {
      // "Unauthorized." / "Session expired." — stop showing data, quietly.
      snapshotRef.current = emptySnapshot();
      writeCache(null);
      evaluate();
    };

    socket.on("connect", requestSnapshot);
    socket.on(SNAPSHOT_EVENT, onSnapshot);
    socket.on(ERROR_EVENT, onError);

    // Already connected (or a follower tab relaying through the leader):
    // ask now too. A no-op if the transport isn't up yet; "connect" covers it.
    requestSnapshot();

    evaluate();
    const timer = setInterval(evaluate, TICK_MS);

    return () => {
      clearInterval(timer);
      // Pass the handler: a bare off(event) would drop other subscribers too.
      socket.off("connect", requestSnapshot);
      socket.off(SNAPSHOT_EVENT, onSnapshot);
      socket.off(ERROR_EVENT, onError);
      snapshotRef.current = emptySnapshot();
      signatureRef.current = "";
      setOverdue([]);
    };
  }, [token]);

  return overdue;
};

export default useOverdueDeposits;
