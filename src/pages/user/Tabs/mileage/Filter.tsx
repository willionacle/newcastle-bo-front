import i18next from "@/i18n/i18n";
import { User } from "@/api/users/get";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  setFilter: Dispatch<SetStateAction<any | undefined>>;
  user: User | undefined;
}

interface FormData {
  dateRange: DateRangeType;
  type: string;
  systemNote: string;
}

interface QueryData {
  dateRange: string[];
  type: string;
  systemNote: string;
}

const Filter = ({ setFilter, user }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [form] = Form.useForm<FormData>();

  const handleSubmit = (e: FormData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: `/user/${user?.id}`,
      search: stringify({
        ...q,
        ...e,
        tab: "mileage",
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

    setFilter({
      username: {
        $eq: user?.username,
      },
      createdAt: e.dateRange
        ? {
            $gt: e.dateRange[0],
            $lt: e.dateRange[1],
          }
        : undefined,
      type2: e.type
        ? {
            $eq: e.type,
          }
        : undefined,
      systemNote: e.systemNote
        ? {
            $contains: e.systemNote,
          }
        : undefined,
    });
  }, [search, user]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <DateRange />
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={"type"} label={i18next.t("col.category")} initialValue={""}>
            <Select
              size="small"
              options={[
                { label: i18next.t("col.all"), value: "" },
                { label: i18next.t("moneyType.earn"), value: "적립" },
                { label: i18next.t("moneyType.convert"), value: "전환" },
                { label: i18next.t("moneyType.systemBulkAdjust"), value: "시스템동시증감" },
                { label: i18next.t("moneyType.userAdjust"), value: "유저증감" },
                { label: i18next.t("moneyType.item"), value: "아이템" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item
            label={t("memberDetail.mis042")}
            name={"systemNote"}
            initialValue={""}
          >
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

export default Filter;
