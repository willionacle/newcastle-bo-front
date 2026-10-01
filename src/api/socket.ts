import { createSharedSocket } from "@/utils/sharedSocket";

// See sharedSocket.ts for why this isn't a plain `io()` call: only one open
// tab actually holds this connection, the rest relay through it.
export const socket = createSharedSocket(import.meta.env.VITE_API_URL, {
  autoConnect: false,
});
