import i18next from "@/i18n/i18n";
import { useState } from "react"
import { ReferralDetail } from "@/api/referral-logs/get"
import {
    referralPaymentStage1,
    referralPaymentStage2,
    referralPaymentStage3,
    referralPaymentStage4,
    referralPaymentStage5,
    referralPaymentStage6,
    referralPaymentStage7,
    referralPaymentStage8,
    createPreviousCouponLog
} from "@/api/referral-logs/post"
import { Button, notification, Popconfirm, Space, Spin } from "antd"
import { KeyedMutator } from "swr"
import useReferralConfig from "@/hooks/useReferralConfig"
import { useTranslation } from "react-i18next"

interface Props {
    record?: ReferralDetail;
    mutate: KeyedMutator<any>
    referralUsername?: string;
}

const ReferralPaymentBtn = ({record, mutate, referralUsername}: Props) => {
    const { t } = useTranslation();
    const { config, isLoading, formatShortAmount } = useReferralConfig();
    const [openPopconfirm, setOpenPopconfirm] = useState<number | null>(null);

    const handleLogOnlyStage = async (stage: 1 | 2 | 3) => {
        if (!record || !referralUsername) return;

        try {
            const res = await createPreviousCouponLog(referralUsername, record.username, stage);
            const {code, message} = res.data;

            if (code === 0) {
                notification.success({message: t("toast.referral.logCreated", { stage })});
                mutate();
            } else if (code === 409) {
                notification.warning({message: t("toast.common.alreadyRegistered")});
            } else {
                notification.error({message: message});
            }
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 409) {
                notification.warning({message: t("toast.common.alreadyRegistered")});
            } else {
                notification.error({message: error.response?.data?.message || t("toast.common.errorOccurred")});
            }
        } finally {
            setOpenPopconfirm(null);
        }
    }

    const handlePaymentStage1 = async () => {
        if (!record || !referralUsername) return;

        try {
            const res = await referralPaymentStage1(referralUsername, record.username);
            const {code, message} = res.data;
            
            if (code === 0) {
                notification.success({message: message});
                mutate();
            } else if (code === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 1 })});
            } else {
                notification.error({message: message});
            }
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 1 })});
            } else {
                notification.error({message: error.response?.data?.message || t("toast.common.errorOccurred")});
            }
        }
    }

    const handlePaymentStage2 = async () => {
        if (!record || !referralUsername) return;

        try {
            const res = await referralPaymentStage2(referralUsername, record.username);
            const {code, message} = res.data;
            
            if (code === 0) {
                notification.success({message: message});
                mutate();
            } else if (code === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 2 })});
            } else {
                notification.error({message: message});
            }
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 2 })});
            } else {
                notification.error({message: error.response?.data?.message || t("toast.common.errorOccurred")});
            }
        }
    }

    const handlePaymentStage3 = async () => {
        if (!record || !referralUsername) return;

        try {
            const res = await referralPaymentStage3(referralUsername, record.username);
            const {code, message} = res.data;
            
            if (code === 0) {
                notification.success({message: message});
                mutate();
            } else if (code === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 3 })});
            } else {
                notification.error({message: message});
            }
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 3 })});
            } else {
                notification.error({message: error.response?.data?.message || t("toast.common.errorOccurred")});
            }
        }
    }

    const handlePaymentStage4 = async () => {
        if (!record || !referralUsername) return;

        try {
            const res = await referralPaymentStage4(referralUsername, record.username);
            const {code, message} = res.data;
            
            if (code === 0) {
                notification.success({message: message});
                mutate();
            } else if (code === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 4 })});
            } else {
                notification.error({message: message});
            }
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 4 })});
            } else {
                notification.error({message: error.response?.data?.message || t("toast.common.errorOccurred")});
            }
        }
    }

    const handlePaymentStage5 = async () => {
        if (!record || !referralUsername) return;

        try {
            const res = await referralPaymentStage5(referralUsername, record.username);
            const {code, message} = res.data;
            
            if (code === 0) {
                notification.success({message: message});
                mutate();
            } else if (code === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 5 })});
            } else {
                notification.error({message: message});
            }
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 5 })});
            } else {
                notification.error({message: error.response?.data?.message || t("toast.common.errorOccurred")});
            }
        }
    }

    const handlePaymentStage6 = async () => {
        if (!record || !referralUsername) return;

        try {
            const res = await referralPaymentStage6(referralUsername, record.username);
            const {code, message} = res.data;
            
            if (code === 0) {
                notification.success({message: message});
                mutate();
            } else if (code === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 6 })});
            } else {
                notification.error({message: message});
            }
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 6 })});
            } else {
                notification.error({message: error.response?.data?.message || t("toast.common.errorOccurred")});
            }
        }
    }

    const handlePaymentStage7 = async () => {
        if (!record || !referralUsername) return;

        try {
            const res = await referralPaymentStage7(referralUsername, record.username);
            const {code, message} = res.data;
            
            if (code === 0) {
                notification.success({message: message});
                mutate();
            } else if (code === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 7 })});
            } else {
                notification.error({message: message});
            }
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 7 })});
            } else {
                notification.error({message: error.response?.data?.message || t("toast.common.errorOccurred")});
            }
        }
    }

    const handlePaymentStage8 = async () => {
        if (!record || !referralUsername) return;

        try {
            const res = await referralPaymentStage8(referralUsername, record.username);
            const {code, message} = res.data;
            
            if (code === 0) {
                notification.success({message: message});
                mutate();
            } else if (code === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 8 })});
            } else {
                notification.error({message: message});
            }
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 409) {
                notification.warning({message: t("toast.referral.alreadyPaid", { stage: 8 })});
            } else {
                notification.error({message: error.response?.data?.message || t("toast.common.errorOccurred")});
            }
        }
    }

    const renderStageButton = (
        stage: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8,
        status?: 'granted' | 'eligible' | 'not_eligible'
    ) => {
        // 설정이 로딩중이면 스피너 표시
        if (isLoading || !config) {
            return <Button size="small" style={{ width: '90px' }} loading disabled>{stage}차</Button>;
        }

        const stageConfig = {
            1: config.stage1,
            2: config.stage2,
            3: config.stage3,
            4: config.stage4,
            5: config.stage5,
            6: config.stage6,
            7: config.stage7,
            8: config.stage8
        };

        const stageHandlers = {
            1: handlePaymentStage1,
            2: handlePaymentStage2,
            3: handlePaymentStage3,
            4: handlePaymentStage4,
            5: handlePaymentStage5,
            6: handlePaymentStage6,
            7: handlePaymentStage7,
            8: handlePaymentStage8
        };

        const currentStage = stageConfig[stage];
        const handler = stageHandlers[stage];

        // 백엔드 설정값이 아직 세팅되지 않아 threshold/reward가 null로 내려오는 경우 방어
        if (!currentStage) {
            return <Button size="small" style={{ width: '90px' }} disabled>{stage}차</Button>;
        }

        const thresholdText = formatShortAmount(currentStage.threshold);
        const rewardText = formatShortAmount(currentStage.reward);

        const buttonStyle = { width: '90px' };

        switch (status) {
            case 'eligible':
                return (
                    <Popconfirm
                        title={i18next.t("referralCfg.stagePointPay", { stage })}
                        description={
                            <div>
                                <div>달성조건: {thresholdText} 입금 → 지급포인트: {rewardText}</div>
                                {stage <= 3 && (
                                    <div style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
                                        이미 수동 지급한 경우 "로그만 생성"을 선택하세요.
                                    </div>
                                )}
                                <div style={{ marginTop: 12, textAlign: 'right' }}>
                                    <Space>
                                        <Button size="small" onClick={() => setOpenPopconfirm(null)}>
                                            {i18next.t("global.cancel")}
                                        </Button>
                                        {stage <= 3 && (
                                            <Button size="small" onClick={() => handleLogOnlyStage(stage as 1 | 2 | 3)}>
                                                {i18next.t("user.createLogOnly")}
                                            </Button>
                                        )}
                                        <Button size="small" type="primary" onClick={handler}>
                                            포인트 지급
                                        </Button>
                                    </Space>
                                </div>
                            </div>
                        }
                        open={openPopconfirm === stage}
                        onOpenChange={(open) => setOpenPopconfirm(open ? stage : null)}
                        showCancel={false}
                        okButtonProps={{ style: { display: 'none' } }}
                    >
                        <Button size="small" type="primary" style={buttonStyle}>{stage}차 지급</Button>
                    </Popconfirm>
                );
            case 'granted':
                return <Button size="small" style={{...buttonStyle, color: '#52c41a', borderColor: '#52c41a'}} disabled>{stage}차 지급완료</Button>;
            case 'not_eligible':
                return <Button size="small" style={buttonStyle} disabled>{stage}차 조건미달</Button>;
            default:
                return null;
        }
    };

    // 설정 로딩 중일 때 전체 스피너 표시
    if (isLoading) {
        return (
            <Space>
                <Spin size="small" />
            </Space>
        );
    }

    return (
        <Space wrap>
            {renderStageButton(1, record?.stage1Status)}
            {renderStageButton(2, record?.stage2Status)}
            {renderStageButton(3, record?.stage3Status)}
            {/* {renderStageButton(4, record?.stage4Status)} */}
            {/* {renderStageButton(5, record?.stage5Status)} */}
            {/* {renderStageButton(6, record?.stage6Status)}
            {renderStageButton(7, record?.stage7Status)}
            {renderStageButton(8, record?.stage8Status)} */}
        </Space>
    )
}

export default ReferralPaymentBtn