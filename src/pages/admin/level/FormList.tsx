import useMenu from "@/hooks/useMenu";
import { Checkbox, Col, Form, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

const FormList = () => {
  const { t } = useTranslation();
  const resources = useMenu();

  const adminLevelOptions = [
    { label: t("adminLevel.aals002"), value: "1" },
    { label: t("adminLevel.aals003"), value: "2" },
    { label: t("adminLevel.aals004"), value: "3" },
    { label: t("adminLevel.aals005"), value: "4" },
  ];

  const checkboxComponents = adminLevelOptions.map((item) => (
    <Checkbox
      key={item.value}
      value={item.value}
      style={{ flex: 1, justifyContent: "center" }}
    >
      {item.label}
    </Checkbox>
  ));

  const formItem = resources.map((item) => {
    if (item.children) {
      return item.children.map((child) => (
        <Row gutter={[16, 16]} key={child.key}>
          <Col
            span={5}
            style={{
              background: "var(--ant-color-bg-layout)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography.Text strong>{t(child.label)}</Typography.Text>
          </Col>
          <Col
            span={19}
            style={{
              padding: "1rem",
              background: "var(--ant-color-fill-secondary)",
            }}
          >
            <Checkbox.Group style={{ width: "100%" }}>
              {checkboxComponents}
            </Checkbox.Group>
          </Col>
        </Row>
      ));
    }

    return;
  });

  return (
    <Form
      style={{
        borderRadius: "var(--ant-border-radius)",
        overflow: "hidden",
      }}
    >
      {formItem}
    </Form>
  );
};

export default FormList;
