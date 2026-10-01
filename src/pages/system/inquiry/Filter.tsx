import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row, Select } from "antd";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { InquiryCategoryOption } from "@/api/inquiry/categories";

interface Props {
  setFilters: Dispatch<SetStateAction<any>>;
  categories: InquiryCategoryOption[];
}

interface FilterData {
  dateRange: DateRangeType;
  username?: string;
  category?: string;
  status?: string;
}

// Deposit/withdrawal/etc are hidden from the filter for now — players can no
// longer submit those categories (only general/bank_account/crypto_wallet),
// so they'd just be dead options here. Existing tickets in these categories
// still display correctly elsewhere since this only affects this dropdown.
const HIDDEN_CATEGORIES = ["deposit", "withdrawal", "etc"];

const Filter = ({ setFilters, categories }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();

  const handleSubmit = (e: FilterData) => {
    setFilters((prev: any) => ({
      ...prev,
      username: e.username || undefined,
      category: e.category || undefined,
      status: e.status || undefined,
      startDate: e.dateRange?.[0] ? GF.formatDate(e.dateRange[0], false) : undefined,
      endDate: e.dateRange?.[1] ? GF.formatDate(e.dateRange[1], false) : undefined,
      page: 1,
    }));
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <Form.Item>
            <DateRange />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("inquiry.username")} name="username">
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("inquiry.category")} name="category">
            <Select size="small" allowClear>
              {categories
                .filter((c) => !HIDDEN_CATEGORIES.includes(c.key))
                .map((c) => (
                  <Select.Option key={c.key} value={c.key}>
                    {c.labelKo}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("inquiry.status")} name="status">
            <Select size="small" allowClear>
              <Select.Option value="pending">{t("inquiry.statusPending")}</Select.Option>
              <Select.Option value="answered">{t("inquiry.statusAnswered")}</Select.Option>
              <Select.Option value="closed">{t("inquiry.statusClosed")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col {...filterColProps} style={{ alignSelf: "center" }}>
          <SearchBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
