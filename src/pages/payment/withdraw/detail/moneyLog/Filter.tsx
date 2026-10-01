import i18next from "@/i18n/i18n";
import { ResUser } from "@/api/types";
import { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import TypeCheckBox, { plainOptions } from "./TypeFilter/TypeCheckBox";
import DateRangeTag from "@/components/DateRangeTag";

interface Props {
  setFilter: Dispatch<SetStateAction<any | undefined>>;
  user: ResUser["data"] | undefined;
  lastDepositDate?: string;
  lastWithdrawRequestDate?: string;
}

interface FormData {
  dateRange: DateRangeType;
  type: string[];
  system_note: string;
}

const Filter = ({
  setFilter,
  user,
  lastDepositDate,
  lastWithdrawRequestDate,
}: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();

  const handleSubmit = (e: FormData) => {
    setFilter((prev: any) => ({
      ...prev,
      username: user ? user.username : null,
      start_date: e.dateRange?.[0]
        ? GF.formatDate(e.dateRange[0].format(), true)
        : null,
      end_date: e.dateRange?.[1]
        ? GF.formatDate(e.dateRange[1].format(), true)
        : null,
      type: e.type ? JSON.stringify(e.type) : JSON.stringify([""]),
      system_note: e.system_note || null,
    }));
  };

  useEffect(() => {
    // let defaultDateRange =
    //   lastDepositDate && lastWithdrawRequestDate
    //     ? [dayjs(lastDepositDate), dayjs(lastWithdrawRequestDate)]
    //     : [null, null];
    const defaultDateRange = [
      lastDepositDate ? dayjs(lastDepositDate) : dayjs().startOf("day"),
      lastWithdrawRequestDate ? dayjs(lastWithdrawRequestDate) : dayjs().endOf("day"),
    ];

    form.setFieldsValue({
      type: plainOptions.flatMap((item) => item.value),
      dateRange: defaultDateRange,
      system_note: "",
    });

    setFilter((prev: any) => ({
      ...prev,
      username: user ? user.username : null,
      start_date: defaultDateRange[0]
        ? GF.formatDate(defaultDateRange[0].format(), true)
        : null,
      end_date: defaultDateRange[1]
        ? GF.formatDate(defaultDateRange[1].format(), true)
        : null,
      type: JSON.stringify([""]),
      system_note: null,
    }));
  }, [user, lastDepositDate, lastWithdrawRequestDate]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <DateRangeTag showTime hasDefault />
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("memberDetail.mis042")}
            name={"system_note"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col span={9}>
          <Form.Item
            name={"type"}
            label={i18next.t("col.category")}
            initialValue={plainOptions.flatMap((item) => item.value)}
          >
            <TypeCheckBox />
          </Form.Item>
        </Col>

        <Col span={2} style={{ alignSelf: "center" }}>
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
