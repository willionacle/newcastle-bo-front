import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import { SetStateAction, useEffect } from "react";
import AgentSelect from "@/components/AgentSelect";
import { useTranslation } from "react-i18next";
import { DefaultOptionType } from "antd/es/select";

interface FormProps {
  username: string;
  user_real_name: string;
  agent_id: DefaultOptionType;
}

interface Props {
  setFilter: SetStateAction<any | undefined>
}

interface QueryData {
  username: string;
  user_real_name: string;
  agent_id: DefaultOptionType;
}

const Filter = ({setFilter}: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { t } = useTranslation()

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/user/levelup-log",
      search: stringify({
        ...q,
        username: e.username ? e.username : undefined,
        user_real_name: e.user_real_name ? e.user_real_name : undefined,
        agent_id: e.agent_id ? e.agent_id.label : undefined,
        page: 1
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;
    form.setFieldsValue({
      ...e,
    });
    setFilter((prevData: any) => ({
      ...prevData,
      username: e.username ? e.username : null,
      user_real_name: e.user_real_name ? e.user_real_name : null,
      agent_id: e.agent_id ? e.agent_id : null,
    }))
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>

        <Col {...filterColProps}>
          <Form.Item label="ID" name={"username"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.name")} name={"user_real_name"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <AgentSelect label={t("memberInfoEdit.mie005")} size="small" />
        </Col>

        <Col
          {...filterColProps}
          style={{ alignSelf: "center" }}
        >
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
