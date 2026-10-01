import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
}

interface FilterData {
  dateRange: DateRangeType;
  username: string | undefined;
  status: string | undefined;
  direction: string | undefined;
}

interface QueryData {
  dateRange: string[] | undefined;
  username: string | undefined;
  status: string | undefined;
  direction: string | undefined;
}

const Filter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FilterData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;

    navigate({
      pathname: "/payment/proof-reports",
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
    const e = parse(search.replace("?", "")) as unknown as QueryData;

    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });

    setFilters((prevData: any) => ({
      ...prevData,
      username: e.username ? e.username : null,
      status: e.status ? e.status : null,
      direction: e.direction ? e.direction : null,
      // start_date / end_date 는 날짜 단위이고 양쪽 다 포함(inclusive)이다.
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
    }));
  }, [search]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <Form.Item>
            <DateRange />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.username")} name={"username"}>
            <Input size="small" allowClear placeholder={t("col.username")} />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.status")} name={"status"}>
            <Select
              size="small"
              allowClear
              placeholder={t("col.all")}
              options={[
                { label: t("proofReport.status.ok"), value: "ok" },
                { label: t("proofReport.status.failed"), value: "failed" },
                { label: t("proofReport.status.skipped"), value: "skipped" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("proofReport.direction")} name={"direction"}>
            <Select
              size="small"
              allowClear
              placeholder={t("col.all")}
              options={[
                { label: t("col.deposit"), value: "deposit" },
                { label: t("topNavi.tn016"), value: "withdrawal" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col span={2} style={{ alignSelf: "center" }}>
          <SearchBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
