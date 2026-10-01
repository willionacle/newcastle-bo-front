import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
// import DateRange from "@/components/DateRange";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row, Select } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import { SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { GF } from "@/utils/GlobalFunctions";
import DateRangeTag from "@/components/DateRangeTag";

type DateRangeType = [dayjs.Dayjs | null, dayjs.Dayjs | null] | null;

interface FormProps {
  dateRange: DateRangeType;
  username: string | undefined;
  status: string | undefined;
  hasVAccount: string | undefined;
}

interface Props {
  setFilter: SetStateAction<any | undefined>;
}

interface QueryData {
  dateRange?: string[];
  username?: string;
  status?: string;
  hasVAccount?: string;
}

const Filter = ({ setFilter }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/user/login-env-change-log",
      search: stringify({
        ...q,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        username: e.username ? e.username : undefined,
        status: e.status !== undefined && e.status !== "" ? e.status : undefined,
        hasVAccount: e.hasVAccount !== undefined && e.hasVAccount !== "" ? e.hasVAccount : undefined,
        page: 1,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;
    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    } as any);

    const hasVAccount = e.hasVAccount !== undefined && e.hasVAccount !== "" ? e.hasVAccount : "true";
    form.setFieldValue("hasVAccount", hasVAccount);

    setFilter((prevData: any) => ({
      ...prevData,
      username: e.username ? e.username : null,
      status: e.status !== undefined && e.status !== "" ? e.status : null,
      hasVAccount: hasVAccount,
      startDate: e.dateRange
        ? GF.formatDate(e.dateRange[0], false)
        : null,
      endDate: e.dateRange
        ? GF.formatDate(e.dateRange[1], false)
        : null,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col {...filterColProps}>
          <Form.Item name="dateRange">
            {/* <DateRange /> */}
            <DateRangeTag/>
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item label={t("col.username")} name="username">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item label={t("col.status")} name="status">
            <Select size="small" allowClear placeholder={t("col.all")}>
              <Select.Option value="0">{i18next.t("status.blocking")}</Select.Option>
              <Select.Option value="1">{i18next.t("status.restored")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item label={t("col.hasDepositAccount")} name="hasVAccount" initialValue="true">
            <Select size="small" allowClear placeholder={t("col.all")}>
              <Select.Option value="true">{i18next.t("status.held")}</Select.Option>
              <Select.Option value="false">{i18next.t("status.notHeld")}</Select.Option>
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
