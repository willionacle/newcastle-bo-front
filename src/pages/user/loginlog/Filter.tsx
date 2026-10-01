import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row, Switch } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import { SetStateAction, useEffect } from "react";
import { DateRangeType } from "@/components/DateRange";
import dayjs from "dayjs";
import { GF } from "@/utils/GlobalFunctions";
import AppUsageSelector from "@/components/AppUsageSelector";
import DateRangeTag from "@/components/DateRangeTag";

interface FormProps {
  ip: string;
  username: string;
  dateRange: DateRangeType;
  is_app_login: string | undefined;
  remove_duplicate: boolean;
}

interface Props {
  setFilter: SetStateAction<any | undefined>;
}

interface QueryData {
  ip: string;
  username: string;
  dateRange: string[] | undefined;
  is_app_login: string | undefined;
  remove_duplicate: string | undefined;
}

const Filter = ({ setFilter }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/user/login-log",
      search: stringify({
        ...q,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        ip: e.ip ? e.ip : undefined,
        username: e.username ? e.username : undefined,
        is_app_login: e.is_app_login ? e.is_app_login : undefined,
        remove_duplicate: e.remove_duplicate ? e.remove_duplicate : undefined,
        page: 1,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;
    const isDuplicate = e.remove_duplicate === "true";
    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
      remove_duplicate: isDuplicate,
    });
    setFilter((prevData: any) => ({
      ...prevData,
      start_date: e.dateRange
        ? `${GF.formatDate(e.dateRange[0], false)} 00:00:00`
        : null,
      end_date: e.dateRange
        ? `${GF.formatDate(e.dateRange[1], false)} 23:59:59`
        : null,
      ip: e.ip ? e.ip : null,
      username: e.username ? e.username : null,
      is_app_login: e.is_app_login ? e.is_app_login : null,
      remove_duplicate: isDuplicate,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col {...filterColProps}>
          <Form.Item>
            <DateRangeTag />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item label="ID" name={"username"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item label="IP" name={"ip"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <AppUsageSelector name="is_app_login" />
        </Col>
        <Col {...filterColProps}>
          <Form.Item 
            label={i18next.t("user.dedupeId")} 
            name="remove_duplicate" 
            valuePropName="checked" 
          >
            <Switch />
          </Form.Item>
        </Col>

        <Col
          {...filterColProps}
          style={{ alignSelf: "center", marginTop: -42 }}
        >
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
