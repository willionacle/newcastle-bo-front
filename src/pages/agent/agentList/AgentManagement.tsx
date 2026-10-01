import { Col } from "antd";
import { colStyle, titleColStyle } from "./AgentStyle";
import { useTranslation } from "react-i18next";

const AgentManagement = () => {
  const { t } = useTranslation();

  return (
    <>
      <Col span={12} style={titleColStyle}>
        {t("agent.al027")}
      </Col>
      <Col span={12} style={colStyle}>
        {t("global.sum")}
      </Col>

      <Col span={12} style={titleColStyle}>
        {t("agent.al028")}
      </Col>
      <Col span={12} style={colStyle}>
        {"value"}
      </Col>

      <Col span={12} style={titleColStyle}>
        {t("agent.al029")}
      </Col>
      <Col span={12} style={colStyle}>
        {"value"}
      </Col>

      <Col span={12} style={titleColStyle}>
        {t("agent.al031")}
      </Col>
      <Col span={12} style={colStyle}>
        {"value"}
      </Col>
    </>
  );
};

export default AgentManagement;
