import useUserStore from "@/store/user.store";
import instance from "../axios";
import { AxiosResponse } from "axios";

// Stage별 포인트 지급 요청/응답 인터페이스
export interface StagePaymentRequest {
    username: string;         // 포인트 받을 사용자
    referralUsername: string; // 입금 달성한 추천인
}

export interface StagePaymentResponse {
    code: number;
    data?: {
        username: string;
        referralUsername: string;
        amount: number;
        totalCashDeposit: number;
        previousPoint?: number;  // Stage 3만
        newPoint?: number;       // Stage 3만
    };
    message: string;
}

// Stage 1: 100만원 달성 → 10만 포인트
export const referralPaymentStage1 = async (username: string, referralUsername: string) => {
    const { token } = useUserStore.getState();
    
    const res = await instance.post<
        StagePaymentRequest,
        AxiosResponse<StagePaymentResponse>
    >(
        '/api/referral-points/deposit-achievement/stage1',
        { username, referralUsername },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res;
}

// Stage 2: 500만원 달성 → 30만 포인트
export const referralPaymentStage2 = async (username: string, referralUsername: string) => {
    const { token } = useUserStore.getState();
    
    const res = await instance.post<
        StagePaymentRequest,
        AxiosResponse<StagePaymentResponse>
    >(
        '/api/referral-points/deposit-achievement/stage2',
        { username, referralUsername },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res;
}

// Stage 3: 1000만원 달성 → 100만 포인트
export const referralPaymentStage3 = async (username: string, referralUsername: string) => {
    const { token } = useUserStore.getState();
    
    const res = await instance.post<
        StagePaymentRequest,
        AxiosResponse<StagePaymentResponse>
    >(
        '/api/referral-points/deposit-achievement/stage3',
        { username, referralUsername },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res;
}

// Stage 4: 2000만원 달성 → 200만 포인트
export const referralPaymentStage4 = async (username: string, referralUsername: string) => {
    const { token } = useUserStore.getState();
    
    const res = await instance.post<
        StagePaymentRequest,
        AxiosResponse<StagePaymentResponse>
    >(
        '/api/referral-points/deposit-achievement/stage4',
        { username, referralUsername },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res;
}

// Stage 5: 5000만원 달성 → 500만 포인트
export const referralPaymentStage5 = async (username: string, referralUsername: string) => {
    const { token } = useUserStore.getState();
    
    const res = await instance.post<
        StagePaymentRequest,
        AxiosResponse<StagePaymentResponse>
    >(
        '/api/referral-points/deposit-achievement/stage5',
        { username, referralUsername },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res;
}

// Stage 6: 1억원 달성 → 1000만 포인트
export const referralPaymentStage6 = async (username: string, referralUsername: string) => {
    const { token } = useUserStore.getState();
    
    const res = await instance.post<
        StagePaymentRequest,
        AxiosResponse<StagePaymentResponse>
    >(
        '/api/referral-points/deposit-achievement/stage6',
        { username, referralUsername },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res;
}

// Stage 7: API에서 설정된 금액 달성 → API에서 설정된 포인트
export const referralPaymentStage7 = async (username: string, referralUsername: string) => {
    const { token } = useUserStore.getState();
    
    const res = await instance.post<
        StagePaymentRequest,
        AxiosResponse<StagePaymentResponse>
    >(
        '/api/referral-points/deposit-achievement/stage7',
        { username, referralUsername },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res;
}

// Stage 8: API에서 설정된 금액 달성 → API에서 설정된 포인트
export const referralPaymentStage8 = async (username: string, referralUsername: string) => {
    const { token } = useUserStore.getState();

    const res = await instance.post<
        StagePaymentRequest,
        AxiosResponse<StagePaymentResponse>
    >(
        '/api/referral-points/deposit-achievement/stage8',
        { username, referralUsername },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res;
}

// 이전 쿠폰 로그 생성 (포인트 지급 없이 로그만)
export const createPreviousCouponLog = async (
    username: string,
    referralUsername: string,
    stage: 1 | 2 | 3
) => {
    const { token } = useUserStore.getState();

    const res = await instance.post(
        '/api/referral-points/previous-coupon',
        { username, referralUsername, stage },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return res;
}