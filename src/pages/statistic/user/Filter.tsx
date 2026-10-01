import i18next from "@/i18n/i18n";
import { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { Col, Form, Input, Row, Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import DateRangeTag from "@/components/DateRangeTag";
import { SetStateAction, useEffect } from "react";
import dayjs from "dayjs";
import { GF } from "@/utils/GlobalFunctions";
import { useTranslation } from "react-i18next";
import { DefaultOptionType } from "antd/es/select";

interface FormProps {
  dateRange: DateRangeType;
  username: string;
  account_name: string;
  status: string;
  agent_id: DefaultOptionType;
}

interface Props {
  setFilter: SetStateAction<any | undefined>
}

interface QueryData {
  dateRange: string[];
  username: string;
  account_name: string;
  status: string;
  agent_id: DefaultOptionType;
}

const Filter = ({setFilter}: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();
  const {t} = useTranslation();

  const handleSubmit = (e: FormProps) => {
    console.log('user filter stats',e)
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/statistic/user",
      search: stringify({
        ...q,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        username: e.username ? e.username : undefined,
        account_name: e.account_name ? e.account_name : undefined,
        status: e.status ? e.status : undefined,
        agent_id: e.agent_id ? (e.agent_id.label || e.agent_id) : undefined,
        page: 1
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;
    console.log('filter effect',e)
    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });
    setFilter((prevData: any) => ({
      ...prevData,
      status: e.status ? e.status : null,
      username: e.username ? e.username : null,
      account_name: e.account_name ? e.account_name : null,
      agent_id: e.agent_id ? e.agent_id : null,
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
    }))
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col >
          <DateRangeTag />
        </Col>
         {/* <Col {...filterColProps}>
          <AgentSelect label={t("memberInfoEdit.mie005")} size="small" />
        </Col> */}
        <Col>
          <Form.Item label="ID" name={"username"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label={i18next.t("col.name")} name={"account_name"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col span={3}>
          <Form.Item
            label={t("memberInfo.mi010")}
            name={"status"}
            initialValue={""}
          >
            <Select size="small">
              <Select.Option value="">{t("memberInfo.mi011")}</Select.Option>
              <Select.Option value="ACTIVE">
                {t("memberInfo.mi012")}
              </Select.Option>
              <Select.Option value="ROYALBLACK">
                {t("memberInfo.royalBlack")}
              </Select.Option>
              {/* <Select.Option value="INACTIVE">
                {t("memberInfo.mi013")}
              </Select.Option> */}
              <Select.Option value="OBSERVATION">
                <span style={{color: 'var(--ant-color-error)'}}>{t("memberInfo.mi036")}</span>
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
          style={{ alignSelf: "center", marginTop: "-1.2rem" }}
        >
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
