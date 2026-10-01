import i18next from "@/i18n/i18n";
import { AgentType, ResUser } from "@/api/types";
import { adjustAgentBalance } from "@/api/agent/post";
import SaveBtn from "@/components/SaveBtn";
import { Form, InputNumber, notification, Radio, Typography } from "antd";
import CommaNumber2 from "./CommaNumber2";
import { useState } from "react";
import useUserStore from "@/store/user.store";
import { useTranslation } from "react-i18next";

interface Props {
  info: AgentType | ResUser["data"] | undefined;
  onCancel: () => void;
}

interface FormData {
  amount: string;
  type: "add" | "sub";
}

const BalanceAdjustment = ({ info, onCancel }: Props) => {
  const { t } = useTranslation();
  const [type, setType] = useState("add");

  const handleSubmit = async (e: FormData) => {
    const loggedUser = useUserStore.getState();
    try {
      const { type } = e;
      const body = {
        userid: loggedUser?.userid,
        username: info?.username || "",
        admin_id: loggedUser?.username,
        amount: type === "sub" ? -Number(e.amount) : Number(e.amount),
        system_note: "",
      };
      await adjustAgentBalance(body, info?.id);

      notification.success({
        message: t("toast.common.saveSuccess"),
      });

      onCancel();
    } catch (error: any) {
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  return (
    <Form
      layout="vertical"
      style={{
        marginTop: "1rem",
      }}
      onFinish={handleSubmit}
    >
      <Form.Item name={"type"} initialValue={"add"}>
        <Radio.Group onChange={(e) => setType(e.target.value)}>
          <Radio value={"add"}>{i18next.t("moneyType.pay")}</Radio>
          <Radio value={"sub"}>{i18next.t("moneyType.recover")}</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label={i18next.t("col.amount")} name={"amount"}>
        <InputNumber
          min={0}
          precision={0}
          style={{ width: "100%" }}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
        />
      </Form.Item>

      {type === "sub" && (
        <Typography.Text>
          회수가능금액: <CommaNumber2 value={info?.balance} onlyNumber />
        </Typography.Text>
      )}

      <SaveBtn />
    </Form>
  );
};

export default BalanceAdjustment;
