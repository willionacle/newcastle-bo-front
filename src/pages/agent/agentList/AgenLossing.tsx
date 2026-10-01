import { Col, Form, Input, Row, Select, notification } from "antd";
import { colStyle, titleColStyle } from "./AgentStyle";
import { useTranslation } from "react-i18next";
import SaveBtn from "@/components/SaveBtn";
import { useEffect } from "react";
import { AgentType, ResUser } from "@/api/types";
import { api } from "@/api/axios";
import useUserStore from "@/store/user.store";

interface Props {
  data: AgentType | ResUser['data'] | undefined;
  mutate: any;
}

interface FormData {
  lossing_point_percentage: AgentType["lossing_point_percentage"];
  settlement_cycle: AgentType["settlement_cycle"];
  settlement_cycle_day: AgentType["settlement_cycle_day"];
}

const AgentLossing = ({ data }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const {token, userid} = useUserStore.getState()

  const handleSubmit = async (e: FormData) => {
    if (data) {
      const body: any = {
        ...data,
        ...e,
        userid: userid,
        lossing_point_percentage: e.lossing_point_percentage ? e.lossing_point_percentage / 100 : 0,
      }
      try {
        const res = await api.updateAgent(body, token)
        const {data: {code, message}} = res

        if (code === 0) {
          notification.success({ message: t("toast.common.saveSuccess") });
          // mutate();
        } else {
          notification.error({
            message: message,
          });
        }
        console.log(res)
      } catch (error) {
        console.error(error)
        notification.error({
          message: t("toast.common.saveFailed"),
        });
      }
    }
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        lossing_point_percentage:
          (data.lossing_point_percentage ?? 0) * 100,
      });
    }
  }, [data]);

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Row gutter={10}>
        <Col span={6} style={titleColStyle}>
          {t("agent.al020")}
        </Col>

        <Col span={12} style={colStyle}>
          <Form.Item
            noStyle
            name={"lossing_point_percentage"}
            rules={[{ required: true }]}
          >
            <Input type="number" addonAfter="%" />
          </Form.Item>
        </Col>

        <Col span={6} style={colStyle} />

        <Col
          span={6}
          style={{ ...colStyle, fontWeight: "bold", textAlign: "center" }}
        >
          정산 주기
        </Col>

        <Col span={5} style={colStyle}>
          <Form.Item
            noStyle
            name={"settlement_cycle"}
            initialValue={1}
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: "100%" }}
              size="small"
              options={[
                {
                  label: t("agent.al032"),
                  value: 1,
                },
                {
                  label: t("agent.al033"),
                  value: 2,
                },
                {
                  label: t("agent.al034"),
                  value: 3,
                },
                {
                  label: t("agent.al035"),
                  value: 4,
                },
              ]}
            />
          </Form.Item>
        </Col>

        <Col span={4} style={titleColStyle}>
          {t("agent.al024")}
        </Col>

        <Col span={5} style={colStyle}>
          <Form.Item
            noStyle
            initialValue={1}
            name={"settlement_cycle_day"}
            rules={[{ required: true }]}
          >
            <Select
              style={{ width: "100%" }}
              size="small"
              options={[
                {
                  label: t("agent.al036"),
                  value: 1,
                },
                {
                  label: t("agent.al037"),
                  value: 2,
                },
                {
                  label: t("agent.al038"),
                  value: 3,
                },
                {
                  label: t("agent.al039"),
                  value: 4,
                },
                {
                  label: t("agent.al040"),
                  value: 5,
                },
                {
                  label: t("agent.al041"),
                  value: 6,
                },
                {
                  label: t("agent.al042"),
                  value: 7,
                },
              ]}
            />
          </Form.Item>
        </Col>

        <Col span={4} style={colStyle}>
          <SaveBtn size="small" block noStyle />
        </Col>
      </Row>
    </Form>
  );
};

export default AgentLossing;
