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
}

const Filter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [form] = Form.useForm<FilterData>();

  const handleSubmit = (e: FilterData) => {
    navigate({
      pathname: "/payment/withdraw",
      search: stringify({
        ...e,
        dateRangeW: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
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
      start_date  : e.dateRangeW ? GF.formatDate(e.dateRangeW[0], true) : null,
      end_date    : e.dateRangeW ? GF.formatDate(e.dateRangeW[1], true) : null,
      level       : e.level ?  e.level : null,
      status      : e.status ?  e.status : null,
      amount      : e.amount ?  e.amount : null,
      approver    : e.approver ?  e.approver : null,
      referral    : e.referral ?  e.referral : undefined
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
