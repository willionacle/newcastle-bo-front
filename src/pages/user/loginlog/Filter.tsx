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
import { useTranslation } from "react-i18next";

interface FormProps {
  ip: string;
  user: string;
  dateRange: DateRangeType;
  is_app_login: string | undefined;
  only_duplicate_ip: boolean;
  group_by_user: boolean;
}

interface Props {
  setFilter: SetStateAction<any | undefined>;
}

interface QueryData {
  ip: string;
  user: string;
  // Legacy key (pre-REST page / old links) — still honoured
  username?: string;
  dateRange: string[] | undefined;
  is_app_login: string | undefined;
  only_duplicate_ip: string | undefined;
  group_by_user: string | undefined;
}

// REST /api/login-list filter. Dates go out as YYYY-MM-DD (end_date inclusive).
// 중복 IP만 defaults ON (nxseam behaviour): the URL only carries it when turned off.
const Filter = ({ setFilter }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/user/login-log",
      search: stringify({
        ...q,
        username: undefined,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        ip: e.ip ? e.ip : undefined,
        user: e.user ? e.user : undefined,
        is_app_login: e.is_app_login ? e.is_app_login : undefined,
        only_duplicate_ip: e.only_duplicate_ip === false ? false : undefined,
        group_by_user: e.group_by_user ? e.group_by_user : undefined,
        page: 1,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;
    const user = e.user || e.username;
    const isOnlyDuplicateIp = e.only_duplicate_ip !== "false";
    const isGroupByUser = e.group_by_user === "true";
    form.setFieldsValue({
      ip: e.ip,
      user,
      is_app_login: e.is_app_login,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
      only_duplicate_ip: isOnlyDuplicateIp,
      group_by_user: isGroupByUser,
    });
    setFilter((prevData: any) => ({
      ...prevData,
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
      ip: e.ip ? e.ip : null,
      user: user ? user : null,
      is_app_login: e.is_app_login ? e.is_app_login : null,
      only_duplicate_ip: isOnlyDuplicateIp,
      group_by_user: isGroupByUser,
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
          <Form.Item label="ID" name={"user"}>
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
            label={t("loginLog.onlyDuplicateIp")}
            name="only_duplicate_ip"
            valuePropName="checked"
            tooltip={t("loginLog.onlyDuplicateIpHint")}
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            label={t("user.dedupeId")}
            name="group_by_user"
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
