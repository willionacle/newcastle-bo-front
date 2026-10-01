import i18next from "@/i18n/i18n";
import DateRange, { DateRangeType } from "@/components/DateRange";
import PaymentStatusSelector from "@/components/PaymentStatusSelector";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row, Select } from "antd";
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
  agent: string | undefined;
  username: string | undefined;
  name: string | undefined;
  level: string | undefined;
  amount: string | undefined;
  status: string | undefined;
  approver: string | undefined;
  referral: string | undefined;
  withdrawal_method: string | undefined;
  verification_code: string | undefined;
}

interface QueryData {
  dateRangeW: string[] | undefined;
  agent: string | undefined;
  username: string | undefined;
  name: string | undefined;
  level: string | undefined;
  amount: string | undefined;
  status: string | undefined;
  approver: string | undefined;
  referral: string | undefined;
  withdrawal_method: string | undefined;
  verification_code: string | undefined;
}

const Filter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [form] = Form.useForm<FilterData>();

  const handleSubmit = (e: FilterData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/payment/withdraw",
      search: stringify({
        ...q,
        ...e,
        dateRangeW: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        page: 1
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;
    console.log(e)
    form.setFieldsValue({
      ...e,
      dateRange: e.dateRangeW
        ? [dayjs(e.dateRangeW[0]), dayjs(e.dateRangeW[1])]
        : [null, null],
    });

    setFilters((prevData: any) => ({
      ...prevData,
      agent       : e.agent ?  e.agent : null,
      name        : e.name ?  e.name : null,
      username    : e.username ?  e.username : null,
      start_date  : e.dateRangeW ? `${GF.formatDate(e.dateRangeW[0], false)} 00:00:00` : null,
      end_date    : e.dateRangeW ? `${GF.formatDate(e.dateRangeW[1], false)} 23:59:59` : null,
      level       : e.level ?  e.level : null,
      status      : e.status ?  e.status : null,
      amount      : e.amount ?  e.amount : null,
      approver    : e.approver ?  e.approver : null,
      referral    : e.referral ?  e.referral : undefined,
      withdrawal_method    : e.withdrawal_method ?  e.withdrawal_method : null,
      verification_code    : e.verification_code ?  e.verification_code : null,
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
          <PaymentStatusSelector />
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("deposit.de009")} name={"approver"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.referrer")} name={"referral"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

         <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.withdrawalType")} name="withdrawal_method">
            <Select size="small" allowClear>
              <Select.Option value="oncash">{i18next.t("payment.oncash")} </Select.Option>
              <Select.Option value="bank">{i18next.t("payment.bankWithdraw")}</Select.Option>
              <Select.Option value="jeju-virtual">{i18next.t("payment.jejuVirtual")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.verifyCode")} name={"verification_code"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col
          {...filterColProps}
          style={{
            alignSelf: "center",
          }}
        >
          <SearchBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
