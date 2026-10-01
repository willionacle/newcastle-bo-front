import useUserStore from "@/store/user.store";
import { User } from "../users/get";
import useQuery from "@/hooks/useQuery";
import instance from "../axios";
import { AxiosResponse } from "axios";
import useSWR from "swr";
import { NXAPI, SWRType } from "../types";

export interface ReferralLogData extends NXAPI {
  username: User["username"];
  type: string;
  amount: number;
  system_note: string;
  admin_id: string;
  type2: null | string;
  total_referral_count: null | number;
  active_referral_count: null | number;
  total_rolling: null | number;
  rolling_percentage: null | number;
  max_amount: null | number;
  prev_referral_point: null | number;
}
// 전체 지인추천 요약 리스트용 (/promotion/referral-log)
export interface ReferralSummary {
  id: number;
  username: string;
  user_real_name: string;
  referral_count: number;         // 총 지인 수
  deposit_referral_count: number;  // 입금지인수
  amount: number;                  // 지급금액
}

// 개별 지인 상세 정보용 (유저 상세 페이지)
export interface ReferralDetail {
  username: string;
  userRealName: string;
  nickname: string | null;
  createdAt: string;           // 가입일
  userStatus: string;          // 회원상태
  userLevel: number;
  referralPoint: number;
  totalDeposit: number;        // 입금
  netDeposit: number;          // 입출차액
  totalBet: number;            // 베팅
  betResult: number;           // 베팅손익
  stage1Status: 'granted' | 'eligible' | 'not_eligible';   // 1차 상태
  stage2Status: 'granted' | 'eligible' | 'not_eligible';   // 2차 상태
  stage3Status: 'granted' | 'eligible' | 'not_eligible';   // 3차 상태
  stage4Status: 'granted' | 'eligible' | 'not_eligible';   // 4차 상태
  stage5Status: 'granted' | 'eligible' | 'not_eligible';   // 5차 상태
  stage6Status: 'granted' | 'eligible' | 'not_eligible';   // 6차 상태
  stage7Status: 'granted' | 'eligible' | 'not_eligible';   // 7차 상태
  stage8Status: 'granted' | 'eligible' | 'not_eligible';   // 8차 상태
  stage1Eligible: number;      // 1차 지급 가능 여부 (1 or 0)
  stage2Eligible: number;      // 2차 지급 가능 여부 (1 or 0)
  stage3Eligible: number;      // 3차 지급 가능 여부 (1 or 0)
  stage4Eligible: number;      // 4차 지급 가능 여부 (1 or 0)
  stage5Eligible: number;      // 5차 지급 가능 여부 (1 or 0)
  stage6Eligible: number;      // 6차 지급 가능 여부 (1 or 0)
  stage7Eligible: number;      // 7차 지급 가능 여부 (1 or 0)
  stage8Eligible: number;      // 8차 지급 가능 여부 (1 or 0)
  lastLogin: string;           // 최근접속일
  userId: number; // 유저 ID
  userTotalDepositCount: number;  // 유저 입금횟수 (up_users 기준)
  userTotalDeposit: number;  // 유저 입금액 (up_users 기준)
  userNetDeposit: number; // 유저 입출차 (up_users 기준)
  userNetWin: number; // 유저 윈로스 (up_users 기준)
  userTotalBet: number; // 유저 베팅 (up_users 기준)
}

export const findReferralLogAPI = (username?: User["username"] | undefined) => {
  const {token, userid} = useUserStore.getState();
  const { query, onHeaderCell, paginationProps, setFilters } = useQuery({
    filter: {
      userid      : userid,
      page				: 1,
      limit				: 100,
      orderby     : 'desc',
      columnby    : 'id',
      username    : username ?? null,
      start_date  : null,
      end_date    : null,
      type        : null,
      system_note : null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<ReferralLogData[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/referralpointlog", query], fetcher);

  return { swr, onHeaderCell, paginationProps, setFilters };
};

export const referralLogAPI = (username?: User["username"] | undefined) => {
  const {token, userid} = useUserStore.getState();
  const { query, onHeaderCell, paginationProps, setFilters } = useQuery({
    filter: {
      userid      : userid,
      page				: 1,
      limit				: 100,
      orderby     : 'desc',
      columnby    : 'referral_count',
      username    : username ?? null,
      start_date  : null,
      end_date    : null,
      type        : null,
      system_note : null,
    },
  });

  const fetcher = async ([url, query]: [string, string]) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<SWRType<ReferralSummary[]>>
    >(`${url}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  };

  const swr = useSWR(["/referrallist", query], fetcher);

  return { swr, onHeaderCell, paginationProps, setFilters };
};

export const referralLogAPI2 = (username?: User["username"] | undefined) => {
  const { token } = useUserStore.getState();

  const fetcher = async (url: string) => {
    const res = await instance.get<
      undefined,
      AxiosResponse<{
        code: number;
        data: {
          username: string;
          referrals: ReferralDetail[];
          totalCount: number;
        };
        message: string;
      }>
    >(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    return res.data.data

    // // API 응답을 ReferralDetail 형식으로 변환
    // const transformedData: SWRType<ReferralDetail[]> = {
    //   code: res.data.code,
    //   data: res.data.data?.referrals?.map((ref, index) => ({
    //     id: index, // 인덱스를 ID로 사용
    //     username: ref.username,
    //     referral_username: res.data.data.username, // 추천인 username
    //     user_real_name: ref.userRealname || '',
    //     deposit_amount: ref.totalDeposit,
    //     dw_sum: ref.netDeposit, // 입출차액
    //     bet_amount: ref.totalBet,
    //     bw_sum: ref.betResult, // 베팅손익
    //     created_at: ref.createdAt,
    //     last_active_at: ref.lastLogin,
    //     user_status: ref.userStatus,
    //     payment_status: 0, // API에서 제공하지 않으므로 기본값
    //     payment_1: ref.stage1Eligible,
    //     payment_2: ref.stage2Eligible,
    //     payment_3: ref.stage3Eligible,
    //   })) || [],
    //   message: res.data.message || '',
    //   items: res.data.data?.totalCount || 0,
    //   pages: 1
    // };

    // return transformedData;
  };

  const swr = useSWR(
    username ? `/api/referral-points/achievement-status/${username}` : null,
    fetcher
  );

  return { swr };
};