import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import TypeCheckBox, { defaultRecordTypes } from "./TypeCheckBox";

interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
}

interface FilterData {
  dateRange: DateRangeType;
  username: string | undefined;
  agent: string | undefined;
  recordType: string[] | undefined;
  systemNote: string | undefined;
}

interface QueryData {
  dateRange: string[] | undefined;
  username: string | undefined;
  agent: string | undefined;
  recordType: string | string[] | undefined;
  systemNote: string | undefined;
}

const Filter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FilterData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;

    // 배열을 comma-separated string으로 변환
    const recordTypeValue = Array.isArray(e.recordType)
      ? e.recordType.join(',')
      : e.recordType;

    navigate({
      pathname: "/user/balance-logs",
      search: stringify({
        ...q,
        ...e,
        recordType: recordTypeValue,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        page: 1,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;

    // 쿼리에서 recordType 파싱: comma-separated string → 배열
    const recordTypeValue =
      e.recordType !== undefined
        ? typeof e.recordType === 'string'
          ? e.recordType.split(',')  // "보유금 입금,보유금 출금" → ["보유금 입금", "보유금 출금"]
          : Array.isArray(e.recordType)
          ? e.recordType
          : [e.recordType]
        : defaultRecordTypes;

    form.setFieldsValue({
      ...e,
      recordType: recordTypeValue,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });

    setFilters((prevData: any) => ({
      ...prevData,
      username: e.username ? e.username : null,
      agent: e.agent ? e.agent : null,
      recordType: recordTypeValue.length > 0 ? recordTypeValue.join(',') : null,
      systemNote: e.systemNote ? e.systemNote : null,
      startDate: e.dateRange
        ? `${GF.formatDate(e.dateRange[0], false)} 00:00:00`
        : null,
      endDate: e.dateRange
        ? `${GF.formatDate(e.dateRange[1], false)} 23:59:59`
        : null,
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
          <Form.Item label={t("col.agent")} name={"agent"}>
            <Input size="small" allowClear placeholder={t("col.agent")} />
          </Form.Item>
        </Col>

        <Col span={9}>
          <Form.Item label={t("col.recordType")} name={"recordType"}>
            <TypeCheckBox />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.systemMemo")} name={"systemNote"}>
            <Input size="small" allowClear placeholder={t("col.systemMemo")} />
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
