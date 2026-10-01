import i18next from "@/i18n/i18n";
import { DateRangeType } from "@/components/DateRange";
import DateRangeTag from "@/components/DateRangeTag";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface FormProps {
  dateRange: DateRangeType;
  username: string;
  coupon_name: string;
  amount: string;
  created_by: string;
}

export interface QueryProps {
  dateRange: string[] | undefined;
  username: string | undefined;
  coupon_name: string | undefined;
  amount: string | undefined;
  created_by: string | undefined;
  is_used: string | undefined;
}

interface Props {
  setFilter: any;
}

const Filter = ({ setFilter }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    // navigate({
    //   pathname: "/user",
    //   search: stringify({
    //     ...e,
    //     dateRange: e.dateRange
    //       ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
    //       : undefined,
    //   }),
    // });
    const q = parse(search.replace("?", "")) as unknown as QueryProps;
    navigate({
      pathname: "/promotion/coupon",
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
    const e = parse(search.replace("?", "")) as unknown as QueryProps;

    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });

    setFilter((prevData: any) => ({
      ...prevData,
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], true) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,

      username: e.username ? e.username : null,
      coupon_name: e.coupon_name ? e.coupon_name : null,
      amount: e.amount ? e.amount : null,
      created_by: e.created_by ? e.created_by : null,
      is_used: e.is_used ? e.is_used : null,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={[16, 16]}>
        <Col {...filterColProps}>
          <DateRangeTag showTime />
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={"coupon_name"} label={i18next.t("promotion.couponName")}>
            <Input size="small" />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={"username"} label={i18next.t("col.id")}>
            <Input size="small" />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={"user_real_name"} label={i18next.t("col.name")}>
            <Input size="small" />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={"amount"} label={i18next.t("col.amount")}>
            <Input size="small" />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={"is_used"} label={i18next.t("col.inUse")}>
          <Select size={"small"} allowClear>
            <Select.Option value="1">
              {i18next.t("status.use")}
            </Select.Option>
            <Select.Option value="0">
              {i18next.t("status.unused")}
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
