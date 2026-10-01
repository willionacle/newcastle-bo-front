import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";

// NOTE on base path: the reference doc for this feature writes every referral-point
// endpoint as singular `/api/referral-point/...`. Every referral endpoint already
// live in this codebase (achievement-status, deposit-achievement/stageN in
// src/api/referral-logs/*.tsx) uses the plural `/api/referral-points/...` and is
// working in production. We follow the plural form here for consistency. If these
// two new calls 404, that mismatch is the first thing to check against the actual
// backoffice-api route file.
const REFERRAL_REWARDS_BASE = "/api/referral-points/rewards";

export type ReferralRewardKind = "ROLLING" | "PROFIT";

export interface ReferralRewardItem {
  kind: ReferralRewardKind;
  referrer: string;
  referee: string;
  statDate: string;
  amount: number;
  basis: number;
}

export interface ReferralRewardsRunData {
  from: string;
  to: string;
  dryRun: boolean;
  refereeDays: number;
  planned: number;
  plannedAmount: number;
  granted: number;
  grantedAmount: number;
  skippedAlreadyPaid: number;
  failed: number;
  settings?: Record<string, unknown>;
  // preview only
  items?: ReferralRewardItem[];
  itemsTruncated?: boolean;
}

export interface ReferralRewardsRunResponse {
  code: number;
  message: string;
  data: ReferralRewardsRunData;
}

// 미리보기 — 계산만 하고 아무것도 저장하지 않음
export const previewReferralRewards = async (
  from: string,
  to: string
): Promise<ReferralRewardsRunResponse> => {
  const { token } = useUserStore.getState();

  const res = await instance.post<
    { from: string; to: string },
    AxiosResponse<ReferralRewardsRunResponse>
  >(
    `${REFERRAL_REWARDS_BASE}/preview`,
    { from, to },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// 실행 — 계산 후 포인트를 실제로 지급
export const runReferralRewards = async (
  from: string,
  to: string
): Promise<ReferralRewardsRunResponse> => {
  const { token } = useUserStore.getState();

  const res = await instance.post<
    { from: string; to: string },
    AxiosResponse<ReferralRewardsRunResponse>
  >(
    `${REFERRAL_REWARDS_BASE}/run`,
    { from, to },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
