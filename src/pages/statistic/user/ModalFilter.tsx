import { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import DateRangeTag from "@/components/DateRangeTag";
import { Col, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { GF } from "@/utils/GlobalFunctions";
import { UserDailyStatsModalFilters } from "@/api/cs-statics/user-daily-stats";

interface FormProps {
  dateRange: DateRangeType;
  username: string;
  account_name: string;
  status: string;
}

interface Props {
  applyFilters: (patch: Partial<UserDailyStatsModalFilters>) => void;
  startDate?: string | null;
  endDate?: string | null;
}

// Local-state counterpart to ./Filter for the results modal (no URL navigation).
const ModalFilter = ({ applyFilters, startDate, endDate }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const { t } = useTranslation();

  const handleSubmit = (e: FormProps) => {
    applyFilters({
      start_date: e.dateRange?.[0] ? GF.formatDate(e.dateRange[0].format(), false) : null,
      end_date: e.dateRange?.[1] ? GF.formatDate(e.dateRange[1].format(), false) : null,
      username: e.username ? e.username : null,
      account_name: e.account_name ? e.account_name : null,
      status: e.status ? e.status : null,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        dateRange: startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : undefined,
      }}
    >
      <Row gutter={16}>
        <Col>
          <DateRangeTag hasDefault={false} />
        </Col>
        <Col>
          <Form.Item label="ID" name={"username"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item label={t("col.name")} name={"account_name"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col xs={12} md={4}>
          <Form.Item label={t("memberInfo.mi010")} name={"status"} initialValue={""}>
            <Select size="small">
              <Select.Option value="">{t("memberInfo.mi011")}</Select.Option>
              <Select.Option value="ACTIVE">{t("memberInfo.mi012")}</Select.Option>
              <Select.Option value="ROYALBLACK">{t("memberInfo.royalBlack")}</Select.Option>
              <Select.Option value="OBSERVATION">
                <span style={{ color: "var(--ant-color-error)" }}>{t("memberInfo.mi036")}</span>
              </Select.Option>
              <Select.Option value="DEACTIVATED">{t("memberInfo.mi014")}</Select.Option>
              <Select.Option value="SUSPENDED">{t("memberInfo.mi015")}</Select.Option>
              <Select.Option value="UNVERIFIED">{t("memberInfo.mi030")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col style={{ alignSelf: "center", marginTop: "-1.2rem" }}>
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default ModalFilter;
