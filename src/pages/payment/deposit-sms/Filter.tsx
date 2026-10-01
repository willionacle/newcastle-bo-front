import i18next from "@/i18n/i18n";
import DateRange, { DateRangeType } from "@/components/DateRange";
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
  depositor: string | undefined;
  status: string | undefined;
  bank: string | undefined;
}

interface QueryData {
  dateRange: string[] | undefined;
  depositor: string | undefined;
  status: string | undefined;
  bank: string | undefined;
}

const Filter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const handleSubmit = (e: FilterData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname,
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
      depositor       : e.depositor ?  e.depositor : null,
      status        : e.status ?  e.status : null,
      bank    : e.bank ?  e.bank : null,
      start_date  : e.dateRange ? GF.formatDate(e.dateRange[0], true) : null,
      end_date    : e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,
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
          <Form.Item label={t("col.bankName")} name={"bank"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.depositorName")} name={"depositor"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("deposit.de002")}
            name="status"
            initialValue={null}
          >
            <Select size="small" allowClear>
              <Select.Option value="0">{i18next.t("payment.smsUnprocessed")}</Select.Option>
              {/* <Select.Option value="1">처리완료</Select.Option> */}
              <Select.Option value="2">{i18next.t("payment.duplicateWaiting")}</Select.Option>
              <Select.Option value="3">{i18next.t("payment.noMatch")}</Select.Option>
              <Select.Option value="4">{i18next.t("payment.processing")}</Select.Option>
              <Select.Option value="5">{i18next.t("sidemenu.sm063")}</Select.Option>
            </Select>
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
