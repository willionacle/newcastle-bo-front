import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row, Select } from "antd";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  setFilters: (updater: (prev: any) => any) => void;
}

interface FormProps {
  filter_title: string;
  filter_country: string;
  filter_category: string;
  filter_isvisible: number;
}

interface QueryProps {
  filter_title: string;
  filter_country: string;
  filter_category: string;
  filter_isvisible: number;
}

const Filter = ({ setFilters }: Props) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [form] = Form.useForm<FormProps>();

  const handleSubmit = (values: FormProps) => {
    const query = parse(search.replace("?", "")) as unknown as QueryProps;

    navigate({
      pathname: "/stream/leagues",
      search: stringify(
        {
          ...query,
          ...values,
        },
        { arrayFormat: "repeat" }
      ),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryProps;

    form.setFieldsValue({
      ...e
    });

    setFilters((prevData: any) => ({
      ...prevData,
      filter_title: e.filter_title,
      filter_country: e.filter_country,
      filter_category: e.filter_category,
      filter_isvisible: e.filter_isvisible,
    }));
  }, [search]);

  return (
    <Form
      layout="vertical"
      onFinish={handleSubmit}
      form={form}
      style={{ marginBottom: "20px" }}
    >
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.countryName")} name="filter_country" initialValue="">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.sport")} name="filter_category" initialValue="">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.title")} name="filter_title" initialValue="">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.showHide")} name="filter_isvisible" initialValue="">
            <Select size="small" allowClear>
              {/* <Select.Option value="">전체</Select.Option> */}
              <Select.Option value="1">{i18next.t("userGameSettings.shown")}</Select.Option>
              <Select.Option value="0">{i18next.t("userGameSettings.hidden")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col {...filterColProps} style={{ alignSelf: "center" }}>
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
