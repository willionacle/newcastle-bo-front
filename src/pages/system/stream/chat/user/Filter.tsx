import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row, Select } from "antd";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

interface Props {
  setFilters: (updater: (prev: any) => any) => void;
}

interface FormProps {
  filter_name: string;
  filter_grade: string;
  filter_level: string;
  filter_chatlevel: string;
  filter_isallowed: string;
  filter_lastchat: string;
}

interface QueryProps {
  filter_name: string;
  filter_realname: string;
  filter_grade: string;
  filter_level: string;
  filter_chatlevel: string;
  filter_isallowed: string;
  filter_lastchat: string;
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
          tab: "user-list",
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
      filter_name: e.filter_name,
      filter_realname: e.filter_realname,
      filter_grade: e.filter_grade,
      filter_level: e.filter_level,
      filter_chatlevel: e.filter_chatlevel,
      filter_isallowed: e.filter_isallowed,
      filter_lastchat: e.filter_lastchat,
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
            name={"filter_name"}
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
            name={"filter_realname"}
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
          <Form.Item label={t("memberInfo.mi007")} name={"filter_level"}>
            <Input size="small" style={{ width: "100%" }} allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            label={t("memberInfo.mi032")}
            name={"filter_grade"}
            initialValue={""}
          >
            <Select size="small" allowClear>
              <Select.Option value="">{i18next.t("col.all")}</Select.Option>
              <Select.Option value="1">{i18next.t("grade.bronze")}</Select.Option>
              <Select.Option value="2">{i18next.t("grade.silver")}</Select.Option>
              <Select.Option value="3">{i18next.t("grade.gold")}</Select.Option>
              <Select.Option value="4">{i18next.t("grade.emerald")}</Select.Option>
              <Select.Option value="5">{i18next.t("grade.ruby")}</Select.Option>
              <Select.Option value="6">{i18next.t("grade.diamond")}</Select.Option>
              <Select.Option value="7">{i18next.t("grade.blackDiamond")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>        
        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.showHide")} name="filter_isallowed" initialValue="">
            <Select size="small" allowClear>
              {/* <Select.Option value="">전체</Select.Option> */}
              <Select.Option value="1">{i18next.t("userGameSettings.shown")}</Select.Option>
              <Select.Option value="0">{i18next.t("userGameSettings.hidden")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
         <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.lastComment")} name={"filter_lastchat"}>
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
