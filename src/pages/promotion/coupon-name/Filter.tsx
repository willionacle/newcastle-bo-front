import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row } from "antd";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface FormProps {
  name: string;
  coupon_content: string;
}

export interface QueryProps {
  name: string | undefined;
  coupon_content: string | undefined;
}

interface Props {
  setFilter: any;
}

const Filter = ({ setFilter }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryProps;
    navigate({
      pathname: "/promotion/coupon-name",
      search: stringify({
        ...q,
        ...e,
        page: 1
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
      name: e.name
        ? e.name
        : null,
      coupon_content: e.coupon_content
        ? e.coupon_content
        : null,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical"  onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col {...filterColProps}>
          <Form.Item name={'name'} label={i18next.t("promotion.couponName")}>
            <Input size="small" />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item name={'coupon_content'} label={i18next.t("col.couponContent")}>
            <Input size="small" />
          </Form.Item>
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
