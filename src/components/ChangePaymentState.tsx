import { api } from "@/api/axios";
import { DepositLogs } from "@/api/deposit-logs/get";
import { UpdatePaymentBody } from "@/api/deposit-logs/post";
import { ResPostList, SWRType } from "@/api/types";
import { StrapiRes } from "@/api/types/strapi";
import { updateUSDTDeposit, updateUSDTWithdraw } from "@/api/usdt/post";
import { WithdrawalLogData } from "@/api/withdrawal-logs/get";
import StateTag from "@/pages/payment/StateTag";
import WithdrawOncashInput from "@/pages/payment/withdraw/WithdrawOncashForm";
// import { updateWithdrawalRollingStatus } from "@/api/withdrawal-logs/post";
import useUserStore from "@/store/user.store";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  MinusCircleFilled,
} from "@ant-design/icons";
import { Modal, Popconfirm, Space, Typography, notification } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { KeyedMutator } from "swr";

interface Props {
  id: string | string[];
  value: UpdatePaymentBody["status"];
  payment: "DEPOSIT" | "WITHDRAW" | "AGENT";
  type?: string;
  mutate:
    | KeyedMutator<StrapiRes<DepositLogs[]>>
    | KeyedMutator<StrapiRes<WithdrawalLogData[]>>
    | KeyedMutator<StrapiRes<WithdrawalLogData>>
    | KeyedMutator<SWRType<ResPostList["data"]>>
    | any;

  large?: boolean;
  depositBonus?: string;
  setChecked?: Dispatch<SetStateAction<string[]>>;
  cancelOnly?: boolean;
  withrawType?: string;
  transData?: {
    username:string;
    requestTime: string;
  }
}

