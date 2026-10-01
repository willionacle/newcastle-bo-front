import { Col, Form, Input, Row, Select } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";

interface Props {
  setFilters: Dispatch<SetStateAction<any>>;
}

interface FilterData {
  keyword?: string;
  status?: string;
  onlySuper?: string;
}

const Filter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();

  const handleSubmit = (e: FilterData) => {
    setFilters((prev: any) => ({
      ...prev,
      keyword: e.keyword || undefined,
      status: e.status || undefined,
      onlySuper: e.onlySuper || undefined,
      page: 1,
    }));
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <Form.Item label={t("adminAccounts.keyword")} name="keyword">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("adminAccounts.status")} name="status">
            <Select size="small" allowClear>
              <Select.Option value="ACTIVE">{t("adminAccounts.statusActive")}</Select.Option>
              <Select.Option value="STOPPED">{t("adminAccounts.statusStopped")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("adminAccounts.tier")} name="onlySuper">
            <Select size="small" allowClear>
              <Select.Option value="true">{t("adminAccounts.onlySuper")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col {...filterColProps} style={{ alignSelf: "center" }}>
          <SearchBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
