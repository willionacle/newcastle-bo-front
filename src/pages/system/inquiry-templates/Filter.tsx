import { Col, Form, Input, Row, Select } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { InquiryTemplateMetaCategory } from "@/api/inquiry-templates/get";

interface Props {
  setFilters: Dispatch<SetStateAction<any>>;
  categories: InquiryTemplateMetaCategory[];
}

interface FilterData {
  category?: string;
  isActive?: string;
  keyword?: string;
}

const Filter = ({ setFilters, categories }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();

  const handleSubmit = (e: FilterData) => {
    setFilters((prev: any) => ({
      ...prev,
      category: e.category || undefined,
      isActive: e.isActive || undefined,
      keyword: e.keyword || undefined,
      page: 1,
    }));
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <Form.Item label={t("inquiryTemplate.category")} name="category">
            <Select size="small" allowClear>
              {categories.map((c) => (
                <Select.Option key={c.key} value={c.key}>
                  {c.labelKo}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("inquiryTemplate.isActive")} name="isActive">
            <Select size="small" allowClear>
              <Select.Option value="true">{t("status.active")}</Select.Option>
              <Select.Option value="false">{t("status.inactive")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("inquiryTemplate.keyword")} name="keyword">
            <Input size="small" allowClear />
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
