import instance from "../axios";
import useUserStore from "@/store/user.store";
import { AxiosResponse } from "axios";

// 설정 업데이트 요청 타입
export interface ConfigUpdateItem {
  key: string;
  value: number;
}

export interface UpdateReferralConfigRequest {
  configs: ConfigUpdateItem[];
}

export interface UpdateReferralConfigResponse {
  code: number;
  data?: {
    updatedCount: number;
  };
  message: string;
}

// 레퍼럴 설정 업데이트
export const updateReferralConfig = async (configs: ConfigUpdateItem[]): Promise<UpdateReferralConfigResponse> => {
  const { token } = useUserStore.getState();

  const res = await instance.put<
    UpdateReferralConfigRequest,
    AxiosResponse<UpdateReferralConfigResponse>
  >(
    '/api/system-config/referral',
    { configs },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};

// 단일 설정값 저장 (거래 규칙: 출금 이력 후 보너스 지급 토글, 사이트 점검 설정 등)
export interface UpdateSystemConfigValueResponse {
  code: number;
  message: string;
  data?: { key: string; value: string };
}

// value is intentionally `string`, not `"0" | "1"` — this same endpoint also
// backs free-text keys (MAINTENANCE_MESSAGE, MAINTENANCE_UNTIL,
// MAINTENANCE_ALLOW_IPS in SiteMaintenance.tsx), not just boolean toggles.
export const updateSystemConfigValue = async (
  key: string,
  value: string
): Promise<UpdateSystemConfigValueResponse> => {
  const { token } = useUserStore.getState();

  const res = await instance.put<
    { value: string },
    AxiosResponse<UpdateSystemConfigValueResponse>
  >(
    `/api/system-config/${key}`,
    { value },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};