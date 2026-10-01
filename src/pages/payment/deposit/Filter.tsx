import DateRange, { DateRangeType } from "@/components/DateRange";
import PaymentStatusSelector from "@/components/PaymentStatusSelector";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
// import VirtualAccountSwitch from "./VirtualAccountSwitch/VirtualAccountSwitch";
import { Select } from "antd";
import { useDepositMethodList } from "@/api/deposit-method/get";
import AppUsageSelector from "@/components/AppUsageSelector";
interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
}

interface FilterData {
  dateRange: DateRangeType;
  agent: string | undefined;
  username: string | undefined;
  name: string | undefined;
  level: string | undefined;
  amount: string | undefined;
  status: string | undefined;
  approver: string | undefined;
  has_app_login: string | undefined;
}

interface QueryData {
  dateRange: string[] | undefined;
  agent: string | undefined;
  username: string | undefined;
  name: string | undefined;
  level: string | undefined;
  amount: string | undefined;
  status: string | undefined;
  payment_method: string | undefined;
  has_app_login: string | undefined;
}

const Filter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { data: depositMethods } = useDepositMethodList();

  const handleSubmit = (e: FilterData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/payment",
      search: stringify({
        ...q,
        ...e,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
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
    });

    setFilters((prevData: any) => ({
      ...prevData,
      agent: e.agent ? e.agent : null,
      name: e.name ? e.name : null,
      username: e.username ? e.username : null,
      start_date: e.dateRange
        ? `${GF.formatDate(e.dateRange[0], false)} 00:00:00`
        : null,
      end_date: e.dateRange
        ? `${GF.formatDate(e.dateRange[1], false)} 23:59:59`
        : null,
      level: e.level ? e.level : null,
      status: e.status ? e.status : null,
      amount: e.amount ? e.amount : null,
      has_app_login: e.has_app_login ? e.has_app_login : null,
      payment_method: e.payment_method ? e.payment_method : null,
    }));
  }, [search]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <Form.Item>
            <DateRange />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("deposit.de012")} name={"agent"}>
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
          <Form.Item label={t("deposit.de019")} name={"level"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("deposit.de014")} name={"amount"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <PaymentStatusSelector />
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.depositMethod")} name="payment_method">
            <Select size="small" allowClear>
              {depositMethods?.map((method) => (
                <Select.Option key={method.type} value={method.type}>
                  {method.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <AppUsageSelector name="has_app_login" />
        </Col>

        <Col
          {...filterColProps}
          style={{
            alignSelf: "center",
          }}
        >
          <SearchBtn block size="small" />
        </Col>
        {/* <VirtualAccountSwitch /> */}
      </Row>
    </Form>
  );
};

export default Filter;
