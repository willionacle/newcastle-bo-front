import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row } from "antd";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  setFilters: (updater: (prev: any) => any) => void;
}

interface FormProps {
  filter_id: string;
  filter_name: string;
  filter_reply: string;
}

interface QueryProps {
  filter_id: string;
  filter_name: string;
  filter_reply: string;
}

const Filter = ({ setFilters }: Props) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const {t} = useTranslation()
  const [form] = Form.useForm<FormProps>();

  const handleSubmit = (values: FormProps) => {
    const query = parse(search.replace("?", "")) as unknown as QueryProps;

    navigate({
      pathname: "/stream/chat-user-list",
      search: stringify(
        {
          ...query,
          ...values,
          tab: "chat-replies",
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
      filter_id: e.filter_id,
      filter_name: e.filter_name,
      filter_reply: e.filter_reply,
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
          <Form.Item
            label={t("memberInfo.mi004")}
            name={"filter_id"}
            initialValue={""}
          >
            <Input
              size="small"
              allowClear
              placeholder="search username or leave blank"
            />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            label={t("memberInfo.mi006")}
            name={"filter_name"}
            initialValue={""}
          >
            <Input
              size="small"
              allowClear
              placeholder="search name or leave blank"
            />
          </Form.Item>
        </Col>
         <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.content")} name={"filter_reply"}>
            <Input size="small" style={{ width: "100%" }} allowClear />
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
