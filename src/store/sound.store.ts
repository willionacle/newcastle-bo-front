import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { Howler } from "howler";

// Cross-tab sync: toggling mute in one tab must silence every open tab.
const CHANNEL_NAME = "sound-mute-sync";
const channel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel(CHANNEL_NAME)
    : null;

interface SoundState {
  soundMuted: boolean;
  // broadcast=false when applying a change received from another tab, to avoid echo loops.
  setMuted: (muted: boolean, broadcast?: boolean) => void;
  toggleMuted: () => void;
}

const soundStore = create<SoundState>()(
  devtools(
    persist(
      (set, get) => ({
        soundMuted: false,
        setMuted: (muted, broadcast = true) => {
          Howler.mute(muted);
          set({ soundMuted: muted });
          if (broadcast && channel) {
            channel.postMessage({ soundMuted: muted });
          }
        },
        toggleMuted: () => get().setMuted(!get().soundMuted),
      }),
      {
        name: "soundStore",
        storage: createJSONStorage(() => localStorage),
        // A newly opened tab must honor the persisted mute state on load.
        onRehydrateStorage: () => (state) => {
          if (state) Howler.mute(state.soundMuted);
        },
      }
    )
  )
);

if (channel) {
  channel.onmessage = (event) => {
    const muted = event.data?.soundMuted;
    if (typeof muted === "boolean") {
      soundStore.getState().setMuted(muted, false);
    }
  };
}

export default soundStore;
