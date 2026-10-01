import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row, Select } from "antd";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  setFilter: any;
}

export interface AgentTableFilter {
  username: string | null;
  tree_depth: string | null;
  user_status: string | null;
  user_real_name: string | null;
  agent_username: string | null;
}

const Filter = ({ setFilter }: Props) => {
  const [form] = Form.useForm<AgentTableFilter>();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { t } = useTranslation();

  const handleSubmit = (e: any) => {
    navigate({
      pathname: "/agent/table",
      search: stringify({
        ...e,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as AgentTableFilter;

    form.setFieldsValue({
      ...e,
    });

    setFilter((prevData: any) => ({
      ...prevData,
      username: e.username ? e.username : null,
      tree_depth: e.tree_depth ? e.tree_depth : null,
      user_status: e.user_status ? e.user_status : null,
      user_real_name: e.user_real_name ? e.user_real_name : null,
      agent_username: e.agent_username ? e.agent_username : null,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col {...filterColProps}>
          <Form.Item name={"username"} label={i18next.t("col.agentId")}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={"user_real_name"} label={i18next.t("col.name")}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={"tree_depth"} label={i18next.t("col.level")}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={"agent_username"} label={i18next.t("col.parent")}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("memberInfo.mi010")}
            name={"user_status"}
            initialValue={""}
          >
            <Select size="small" allowClear>
              <Select.Option value="">{t("memberInfo.mi011")}</Select.Option>
              <Select.Option value="ACTIVE">
                {t("memberInfo.mi012")}
              </Select.Option>
              <Select.Option value="INACTIVE">
                {t("memberInfo.mi013")}
              </Select.Option>
              <Select.Option value="DEACTIVATED">
                {t("memberInfo.mi014")}
              </Select.Option>
              <Select.Option value="SUSPENDED">
                {t("memberInfo.mi015")}
              </Select.Option>
              <Select.Option value="UNVERIFIED">
                {t("memberInfo.mi030")}
              </Select.Option>
            </Select>
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
