import { createAgent } from "@/api/agent/post";
import i18next from "@/i18n/i18n";
import { depositAccountAPI, DepositAccountResponse } from "@/api/deposit-account/get";
import { ResUser } from "@/api/types";
import SaveBtn from "@/components/SaveBtn";
import useUserStore from "@/store/user.store";
import {
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Typography,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AgentInfoProp } from "./Agent";

// interface AgentType {
//   depth: number | null;
//   agent_username: string | null;
//   agent_id: string | null;
// }

interface Props {
  mutate?: any;
  agent?: AgentInfoProp;
  info: ResUser["data"] | undefined;
  user?: ResUser["data"];
  onSuccess: () => void
}
interface FormType {
  username: ResUser["data"]["username"];
  password: string;
  account_name: ResUser["data"]["account_name"];
  phone_number: string;
  agent_id: any;
  user_level: ResUser["data"]["user_level"];
  user_status: ResUser["data"]["user_status"];
  bank_name: ResUser["data"]["bank_name"];
  account_number: ResUser["data"]["account_number"];
  user_real_name: ResUser["data"]["user_real_name"];
  rolling_casino_percentage: ResUser["data"]["rolling_casino_percentage"];
  rolling_slot_percentage: ResUser["data"]["rolling_slot_percentage"];
  rolling_mini_game_percentage: ResUser["data"]["rolling_mini_game_percentage"];
  rolling_sports_percentage: ResUser["data"]["rolling_sports_percentage"];
  lossing_point_percentage: ResUser["data"]["lossing_point_percentage"];

  agent_lossing_percentage: number;
  agent_rolling_casino_percentage: number;
  agent_rolling_mini_game_percentage: number;
  agent_rolling_slot_percentage: number;
  agent_rolling_sports_percentage: number;

  rolling_point_type: ResUser["data"]["rolling_point_type"];
  lossing_point_type: ResUser["data"]["lossing_point_type"];
  tree_depth?: ResUser["data"]["tree_depth"];
  depositMethod: string[];
  newPassword: string;
  level_type: "AUTO" | "MANUAL";
  deposit_total: number;
  initial_bet_total: number;
  withdrawal_total: number;
  depth: number | null;
}

// 이거 입금 계좌 생성 데이터랑 맞춰야함
export const depositMethodArray = [
  { value: "level", label: i18next.t("agentForm.depositAccountByLevel"), title: i18next.t("memberInfoEdit.mie020") },
  { value: "v-account1", label: i18next.t("title.virtualAccount1"), title: i18next.t("title.virtualAccount1") },
  { value: "v-account2", label: i18next.t("title.virtualAccount2"), title: i18next.t("title.virtualAccount2") },
  { value: "usdt", label: "USDT", title: "USDT" },
];

