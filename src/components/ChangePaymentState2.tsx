import { api } from "@/api/axios";
import i18next from "@/i18n/i18n";
import { DepositLogs } from "@/api/deposit-logs/get";
import {
  UpdatePaymentBody,
} from "@/api/deposit-logs/post";
import { ResPostList, SWRType } from "@/api/types";
import { StrapiRes } from "@/api/types/strapi";
import { WithdrawalLogData } from "@/api/withdrawal-logs/get";
import useUserStore from "@/store/user.store";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  MinusCircleFilled,
} from "@ant-design/icons";
import { Popconfirm, Space, Typography, notification } from "antd";
import { KeyedMutator } from "swr";

interface Props {
  id: string | string[];
  value: UpdatePaymentBody["status"];
  payment: "DEPOSIT" | "WITHDRAW" | "AGENT";
  mutate:
    | KeyedMutator<StrapiRes<DepositLogs[]>>
    | KeyedMutator<StrapiRes<WithdrawalLogData[]>>
    | KeyedMutator<StrapiRes<WithdrawalLogData>>
    | KeyedMutator<SWRType<ResPostList['data']>>
    | any;

  large?: boolean;
  depositBonus?: string;
}

const ChangePaymentState = ({ id, value, payment, large, mutate, depositBonus }: Props) => {
  const {userid, token, username} = useUserStore.getState()
  const fontSize = "1rem";

  const handleChangeStatus = async (body: UpdatePaymentBody) => {
    const reqBody = {
      ...body,
      userid,
      admin_id: username,
      system_note: `${payment === 'DEPOSIT' ? (depositBonus ?? `입금 - ${body.status} by ${username}`) : `출금 - ${body.status} by ${username}`}`,
      type: large ? 'multiple' : 'single'
    }
    try {

      if (payment === 'DEPOSIT') {
        const res = await api.updateDeposit(reqBody, token)
        const {data: {code, message}} = res

        if (code == 0) {
          mutate();
          notification.success({ message: "변경 완료" });
        } else {
          notification.error({ message: message });
        }
      } else {

        const res = await api.updateWithdraw(reqBody, token)
        const {data: {code, message}} = res

        if (code == 0) {
          mutate();
          notification.success({ message: "변경 완료" });
        } else {
          notification.error({ message: message });
        }

      }

      
    } catch (error) {
      notification.error({ message: "변경 실패" });
    }
  };

  return (
    <>
      <Popconfirm
        title={i18next.t("title.confirmComplete")}
        onConfirm={() => handleChangeStatus({ id, status: "Completed" })}
      >
        {large && (
          <Space
            style={{
              background: "var(--ant-color-success-bg)",
              border: "var(--ant-color-success-border) solid 1px",
              borderRadius: "1rem",
              padding: "0.25rem 0.5rem",
              marginRight: "0.5rem",
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
              Completed
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
      <Popconfirm
        title={i18next.t("title.confirmCancelAction")}
        onConfirm={() => handleChangeStatus({ id, status: "Cancelled" })}
      >
        {large && (
          <Space
            style={{
              background: "var(--ant-color-error-bg)",
              border: "var(--ant-color-error-border) solid 1px",
              borderRadius: "1rem",
              padding: "0.25rem 0.5rem",
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
              Cancelled
            </Typography.Text>
          </Space>
        )}
        {!large && (
          <CloseCircleFilled
            style={{
              color: "var(--ant-color-error)",
              fontSize,
              marginRight: "0.25rem",
            }}
          />
        )}
      </Popconfirm>
      {value !== "Waiting" && (
        <Popconfirm
          title={i18next.t("title.confirmHold")}
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
                Waiting
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
    </>
  );
};

export default ChangePaymentState;
