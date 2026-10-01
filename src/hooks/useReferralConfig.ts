import useSWR from 'swr';
import { getReferralConfig } from '@/api/system-config/get';

export interface StageConfig {
    threshold: number | null;
    reward: number | null;
}

export interface ReferralConfigData {
    stage1: StageConfig;
    stage2: StageConfig;
    stage3: StageConfig;
    stage4: StageConfig;
    stage5: StageConfig;
    stage6: StageConfig;
    stage7: StageConfig;
    stage8: StageConfig;
    rollingRate: number;
    rollingMax: number;
}

const useReferralConfig = () => {
    const fetcher = async () => {
        const response = await getReferralConfig();
        
        if (response.code === 0) {
            const { depositStages, rollingPoint } = response.data;
            
            return {
                stage1: depositStages.stage1,
                stage2: depositStages.stage2,
                stage3: depositStages.stage3,
                stage4: depositStages.stage4,
                stage5: depositStages.stage5,
                stage6: depositStages.stage6,
                stage7: depositStages.stage7,
                stage8: depositStages.stage8,
                rollingRate: rollingPoint.rate,
                rollingMax: rollingPoint.max
            } as ReferralConfigData;
        }
        
        throw new Error('Failed to fetch referral config');
    };

    const { data, error, isLoading } = useSWR<ReferralConfigData>(
        '/api/referral-config',
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
            dedupingInterval: 60000, // 1분 캐시
        }
    );

    // 금액 포맷팅 함수
    const formatAmount = (amount: number | null | undefined): string => {
        if (amount === null || amount === undefined) return '-';
        if (amount >= 100000000) {
            return `${amount / 100000000}억원`;
        } else if (amount >= 10000000) {
            return `${amount / 10000000}천만원`;
        } else if (amount >= 1000000) {
            return `${amount / 1000000}백만원`;
        } else if (amount >= 100000) {
            return `${amount / 100000}십만원`;
        } else if (amount >= 10000) {
            return `${amount / 10000}만원`;
        }
        return `${amount.toLocaleString()}원`;
    };

    // 짧은 금액 포맷팅 함수 (버튼용)
    const formatShortAmount = (amount: number | null | undefined): string => {
        if (amount === null || amount === undefined) return '-';
        if (amount >= 100000000) {
            return `${amount / 100000000}억`;
        } else if (amount >= 10000000) {
            const value = amount / 10000000;
            return Number.isInteger(value) ? `${value}천만` : `${amount / 10000}만`;
        } else if (amount >= 1000000) {
            const value = amount / 1000000;
            return Number.isInteger(value) ? `${value}백만` : `${amount / 10000}만`;
        } else if (amount >= 100000) {
            return `${amount / 10000}만`;
        } else if (amount >= 10000) {
            return `${amount / 10000}만`;
        }
        return `${amount.toLocaleString()}`;
    };

    return {
        config: data,
        isLoading,
        error,
        formatAmount,
        formatShortAmount
    };
};

export default useReferralConfig;