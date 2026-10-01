import i18next from "@/i18n/i18n";
import { api } from "@/api/axios";
import { AgentType } from "@/api/types";
import SaveBtn from "@/components/SaveBtn";
import useUserStore from "@/store/user.store";
import { Col, Form, Input, notification, Row } from "antd";
import { useEffect } from "react";
import { colStyle, titleColStyle } from "./AgentStyle";

interface Props {
  data: AgentType | undefined | any;
  mutate: any;
  disabled: boolean;
}

interface AgentFormData {
  agent_lossing_percentage: number;
  agent_rolling_casino_percentage: number;
  agent_rolling_mini_game_percentage: number;
  agent_rolling_slot_percentage: number;
  agent_rolling_sports_percentage: number;
}

interface FormData {
  lossing_point_percentage: number;
  rolling_casino_percentage: number;
  rolling_mini_game_percentage: number;
  rolling_slot_percentage: number;
  rolling_sports_percentage: number;
}

const AgentUpdate = ({ data, disabled, mutate }: Props) => {
  const [form] = Form.useForm<FormData>();
  const [agentForm] = Form.useForm<AgentFormData>();
  const {token, userid} = useUserStore.getState();

  const handleSubmit = async () => {
    if (!data) return;

    const formValue = form.getFieldsValue();
    const agentFormValue = agentForm.getFieldsValue();

    try {
      const res = await api.updateAgent(
        {
          ...data,
          username: data.username,
          agent_lossing_percentage:
            (agentFormValue.agent_lossing_percentage ?? 0) / 100,
          agent_rolling_casino_percentage:
            (agentFormValue.agent_rolling_casino_percentage ?? 0) / 100,
          agent_rolling_mini_game_percentage:
            (agentFormValue.agent_rolling_mini_game_percentage ?? 0) / 100,
          agent_rolling_slot_percentage:
            (agentFormValue.agent_rolling_slot_percentage ?? 0) / 100,
          agent_rolling_sports_percentage:
            (agentFormValue.agent_rolling_sports_percentage ?? 0) / 100,
          lossing_point_percentage:
            (formValue.lossing_point_percentage ?? 0) / 100,
          rolling_casino_percentage:
            (formValue.rolling_casino_percentage ?? 0) / 100,
          rolling_mini_game_percentage:
            (formValue.rolling_mini_game_percentage ?? 0) / 100,
          rolling_slot_percentage:
            (formValue.rolling_slot_percentage ?? 0) / 100,
          rolling_sports_percentage:
            (formValue.rolling_sports_percentage ?? 0) / 100,
          userid,
          password: undefined,
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
    } finally {
      mutate();
    }
  };

  useEffect(() => {
    if (data) {
      agentForm.setFieldsValue({
        agent_lossing_percentage: (data.agent_lossing_percentage ?? 0) * 100,
        agent_rolling_casino_percentage:
          (data.agent_rolling_casino_percentage ?? 0) * 100,
        agent_rolling_mini_game_percentage:
          (data.agent_rolling_mini_game_percentage ?? 0) * 100,
        agent_rolling_slot_percentage:
          (data.agent_rolling_slot_percentage ?? 0) * 100,
        agent_rolling_sports_percentage:
          (data.agent_rolling_sports_percentage ?? 0) * 100,
      });

      form.setFieldsValue({
        lossing_point_percentage: (data.lossing_point_percentage ?? 0) * 100,
        rolling_casino_percentage: (data.rolling_casino_percentage ?? 0) * 100,
        rolling_mini_game_percentage:
          (data.rolling_mini_game_percentage ?? 0) * 100,
        rolling_slot_percentage: (data.rolling_slot_percentage ?? 0) * 100,
        rolling_sports_percentage: (data.rolling_sports_percentage ?? 0) * 100,
      });
    }
  }, [data]);

  return (
    <Row gutter={10}>
      <Col span={12}>
        <Form form={form} onFinish={() => handleSubmit()} layout="vertical" disabled={data && data.id == 1}>
          <Row gutter={10}>
            {/* <Col span={12} style={titleColStyle}>
              직소속유저루징
            </Col>
            <Col span={12} style={colStyle}>
              <Form.Item
                noStyle
                name={"lossing_point_percentage"}
                rules={[{ required: true }]}
              >
                <Input type="number" addonAfter="%" />
              </Form.Item>
            </Col> */}

            <Col span={12} style={titleColStyle}>
              {i18next.t("agentForm.directMemberCasinoRolling")}
            </Col>
            <Col span={12} style={colStyle}>
              <Form.Item
                noStyle
                name={"rolling_casino_percentage"}
                rules={[{ required: true }]}
              >
                <Input type="number" addonAfter="%" />
              </Form.Item>
            </Col>

            <Col span={12} style={titleColStyle}>
              {i18next.t("agentForm.directMemberSlotRolling")}
            </Col>
            <Col span={12} style={colStyle}>
              <Form.Item
                noStyle
                name={"rolling_slot_percentage"}
                rules={[{ required: true }]}
              >
                <Input type="number" addonAfter="%" />
              </Form.Item>
            </Col>

            <Col span={12} style={titleColStyle}>
              {i18next.t("agentForm.directMemberMinigameRolling")}
            </Col>
            <Col span={12} style={colStyle}>
              <Form.Item
                noStyle
                name={"rolling_mini_game_percentage"}
                rules={[{ required: true }]}
              >
                <Input type="number" addonAfter="%" />
              </Form.Item>
            </Col>

            <Col span={12} style={titleColStyle}>
              {i18next.t("agentForm.directMemberSportsRolling")}
            </Col>
            <Col span={12} style={colStyle}>
              <Form.Item
                noStyle
                name={"rolling_sports_percentage"}
                rules={[{ required: true }]}
              >
                <Input type="number" addonAfter="%" />
              </Form.Item>
            </Col>
            {/* <Col span={12} style={titleColStyle}>
            총판메모
            </Col>
            <Col span={12} style={colStyle}>
              <Form.Item
                noStyle
                name={"agent_memo"}
                rules={[{ required: true }]}
              >
                <Input.TextArea
                  className="textarea-count-topleft"
                  maxLength={500}
                  size="small"
                  style={{minHeight: 30, maxHeight: 30}}
                />
              </Form.Item>
            </Col> */}
            <Col span={12} style={colStyle}><div className="" style={{height: 31.78}}>&nbsp;</div></Col>
            <Col span={12} style={colStyle}><div className="" style={{height: 31.78}}>&nbsp;</div></Col>
            <Col span={16} style={colStyle} />
            <Col span={8} style={colStyle}>
              <SaveBtn size="small" block noStyle disabled={disabled} />
            </Col>
          </Row>
        </Form>
      </Col>

      <Col span={12}>
        <Form
          form={agentForm}
          onFinish={() => handleSubmit()}
          layout="vertical"
          disabled={data && data.id == 1}
        >
          <Row gutter={10}>
            <Col span={12} style={titleColStyle}>
              {i18next.t("agentForm.losingLimit")}
            </Col>
            <Col span={12} style={colStyle}>
              <Form.Item
                noStyle
                name={"agent_lossing_percentage"}
                rules={[{ required: true }]}
              >
                <Input type="number" addonAfter="%" />
              </Form.Item>
            </Col>

            <Col span={12} style={titleColStyle}>
              {i18next.t("agentForm.casinoRollingLimit")}
            </Col>
            <Col span={12} style={colStyle}>
              <Form.Item
                noStyle
                name={"agent_rolling_casino_percentage"}
                rules={[{ required: true }]}
              >
                <Input type="number" addonAfter="%" />
              </Form.Item>
            </Col>

            <Col span={12} style={titleColStyle}>
              {i18next.t("agentForm.slotRollingLimit")}
            </Col>
            <Col span={12} style={colStyle}>
              <Form.Item
                noStyle
                name={"agent_rolling_slot_percentage"}
                rules={[{ required: true }]}
              >
                <Input type="number" addonAfter="%" />
              </Form.Item>
            </Col>

            <Col span={12} style={titleColStyle}>
              {i18next.t("agentForm.minigameRollingLimit")}
            </Col>
            <Col span={12} style={colStyle}>
              <Form.Item
                noStyle
                name={"agent_rolling_mini_game_percentage"}
                rules={[{ required: true }]}
              >
                <Input type="number" addonAfter="%" />
              </Form.Item>
            </Col>

            <Col span={12} style={titleColStyle}>
              {i18next.t("agentForm.sportsRollingLimit")}
            </Col>
            <Col span={12} style={colStyle}>
              <Form.Item
                noStyle
                name={"agent_rolling_sports_percentage"}
                rules={[{ required: true }]}
              >
                <Input type="number" addonAfter="%" />
              </Form.Item>
            </Col>

            <Col span={16} style={colStyle} />
            <Col span={8} style={colStyle}>
              <SaveBtn size="small" block noStyle disabled={disabled} />
            </Col>
          </Row>
        </Form>
      </Col>      
    </Row>
  );
};

export default AgentUpdate;
