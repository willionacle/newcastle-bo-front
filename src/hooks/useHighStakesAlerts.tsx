import { useCallback, useEffect, useRef, useState } from "react";
import { Howl } from "howler";
import useUserStore from "@/store/user.store";
import { getHighStakesRecent } from "@/api/high-stakes/get-recent";
import { getHighStakesThresholds } from "@/api/high-stakes/get-thresholds";
import highStakesAudio from "@/assets/audio/highStakes.mp3";

const POLL_INTERVAL_MS = 10_000;

// Drives the 고액배팅 header counter (client request 20). HTTP-polled, not
// socket-pushed like the rest of the top bar -- see
// HIGH_STAKES_ALERT_FRONTEND_INTEGRATION.md §2 & §4 for the cursor protocol
// this implements:
//
// - First call has no afterId (baseline) -- synced:true, never sounds.
// - nextAfterId is stored from EVERY response, including empty ones.
// - hasMore:true re-polls immediately instead of waiting for the next tick.
// - The cursor lives only in a ref (this hook's lifetime) -- a reload
//   re-baselines rather than replaying alerts the operator already heard.
//
// Unlike the shared notifSound loop in Header.tsx, this fires once per
// qualifying poll rather than looping until dismissed (ten fireworks during
// a busy match would just get muted out by the operator). The badge itself
// accumulates across polls and only clears via resetUnseen(), matching how
// the other header counters behave.
//
// Polling only runs while `anyActive` is true (thresholds GET's data2) --
// the feature ships inert (all five categories at amount 0 / is_active 0),
// so there's nothing to poll for until an operator turns a category on.
const useHighStakesAlerts = () => {
  const token = useUserStore((state) => state.token);
  const { anyActive } = getHighStakesThresholds();
  const [unseenCount, setUnseenCount] = useState(0);
  const afterIdRef = useRef<number | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const resetUnseen = useCallback(() => setUnseenCount(0), []);

  const poll = useCallback(async () => {
    try {
      const res = await getHighStakesRecent(afterIdRef.current);
      if (!mountedRef.current) return;

      // The id scanned up to, not the last id returned -- store it even when
      // nothing qualified, or the cursor sticks and the same range is
      // rescanned forever.
      afterIdRef.current = res.nextAfterId;

      const count = res.count ?? res.data.length;
      if (!res.synced && count > 0) {
        new Howl({ src: [highStakesAudio] }).play();
        setUnseenCount((prev) => prev + count);
      }

      if (res.hasMore) {
        poll();
        return;
      }
    } catch {
      // Transient failure -- next tick retries with the same stored cursor.
    }

    if (mountedRef.current) {
      timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
    }
  }, []);

  useEffect(() => {
    if (!token || !anyActive) return;

    mountedRef.current = true;
    afterIdRef.current = undefined;
    poll();

    return () => {
      mountedRef.current = false;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [token, anyActive, poll]);

  return { unseenCount, resetUnseen };
};

export default useHighStakesAlerts;
