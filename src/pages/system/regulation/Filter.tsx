import RegulationsSelect from "@/components/RegulationsSelect";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Row } from "antd";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export interface FormProps {
  name: string;
  type: string;
}

export interface QueryProps {
  name: string | undefined;
  type: string | undefined;
}

interface Props {
  setFilter: any;
}

const Filter = ({ setFilter }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryProps;
    navigate({
      pathname: "/system/regulation",
      search: stringify({
        ...q,
        ...e,
        page: 1,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryProps;

    form.setFieldsValue({
      ...e,
    });

    setFilter((prevData: any) => ({
      ...prevData,
      name: e.name ? e.name : null,
      type: e.type ? e.type : null,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        {/* <Col {...filterColProps}>
          <Form.Item name={"name"} label="쿠폰명">
            <Input size="small" />
          </Form.Item>
        </Col> */}
        <Col {...filterColProps}>
          <RegulationsSelect label={t("col.type")} />
        </Col>
        <Col
          {...filterColProps}
          style={{
            alignSelf: "center",
          }}
        >
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
