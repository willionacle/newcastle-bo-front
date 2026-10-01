import i18next from "@/i18n/i18n";
import {
  Button,
  Col,
  // Form,
  Input,
  Modal,
  notification,
  // Row,
  // Space,
} from "antd";
import { useTranslation } from "react-i18next";
import { AgentType, ResUser } from "@/api/types";
import { User } from "@/api/users/get";
import DateText from "@/components/DateText";
import { useEffect, useState } from "react";
import { mutate } from "swr";
import { colStyle, titleColStyle, urlWrapper } from "./AgentStyle";
import BalanceAdjustment from "@/components/BalanceAdjustment";
import { GF } from "@/utils/GlobalFunctions";
import SaveBtn from "@/components/SaveBtn";
import { api } from "@/api/axios";
import useUserStore from "@/store/user.store";

// interface AgentInfo {
//   user_real_name: User["user_real_name"];
//   username: User["username"];
//   tree_depth: User["tree_depth"];
//   status: User["status"];
//   phoneNumber: string;
//   accountNumber: User["accountNumber"];
//   createdAt: User["createdAt"];
// }

interface Props {
  info: AgentType | ResUser["data"] | undefined;
  depth: number;
  agent_id?: User["username"];
}

const AgentInfo = ({ info }: Props) => {
  const [modal, setModal] = useState<"balance" | "">("");
  const { t } = useTranslation();
  const {
    user_real_name,
    username,
    // user_status,
    // account_number,
    created_at,
    // bank_name,
    // account_name,
    id,
    // phone_number,
    // path,
    balance,
    agent_username,
    user_memo_1,
  } = info || ({} as AgentType);
  const [userMemo1, setUserMemo1] = useState(user_memo_1);
  const { token, userid } = useUserStore.getState();
  const handleSubmit = async () => {
    if (!info) return;
    try {
      const res = await api.updateAgent(
        {
          ...info,
          user_memo_1: userMemo1,
          password: undefined,
          userid,
        },
        token
      );

      if (res.data.code == 0) {
        notification.success({ message: res.data.message });
      } else {
        notification.error({ message: res.data.message });
      }
    } catch (error: any) {
      notification.error({
        message: "Failed",
        description: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    setUserMemo1(user_memo_1);
  }, [user_memo_1]);

  return (
    <>
      <Modal
        open={modal === "balance"}
        title={i18next.t("title.commissionChange")}
        okButtonProps={{ hidden: true }}
        cancelButtonProps={{ hidden: true }}
        centered
        destroyOnClose
        onCancel={() => setModal("")}
      >
        <BalanceAdjustment
          info={info}
          onCancel={() => {
            setModal("");
            mutate(`/getuser?id=${id}`);
          }}
        />
      </Modal>

      <Col style={titleColStyle} span={6}>
        {t("agent.al004")}
      </Col>
      <Col style={colStyle} span={5}>
        {GF.topAgentUsername(username)}
      </Col>

      <Col style={titleColStyle} span={5}>
        {i18next.t("col.name")}
      </Col>
      <Col style={colStyle} span={8}>
        {GF.topAgentUsername(user_real_name)}
      </Col>

      <Col style={titleColStyle} span={6}>
        커미션보유
      </Col>
      <Col style={colStyle} span={5}>
        {balance ? balance.toLocaleString() : 0}{" "}
        <Button
          size="small"
          style={{
            marginLeft: "0.3rem",
          }}
          onClick={() => setModal("balance")}
        >
          증감
        </Button>
      </Col>
      <Col style={titleColStyle} span={5}>
        {t("agent.al009")}
      </Col>
      <Col style={colStyle} span={8}>
        <div style={urlWrapper}>{`${
          import.meta.env.VITE_AGENT_URL
        }${GF.topAgentUsername(username)}`}</div>
      </Col>

      <Col style={titleColStyle} span={6}>
        상위총판
      </Col>
      <Col style={colStyle} span={5}>
        {GF.topAgentUsername(agent_username)}
      </Col>
      <Col style={titleColStyle} span={5}>
        등록일시
      </Col>
      <Col style={colStyle} span={8}>
        {created_at && <DateText date={created_at} timeStamp />}
      </Col>

      <Col style={{...titleColStyle, display:"flex", justifyContent:"center",alignItems:"flex-start"}} span={6}>
        총판메모
      </Col>
      <Col span={18} style={colStyle}>
        <Input.TextArea
          maxLength={1000}
          rows={5}
          size="small"
          style={{ minHeight: 30}}
          value={userMemo1}
          onChange={(e) => setUserMemo1(e.target.value)}
        />
        <SaveBtn size="small" customStyle={{margin:"10px 0 0 auto", width: '100%', maxWidth: 145}} onClick={handleSubmit} />
      </Col>
    </>
  );
};

export default AgentInfo;