const AgentForm = ({ agent, user, onSuccess, info }: Props) => {
  const { userid } = useUserStore.getState();
  const { t } = useTranslation();
  const [form] = Form.useForm<FormType>();
  // const { data: parentAgentRes, isLoading } = findAgentAPI(agent?.parentID);
  const agentLossingPercentage = info ? (((info?.agent_lossing_percentage || 0)  * 100) || undefined) : undefined;
  const agentRollingCasinoPercentage = info ? (((info?.agent_rolling_casino_percentage || 0)  * 100) || undefined) : undefined;
  const agentRollingSlotPercentage = info ? (((info?.agent_rolling_slot_percentage || 0)  * 100) || undefined) : undefined;
  const agentRollingMinigamePercentage = info ? (((info?.agent_rolling_mini_game_percentage || 0)  * 100) || undefined) : undefined;
  const agentRollingSportsPercentage = info ? (((info?.agent_rolling_sports_percentage || 0)  * 100) || undefined) : undefined;
  // const [__, setLevel] = useState(true);
  const [depositAccountData, setDepositAccountData] = useState<DepositAccountResponse | null>(null);
  const isMaxEnabled = (agent?.depth || 0) >= 1
  // const [searchParam, _] = useSearchParams();
  // const agent = {
  //   depth: searchParam.get("depth"),
  //   agent_username: searchParam.get("agent_username"),
  //   agent_id: searchParam.get("agent_id"),
  // };

  const handleSubmit = async (e: FormType) => {
    console.log("FORM DATA", e);
    const bodyData = {
      account_name: e.account_name,
      account_number: e.account_number,
      agent_id: e.agent_id ? e.agent_id["label"] : null,
      parentID: e.agent_id ? e.agent_id["value"] : null,
      bank_name: e.bank_name,
      lossing_point_percentage: e.lossing_point_percentage / 100,
      lossing_point_type: e.lossing_point_type,
      password: e.password,
      phone_number: e.phone_number,
      rolling_casino_percentage: e.rolling_casino_percentage / 100,
      rolling_slot_percentage: e.rolling_slot_percentage / 100,
      rolling_mini_game_percentage: e.rolling_mini_game_percentage / 100,
      rolling_sports_percentage: e.rolling_sports_percentage / 100,
      rolling_point_type: e.rolling_point_type,
      level_type: e.level_type,
      user_level: e.user_level,
      username: e.username,
      user_status: e.user_status,
      user_real_name: e.user_real_name,
      tree_depth: agent?.depth ? Number(agent?.depth) : undefined,
      initial_bet_total: Number(e.initial_bet_total),
      deposit_total: Number(e.deposit_total),
      withdrawal_total: Number(e.withdrawal_total),
      userid: userid,
      rolling_point: 0,
      agent_lossing_percentage: e.agent_lossing_percentage / 100,
      agent_rolling_casino_percentage: e.agent_rolling_casino_percentage / 100,
      agent_rolling_mini_game_percentage:
        e.agent_rolling_mini_game_percentage / 100,
      agent_rolling_slot_percentage: e.agent_rolling_slot_percentage / 100,
      agent_rolling_sports_percentage: e.agent_rolling_sports_percentage / 100,
    };

    console.log("REQ BODY", bodyData);

    try {
      const res = await createAgent({
        username: bodyData.username,
        user_real_name: bodyData.user_real_name,
        password: bodyData.password,
        agent_username: agent?.agent_username || "",
        parentID: agent?.agent_id || 1,
        rolling_casino_percentage: bodyData.rolling_casino_percentage,
        rolling_slot_percentage: bodyData.rolling_slot_percentage,
        rolling_mini_game_percentage: bodyData.rolling_mini_game_percentage,
        rolling_sports_percentage: bodyData.rolling_sports_percentage,
        lossing_point_percentage: bodyData.lossing_point_percentage,
        agent_lossing_percentage: bodyData.agent_lossing_percentage,
        agent_rolling_casino_percentage: bodyData.agent_rolling_casino_percentage,
        agent_rolling_mini_game_percentage: bodyData.agent_rolling_mini_game_percentage,
        agent_rolling_slot_percentage: bodyData.agent_rolling_slot_percentage,
        agent_rolling_sports_percentage: bodyData.agent_rolling_sports_percentage,
        "account_name"                  : "",
        "account_number"                : "",
        "bank_name"                     : "",
        "phone_number"                  : "",
        "rolling_point"                 : 0,
        "user_level"                    : 1,
        "user_status"                   : "ACTIVE",
        "level_type"                    : "AUTO",
        "rolling_point_type"            : "LEVEL",
        "lossing_point_type"            : "LEVEL",
        "deposit_total"                 : 0,
        "withdrawal_total"              : 0,
      });

      const {
        data: { message, code },
      } = res;
      if (code === 0) {
        notification.success({ message: message });
        onSuccess();
      } else {
        notification.error({ message: message });
      }
    } catch (error: any) {
      console.error(error);

      // 에러 메시지 처리
      const msg = error.response?.data?.message;

      notification.error({
        message: "Failed",
        description: msg,
      });
    }
  };

  // Fetch deposit accounts data
  useEffect(() => {
    const fetchDepositAccounts = async () => {
      if (user?.username) {
        const data = await depositAccountAPI(user.username);
        setDepositAccountData(data);
      }
    };
    
    fetchDepositAccounts();
  }, [user?.username]);

  useEffect(() => {
    console.log('AGENTTT', info);
    // 유저 데이터가 있으면 form 초기값 설정
    if (user !== undefined) {
      form.setFieldsValue({
        username: user.username,
        account_name: user.account_name,
        phone_number: user.phone_number,
        rolling_casino_percentage: user.rolling_casino_percentage * 100,
        rolling_slot_percentage: user.rolling_slot_percentage * 100,
        rolling_mini_game_percentage: user.rolling_mini_game_percentage * 100,
        rolling_sports_percentage: user.rolling_sports_percentage * 100,
        lossing_point_percentage: user.lossing_point_percentage * 100,
        lossing_point_type: user.lossing_point_type,
        rolling_point_type: user.rolling_point_type,
        user_status: user.user_status,
        account_number: user.account_number,
        bank_name: user.bank_name,
        user_level: user.user_level ?? undefined,
        user_real_name: user.user_real_name ?? "",
        level_type: user.level_type,
        initial_bet_total: user.initial_bet_total,
        deposit_total: user.deposit_total,
        withdrawal_total: user.withdrawal_total,
      });
    }

    // 전달받은 agent 데이터를 form에 설정
    if (agent) {
      form.setFieldsValue({
        agent_id: {
          label: agent.agent_username, // 전달받은 agent_username
          value: agent.agent_id, // 전달받은 agent_id
        },
        depth: agent.depth, // 전달받은 depth 값
      });
    }

    // 데이터 로드 시 입금 계좌 설정
    if (depositAccountData) {
      console.log(depositAccountData);
      const depositMethod = depositAccountData.data
        .filter((item: any) => item.inUse) // inUse가 true인 항목만 필터링
        .map((item: any) => item.type); // type 값 추출

      form.setFieldValue("depositMethod", depositMethod);
    }
  }, [user, agent, depositAccountData]); // agent를 의존성 배열에 추가

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="username"
            label={t("memberInfoEdit.mie001")}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        {user && (
          <Col
            span={24}
            style={{
              display: "flex",
              gap: "0.5rem",
            }}
          >
            <Form.Item
              label={i18next.t("agentForm.changePassword")}
              style={{ flex: "1" }}
              name={"newPassword"}
            >
              <Input type="password" />
            </Form.Item>

            <Form.Item
              style={{
                alignSelf: "end",
              }}
            >
              {/* <SaveBtn
                size="middle"
                type="button"
                onClick={() => handleChangePw()}
              /> */}
            </Form.Item>
          </Col>
        )}

        <Col span={24}>
          <Form.Item
            name="user_real_name"
            label={t("memberInfoEdit.mie002")}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        {user === undefined && (
          <Col span={24}>
            <Form.Item
              name="password"
              label={t("memberInfoEdit.mie028")}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        )}

        <Row gutter={10}>
          <Col span={12} style={{display: 'none'}}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="lossing_point_percentage"
                  label={i18next.t("agentForm.directMemberLosing")}
                  rules={[{ required: true }]}
                  initialValue={0}
                >
                  <Input type="number" addonAfter="%" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="rolling_casino_percentage"
                  label={i18next.t("agentForm.directMemberCasinoRolling")}
                  rules={[{ required: true }]}
                  initialValue={0}
                >
                  <Input type="number" addonAfter="%" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="rolling_slot_percentage"
                  label={i18next.t("agentForm.directMemberSlotRolling")}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  initialValue={0}
                >
                  <Input type="number" addonAfter="%" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="rolling_mini_game_percentage"
                  label={i18next.t("agentForm.directMemberMinigameRolling")}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  initialValue={0}
                >
                  <Input type="number" addonAfter="%" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="rolling_sports_percentage"
                  label={i18next.t("agentForm.directMemberSportsRolling")}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                  initialValue={0}
                >
                  <Input type="number" addonAfter="%" />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={24}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="agent_lossing_percentage"
                  label={i18next.t("agentForm.losingLimit")}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber 
                    addonAfter="%" 
                    placeholder={isMaxEnabled ? i18next.t("agentForm.maxLimit", { pct: agentLossingPercentage ?? '0' }) : undefined}
                    max={isMaxEnabled ? (agentLossingPercentage) : undefined} 
                    style={{width: '100%'}} 
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="agent_rolling_casino_percentage"
                  label={i18next.t("agentForm.casinoRollingLimit")}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber 
                    addonAfter="%" 
                    placeholder={isMaxEnabled ? i18next.t("agentForm.maxLimit", { pct: agentRollingCasinoPercentage ?? '0' }) : undefined}
                    max={isMaxEnabled ? (agentRollingCasinoPercentage) : undefined} 
                    style={{width: '100%'}} 
                   />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="agent_rolling_slot_percentage"
                  label={i18next.t("agentForm.slotRollingLimit")}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber 
                    addonAfter="%" 
                    placeholder={isMaxEnabled ? i18next.t("agentForm.maxLimit", { pct: agentRollingSlotPercentage ?? '0' }) : undefined} 
                    max={isMaxEnabled ? (agentRollingSlotPercentage) : undefined} 
                    style={{width: '100%'}} 
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="agent_rolling_mini_game_percentage"
                  label={i18next.t("agentForm.minigameRollingLimit")}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber 
                    addonAfter="%" 
                    placeholder={isMaxEnabled ? i18next.t("agentForm.maxLimit", { pct: agentRollingMinigamePercentage ?? '0' }) : undefined} 
                    max={isMaxEnabled ? (agentRollingMinigamePercentage) : undefined} 
                    style={{width: '100%'}} 
                  />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  name="agent_rolling_sports_percentage"
                  label={i18next.t("agentForm.sportsRollingLimit")}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <InputNumber
                    addonAfter="%" 
                    placeholder={isMaxEnabled ? i18next.t("agentForm.maxLimit", { pct: agentRollingSportsPercentage ?? '0' }) : undefined} 
                    max={isMaxEnabled ? (agentRollingSportsPercentage) : undefined} 
                    style={{width: '100%'}} 
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Row>

      {user && (
        <Col>
          <Typography.Title level={4}>
            {t("memberInfoEdit.mie033")}
          </Typography.Title>
        </Col>
      )}

      {user && (
        <Col>
          <Form.Item
            name="depositMethod"
            rules={[{ required: true }]}
            initialValue={depositMethodArray[0].value}
          >
            <Checkbox.Group options={depositMethodArray} />
          </Form.Item>
        </Col>
      )}

      {user && <Divider />}
      <SaveBtn />
    </Form>
  );
};

export default AgentForm;
