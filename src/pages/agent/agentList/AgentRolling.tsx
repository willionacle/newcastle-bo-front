import { Col, Form, Input, Row, Switch } from "antd";
import { useTranslation } from "react-i18next";
import { colStyle, titleColStyle } from "./AgentStyle";
import SaveBtn from "@/components/SaveBtn";

const AgentRolling = () => {
  const { t } = useTranslation();

  return (
    <Form>
      <Row gutter={10}>
        <Col span={4} style={titleColStyle}>
          {t("agent.al021")}
        </Col>
        <Col span={10} style={colStyle}>
          <Input placeholder="agent.al021" />
        </Col>
        <Col span={5} style={titleColStyle}>
          {t("agent.al025")}
        </Col>
        <Col span={5} style={titleColStyle}>
          <Switch />
        </Col>
        <Col span={20} style={colStyle} />
        <Col span={4} style={colStyle}>
          <SaveBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default AgentRolling;
