import i18next from "@/i18n/i18n";
import { WithdrawalDetailBalanceBody } from "@/api/withdrawal-detail/post";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect } from "react";

interface Props {
  setFilter: Dispatch<SetStateAction<WithdrawalDetailBalanceBody>>;
  startDate: undefined | string | null;
  endDate: null | string | undefined;
}

interface FormData {
  dateRange: DateRangeType;
  systemNote?: string;
  type2?: string;
}

const MoneyFilter = ({ endDate, setFilter, startDate }: Props) => {
  const [form] = Form.useForm<FormData>();

  useEffect(() => {
    form.setFieldsValue({
      dateRange: [
        startDate ? dayjs(startDate) : null,
        endDate ? dayjs(endDate) : null,
      ],
    });
  }, [startDate, endDate]);

  const handleSubmit = (e: FormData) => {
    setFilter((old) => ({
      ...old,
      gte: e.dateRange ? e.dateRange[0]?.tz().format() : undefined,
      lte: e.dateRange ? e.dateRange[1]?.tz().format() : undefined,
      systemNote: e.systemNote,
      type2: e.type2,
    }));
  };

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <DateRange showTime />
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={"type2"} label={i18next.t("col.category")} initialValue={i18next.t("col.balance")}>
            <Select
              size="small"
              options={[
                { label: i18next.t("col.all"), value: "" },
                { label: i18next.t("col.balance"), value: "보유금" },
                { label: i18next.t("col.bet"), value: "베팅" },
                { label: i18next.t("col.win"), value: "당첨" },
                { label: i18next.t("moneyType.userAdjust"), value: "유저증감" },
                { label: i18next.t("memberDetail.mis082"), value: "시스템동시증감" },
                { label: i18next.t("moneyType.item"), value: "아이템" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.systemNote")} name={"systemNote"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps} style={{ alignSelf: "center" }}>
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default MoneyFilter;
