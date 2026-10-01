import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row } from "antd";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  setFilters: (updater: (prev: any) => any) => void;
}

interface FormProps {
  filter_category: string;
}

interface QueryProps {
  filter_category: string;
}

const Filter = ({ setFilters }: Props) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [form] = Form.useForm<FormProps>();

  const handleSubmit = (values: FormProps) => {
    const query = parse(search.replace("?", "")) as unknown as QueryProps;

    navigate({
      pathname: "/stream/categories",
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
      filter_category: e.filter_category,
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
          <Form.Item label={i18next.t("col.title")} name="filter_category" initialValue="">
            <Input size="small" allowClear />
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
