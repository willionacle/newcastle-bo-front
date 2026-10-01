import Btn from "@/components/Btn";
import DateRange from "@/components/DateRange";
import { Col, Form, Input, Row, Select } from "antd";
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
          <Form.Item label={t("memberDetail.mis117")}>
            <Input size="small" />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item label={t("memberDetail.mis118")}>
            <Input size="small" />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item label={t("memberDetail.mis119")}>
            <Select size="small" />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item label={t("memberDetail.mis120")}>
            <Select size="small" />
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
