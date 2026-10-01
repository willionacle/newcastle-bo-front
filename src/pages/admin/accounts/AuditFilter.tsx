import { Col, Form, Input, Row, Select } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Dayjs } from "dayjs";
import SearchBtn from "@/components/SearchBtn";
import DateRange from "@/components/DateRange";
import { filterColProps } from "@/provider/filterColStyle";
import { AdminAuditAction } from "@/api/admin-accounts/get";

const ACTIONS: AdminAuditAction[] = [
  "CREATE",
  "PASSWORD",
  "PASSWORD_SELF",
  "DISABLE",
  "ENABLE",
  "GRANT_SUPER",
  "REVOKE_SUPER",
];

interface Props {
  setFilters: Dispatch<SetStateAction<any>>;
}

interface FilterData {
  action?: string;
  username?: string;
  dateRange?: [Dayjs | null, Dayjs | null];
}

const AuditFilter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();

  const handleSubmit = (e: FilterData) => {
    const [start, end] = e.dateRange ?? [null, null];

    setFilters((prev: any) => ({
      ...prev,
      action: e.action || undefined,
      username: e.username?.trim() || undefined,
      from: start ? start.format("YYYY-MM-DD") : undefined,
      to: end ? end.format("YYYY-MM-DD") : undefined,
      page: 1,
    }));
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <Form.Item label={t("adminAccounts.action")} name="action">
            <Select size="small" allowClear>
              {ACTIONS.map((a) => (
                <Select.Option key={a} value={a}>
                  {t(`adminAccounts.actions.${a}`)}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("adminAccounts.targetUsername")} name="username">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <DateRange label="adminAccounts.period" />
        </Col>

        <Col {...filterColProps} style={{ alignSelf: "center" }}>
          <SearchBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default AuditFilter;
