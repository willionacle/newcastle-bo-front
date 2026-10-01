import { io, Socket } from "socket.io-client";

type Listener = (...args: any[]) => void;

type Message =
  | { type: "event"; event: string; args: any[] }
  | { type: "status"; connected: boolean }
  | { type: "emit"; event: string; args: any[] };

// The subset of the socket.io client API actually used across the codebase
// (useSocket.tsx, Header.tsx, Inquiry.tsx, Layout.tsx's sports socket) —
// consumers don't need to change, they just import `socket` as before.
export interface SharedSocket {
  readonly connected: boolean;
  auth: Record<string, unknown>;
  connect(): void;
  disconnect(): void;
  on(event: string, cb: Listener): void;
  off(event: string, cb?: Listener): void;
  emit(event: string, ...args: any[]): void;
}

/**
 * Wraps a socket.io connection so only ONE browser tab holds the live
 * transport connection at a time (the "leader"); every other tab ("follower")
 * relays incoming events from, and outgoing emits to, the leader over
 * BroadcastChannel. From each consumer's point of view this behaves like a
 * normal socket.io-client instance.
 *
 * Why: opening a second admin tab was getting the whole session kicked with
 * "Check Your Permission" (client request #21, 2026-08-27). The backend's
 * multi-session model (commit 415025d, 2026-08-23) issues one session per
 * *login*, but every tab previously opened its own independent socket
 * connection carrying that same session's token — which looks, at the
 * connection layer, identical to the token being used from two places at
 * once. Sharing a single real connection across tabs avoids ever presenting
 * a second live connection for one session. (Mitigation, not a confirmed
 * root-cause fix — see the analysis attached to client request #21. If tabs
 * still get kicked with this in place, the trigger is elsewhere, e.g. plain
 * /validatetoken polling, and needs a backend-side answer.)
 *
 * Leader election uses the Web Locks API: exactly one tab can hold
 * `${url}:leader` at a time, and the browser releases it automatically when
 * that tab closes or crashes, so another open tab takes over with no manual
 * heartbeat/timeout bookkeeping. Browsers without Web Locks or
 * BroadcastChannel (very old Safari) fall back to every tab connecting
 * directly — the pre-existing behavior.
 */
export function createSharedSocket(
  url: string,
  ioOptions: Record<string, unknown> = {}
): SharedSocket {
  const canShare =
    typeof window !== "undefined" &&
    "BroadcastChannel" in window &&
    "locks" in navigator;

  const bc = canShare ? new BroadcastChannel(`rp-bo-socket:${url}`) : null;

  let real: Socket | null = null;
  let isLeader = !canShare; // no cross-tab support: act as leader unconditionally
  let connected = false;
  let wantConnected = false;
  let auth: Record<string, unknown> = { ...((ioOptions.auth as object) ?? {}) };

  const listeners = new Map<string, Set<Listener>>();

  const dispatchLocal = (event: string, args: any[]) => {
    listeners.get(event)?.forEach((cb) => cb(...args));
  };

  const setConnected = (value: boolean, broadcast: boolean) => {
    if (connected === value) return;
    connected = value;
    dispatchLocal(value ? "connect" : "disconnect", []);
    if (broadcast) bc?.postMessage({ type: "status", connected: value } satisfies Message);
  };

  const ensureRealConnection = () => {
    if (!isLeader || !wantConnected || real) return;

    real = io(url, { ...ioOptions, auth });
    real.on("connect", () => setConnected(true, true));
    real.on("disconnect", () => setConnected(false, true));
    real.onAny((event: string, ...args: any[]) => {
      dispatchLocal(event, args);
      bc?.postMessage({ type: "event", event, args } satisfies Message);
    });
  };

  const becomeLeader = () => {
    isLeader = true;
    ensureRealConnection();
  };

  if (bc) {
    bc.onmessage = ({ data }: MessageEvent<Message>) => {
      if (isLeader) {
        if (data.type === "emit" && real) real.emit(data.event, ...data.args);
        return;
      }
      if (data.type === "event") dispatchLocal(data.event, data.args);
      else if (data.type === "status") setConnected(data.connected, false);
    };
  }

  if (canShare) {
    // Held for as long as this tab is open; released automatically on close
    // or crash, letting the next waiting tab become leader.
    navigator.locks.request(`rp-bo-socket:${url}:leader`, () => {
      becomeLeader();
      return new Promise<void>(() => {});
    });
  }

  return {
    get connected() {
      return connected;
    },
    get auth() {
      return auth;
    },
    set auth(value: Record<string, unknown>) {
      auth = value;
      if (real) real.auth = value;
    },
    connect() {
      wantConnected = true;
      if (isLeader) {
        ensureRealConnection();
        if (real && !real.connected) real.connect();
      }
      // Followers: nothing to do locally — once this tab wins leadership
      // (see the lock callback above) becomeLeader() picks up wantConnected.
    },
    disconnect() {
      wantConnected = false;
      real?.disconnect();
    },
    on(event, cb) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event)!.add(cb);
    },
    off(event, cb) {
      if (!cb) listeners.delete(event);
      else listeners.get(event)?.delete(cb);
    },
    emit(event, ...args) {
      if (isLeader) real?.emit(event, ...args);
      else bc?.postMessage({ type: "emit", event, args } satisfies Message);
    },
  };
}
