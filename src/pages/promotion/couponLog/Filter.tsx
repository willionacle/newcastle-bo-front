import Btn from "@/components/Btn";
import DateRange from "@/components/DateRange";
import { Col, Form, Input, Row } from "antd";
import { useTranslation } from "react-i18next";

const Filter = () => {
  const { t } = useTranslation();

  return (
    <Form layout="vertical">
      <Row gutter={16}>
        <Col span={6}>
          <DateRange />
        </Col>

        <Col span={6}>
          <Form.Item label={t("couponsLog.cl002")}>
            <Input size="small" />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item label={t("couponsLog.cl003")}>
            <Input size="small" />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item label={t("couponsLog.cl004")}>
            <Input size="small" />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item label={t("couponsLog.cl005")}>
            <Input size="small" />
          </Form.Item>
        </Col>

        <Col span={6} style={{ display: "flex" }}>
          <Btn
            btnType="search"
            block
            size="small"
            style={{ alignSelf: "center" }}
          />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