const ChangePaymentState = ({
  id,
  value,
  payment,
  large,
  mutate,
  depositBonus,
  type,
  setChecked,
  cancelOnly,
  withrawType,
  // transData
}: Props) => {
  const { t } = useTranslation();
  const { userid, token, username } = useUserStore.getState();
  const [newVal, setNewVal] = useState<UpdatePaymentBody["status"]>();
  const fontSize = "1rem";
  const [isOpen, setIsOpen] = useState<boolean>();
  const [loading, setLoading] = useState(false);

  const handleChangeStatus = async (body: UpdatePaymentBody, pin = "") => {
    if(loading) return;
    const idIsArray = Array.isArray(body.id);

    if (idIsArray) {
      console.log(body.id, 'is array')
    } else {
      console.log(body.id, 'is not array')
    }
    
    setLoading(true);
    const reqBody = {
      // ...body,
      id: Array.isArray(body.id) ? body.id.map(item => item.split('-')[0]) : body.id,
      status: body.status,
      userid,
      admin_id: username,
      system_note: `${
        payment === "DEPOSIT"
          ? depositBonus ?? `입금 - ${body.status} by ${username}`
          : `출금 - ${body.status} by ${username}`
      }`,
      type: idIsArray ? "multiple" : "single",
      transaction_type: Array.isArray(body.id)
        ? body.id.map((item) => item.split("-")[1])
        : type === "level"
        ? "bank"
        : type,
      oncash_pin: pin,
      withdraw_type: withrawType,
    };

    console.log(reqBody);

    try {
      if (payment === "DEPOSIT") {
        let res; 

        if (type === "usdt") {
          res = await updateUSDTDeposit({
            ...body,
            id: reqBody.id,
            admin_id: username,
            system_note: reqBody.system_note
          });
        } else {
          res = await api.updateDeposit(reqBody, token);
        }


        const {
          data: { code, message },
        } = res;

        if (code == 0) {
          setNewVal(body.status)
          if (setChecked) setChecked([]);
          mutate();
          notification.success({ message: t("toast.common.updateSuccess") });
        } else {
          notification.error({ message: message });
        }
      }

      if (payment === "WITHDRAW") {
        let res;
        if (withrawType === "oncash" && body.status === "Completed" && !pin) { 
          notification.error({ message: t("toast.payment.pinRequired") });
          return;
        }
        if (type === "usdt") {
          res = await updateUSDTWithdraw({
            ...body,
            id: reqBody.id,
            admin_id: username,
            system_note: reqBody.system_note
          });
        } else {
          res = await api.updateWithdraw(reqBody, token);
        }

        const {
          data: { code, message },
        } = res;

        if (code == 0) {
          setNewVal(body.status)
          if (setChecked) setChecked([]);
          mutate();
          notification.success({ message: t("toast.common.updateSuccess") });
          /*if (withrawType === "oncash" && body.status === "Completed") {
            const messageData = {
              userid,
              target: "user",
              username: [transData?.username],
              content: JSON.stringify(GF.withdrawOncashMessage(pin, res.data.data?.reference_id)),
              title: i18next.t("title.oncashWithdrawalGuide"),
              expires_at: dayjs().tz().add(7, "day").format("YYYY-MM-DD HH:mm:ss"),
              "agent_username": null,
              "level": null,
              "status": null,
            }
            await api.createMessage(messageData, token);

            if (res.data.data?.is_first_oncash_withdraw) {
              const couponData = {
                "coupon_id": null,
                "level_id": null,
                userid,
                "username": [transData?.username],
                "coupon_name": "첫 온캐시 출금쿠폰",
                "system_note": "1인 1회 지급(사용제한 없음)",
                "amount": 10000,
                "is_used": 0,
                "user_grade": null,
                "user_level": null,
                "expired_date": dayjs().tz().add(7, "day").format("YYYY-MM-DD HH:mm:ss")
              }
              await api.createCoupon(couponData, token);
            }
          } */
        } else {
          notification.error({ message: message });
        }
      }

      if (payment === "AGENT") {
        // const _id = id as number;

        // await updateWithdrawalRollingStatus({ id: _id, status: body.status });
        // notification.success({ message: "변경 완료" });

        const res = await api.updateAgentWithdraw(reqBody, token);
        const {
          data: { code, message },
        } = res;

        if (code == 0) {
          setNewVal(body.status)
          if (setChecked) setChecked([]);
          mutate();
          notification.success({ message: t("toast.common.updateSuccess") });
        } else {
          notification.error({ message: message });
        }
      }
    } catch (error) {
      notification.error({ message: t("toast.common.updateFailed") });
    } finally {
      mutate();
      setLoading(false);
      setIsOpen(false);
    }
  };

  if (!large && newVal && value !== "Waiting") {
    return (<StateTag value={newVal} />)
  }

  if(cancelOnly){
    return <Popconfirm
        title={t("confirm.cancel")}
        onConfirm={() => handleChangeStatus({ id, status: "Cancelled" })}
      >
        {large && (
          <Space
            style={{
              background: "var(--ant-color-error-bg)",
              border: "var(--ant-color-error-border) solid 1px",
              borderRadius: "5px",
              padding: "0.25rem 1rem",
              cursor: "pointer",
            }}
          >
            <CloseCircleFilled
              style={{
                color: "var(--ant-color-error)",
                fontSize,
                marginRight: "0.25rem",
              }}
            />
            <Typography.Text
              style={{
                color: "var(--ant-color-error-text)",
              }}
            >
              {t("global.cancel")}
            </Typography.Text>
          </Space>
        )}
    </Popconfirm>
  }

  return (
    <>
      <Popconfirm
        title={t("confirm.complete")}
        onConfirm={() => {
          const isOncashWithdraw = payment === "WITHDRAW" &&  
            withrawType === "oncash" &&
            !large;

          if (isOncashWithdraw) {
            setIsOpen(true);
            return;
          }
          handleChangeStatus({ id, status: "Completed" })
        }}
      >
        {large && (
          <Space
            style={{
              background: "var(--ant-color-success-bg)",
              border: "var(--ant-color-success-border) solid 1px",
              borderRadius: "1rem",
              padding: "0.25rem 0.5rem",
              marginRight: "1rem",
              cursor: "pointer",
            }}
          >
            <CheckCircleFilled
              style={{
                color: "var(--ant-color-success)",
                fontSize,
                marginRight: "0.25rem",
              }}
            />
            <Typography.Text
              style={{
                color: "var(--ant-color-success-text)",
              }}
            >
              {t("global.complete")}
            </Typography.Text>
          </Space>
        )}
        {!large && (
          <CheckCircleFilled
            style={{
              color: "var(--ant-color-success)",
              fontSize,
              marginRight: "0.25rem",
              cursor: "pointer",
            }}
          />
        )}
      </Popconfirm>

      {value !== "Waiting" && (
        <Popconfirm
          title={t("confirm.hold")}
          onConfirm={() => handleChangeStatus({ id, status: "Waiting" })}
        >
          {large && (
            <Space
              style={{
                background: "var(--ant-color-warning-bg)",
                border: "var(--ant-color-warning-border) solid 1px",
                borderRadius: "1rem",
                padding: "0.25rem 0.5rem",
                marginRight: "0.5rem",
                cursor: "pointer",
              }}
            >
              <MinusCircleFilled
                style={{
                  color: "var(--ant-color-warning)",
                  fontSize,
                  marginRight: "0.25rem",
                }}
              />
              <Typography.Text
                style={{
                  color: "var(--ant-color-warning-text)",
                }}
              >
                {t("global.waiting")}
              </Typography.Text>
            </Space>
          )}
          {!large && (
            <MinusCircleFilled
              style={{
                color: "var(--ant-color-warning)",
                fontSize,
                cursor: "pointer",
              }}
            />
          )}
        </Popconfirm>
      )}

      <Popconfirm
        title={t("confirm.cancel")}
        onConfirm={() => handleChangeStatus({ id, status: "Cancelled" })}
      >
        {large && (
          <Space
            style={{
              background: "var(--ant-color-error-bg)",
              border: "var(--ant-color-error-border) solid 1px",
              borderRadius: "1rem",
              padding: "0.25rem 0.5rem",
              marginLeft: "2rem",
              marginRight: "0.5rem",
              cursor: "pointer",
            }}
          >
            <CloseCircleFilled
              style={{
                color: "var(--ant-color-error)",
                fontSize,
                marginRight: "0.25rem",
              }}
            />
            <Typography.Text
              style={{
                color: "var(--ant-color-error-text)",
              }}
            >
              {t("global.cancel")}
            </Typography.Text>
          </Space>
        )}
        {!large && (
          <CloseCircleFilled
            style={{
              color: "var(--ant-color-error)",
              fontSize,
              marginLeft: "0.25rem",
            }}
          />
        )}
      </Popconfirm>
      
      <Modal
        open={isOpen}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setIsOpen(false)}
        width={'30%'}
        style={{margin: '1rem auto'}}
      >
        <WithdrawOncashInput 
          submit={(pin) => {
            handleChangeStatus({ id, status: "Completed" }, pin);
          }} 
          loading={loading}
        />
      </Modal>
    </>
  );
};

export default ChangePaymentState;
