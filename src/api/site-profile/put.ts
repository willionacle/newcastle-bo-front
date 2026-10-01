import instance from "../axios";
import useUserStore from "@/store/user.store";
import { AxiosResponse } from "axios";
import { PostRes } from "../types";
import { SiteProfileData, SiteProfilePreset } from "./get";

// Either a preset shortcut, or any subset of the five flags — never both,
// and always one request. See doc §3: five separate calls can half-apply
// and leave the site selling a combination nobody chose.
export type SiteProfilePutPayload =
  | { preset: SiteProfilePreset }
  | Partial<{
      live: boolean;
      slot: boolean;
      sports: boolean;
      minigame: boolean;
      special: boolean;
    }>;

// A partial failure comes back as code 1 with a message naming the
// categories that didn't save (usually: seed migration never applied to
// this client's DB) — not a crash, show response.data.message.
export const putSiteProfileAPI = (payload: SiteProfilePutPayload) => {
  const { token } = useUserStore.getState();
  return instance.put<undefined, AxiosResponse<PostRes<SiteProfileData>>>(
    "/api/site-profile",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
