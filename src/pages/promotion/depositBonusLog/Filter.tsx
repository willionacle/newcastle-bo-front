import i18next from "@/i18n/i18n";
import { DateRangeType } from "@/components/DateRange";
import DateRangeTag from "@/components/DateRangeTag";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface FormProps {
  username: string;
  bonus_name: string;
  bonus_group: string;
  dateRange: DateRangeType;
}

export interface QueryProps {
  username: string | undefined;
  bonus_name: string | undefined;
  bonus_group: string | undefined;
  dateRange: string | undefined;
}

interface Props {
  setFilter: any;
}

const Filter = ({ setFilter }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryProps;
    navigate({
      pathname: "/promotion/deposit-bonus-log",
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
    const e = parse(search.replace("?", "")) as unknown as QueryProps;

    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
              ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
              : [null, null],
    });

    setFilter((prevData: any) => ({
      ...prevData,
      username: e.username
        ? e.username
        : null,
      bonus_name: e.bonus_name
        ? e.bonus_name
        : null,
      bonus_group: e.bonus_group
        ? e.bonus_group
        : null,
        start_date: e.dateRange ? GF.formatDate(e.dateRange[0], true) : null,
        end_date  : e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical"  onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col {...filterColProps}>
          <DateRangeTag showTime />
        </Col>
        <Col>
          <Form.Item name={'username'} label={i18next.t("col.id")}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name={'bonus_name'} label={i18next.t("depositBonus.db002")}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name={'bonus_group'} label={i18next.t("depositBonus.db010")}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col
          style={{
            alignSelf: "center",
          }}
        >
          <SearchBtn size="small" block style={{marginBottom: '1.2rem'}} />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
