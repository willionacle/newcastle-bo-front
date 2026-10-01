import i18next from "@/i18n/i18n";
import { DateRangeType } from "@/components/DateRange";
import DateRangeTag from "@/components/DateRangeTag";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, InputNumber, Row, Select, SelectProps } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
}

interface FilterData {
  dateRange: DateRangeType;
  agent_username: string | undefined;
  username: string | undefined;
  name: string | undefined;
  status: string | undefined;
  amount: string | undefined;
}

interface QueryData {
  dateRange: string[] | undefined;
  agent_username: string | undefined;
  username: string | undefined;
  name: string | undefined;
  status: string | undefined;
  amount: string | undefined;
}


const statusOptions: SelectProps["options"] = [
  { value: '2', label: i18next.t("moneyType.pay") },
  { value: '1', label: i18next.t("moneyType.unpaid") },
  { value: '3', label: i18next.t("global.cancel") },
];

const Filter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FilterData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/promotion/payback-log",
      search: stringify({
        ...q,
        ...e,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        page: 1
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
    });

    setFilters((prevData: any) => ({
      ...prevData,
      name        : e.name ?  e.name : null,
      agent_username    : e.agent_username ?  e.agent_username : null,
      username    : e.username ?  e.username : null,
      start_date  : e.dateRange ? GF.formatDate(e.dateRange[0], true) : null,
      end_date    : e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,
      status      : e.status ?  e.status : null,
      amount      : e.amount ?  e.amount : null,
    }));
  }, [search]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <Form.Item>
            <DateRangeTag showTime />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.agentSearch")} name={"agent_username"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item label={t("deposit.de007")} name={"username"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("deposit.de008")} name={"name"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.payoutStatus")} name={"status"} initialValue={null}>
            <Select options={statusOptions} allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.payoutAmount")} name={"amount"}>
            <InputNumber size="small" controls={false} style={{width: '100%'}} />
          </Form.Item>
        </Col>

        <Col
          {...filterColProps}
        >
          <div className="" style={{marginBottom: 10}}>&nbsp;</div>
          <SearchBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
