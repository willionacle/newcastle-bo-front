import instance from "../axios";
import useUserStore from "@/store/user.store";
import { AxiosResponse } from "axios";

// 레퍼럴 설정 응답 타입
export interface ReferralConfigResponse {
  code: number;
  data: {
    depositStages: {
      stage1: { threshold: number | null; reward: number | null };
      stage2: { threshold: number | null; reward: number | null };
      stage3: { threshold: number | null; reward: number | null };
      stage4: { threshold: number | null; reward: number | null };
      stage5: { threshold: number | null; reward: number | null };
      stage6: { threshold: number | null; reward: number | null };
      stage7: { threshold: number | null; reward: number | null };
      stage8: { threshold: number | null; reward: number | null };
    };
    rollingPoint: {
      rate: number;
      max: number;
    };
  };
}

// 레퍼럴 설정 가져오기
export const getReferralConfig = async (): Promise<ReferralConfigResponse> => {
  const { token } = useUserStore.getState();

  const res = await instance.get<undefined, AxiosResponse<ReferralConfigResponse>>(
    '/api/system-config/referral/formatted',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};

// 단일 설정값 조회 (거래 규칙: 출금 이력 후 보너스 지급 토글)
// NOTE: the only precedent for this file was the bespoke referral/formatted
// endpoint above — there's no other existing usage of a generic per-key GET
// in this codebase. The integration spec only documents the PUT shape
// (`PUT /api/system-config/:key {value}`); this GET mirrors it symmetrically.
// Confirm this route against the live backoffice-api before relying on it.
// `typedValue` is additive — most existing keys (maintenance, etc.) only ever
// read `.value` (raw string) and keep working unchanged. New callers should
// bind to `typedValue` instead, per ATTENDANCE_FRONTEND_INTEGRATION.md §6 —
// it's the properly-typed (number/boolean) form of the same setting, and 0
// is a meaningful configured value there, not "unset".
export interface SystemConfigValueResponse {
  code: number;
  message: string;
  data: { key: string; value: string; typedValue?: number | boolean | string } | null;
}

export const getSystemConfigValue = async (key: string): Promise<SystemConfigValueResponse> => {
  const { token } = useUserStore.getState();

  const res = await instance.get<undefined, AxiosResponse<SystemConfigValueResponse>>(
    `/api/system-config/${key}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};