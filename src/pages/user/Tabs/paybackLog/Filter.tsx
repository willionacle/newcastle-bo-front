import i18next from "@/i18n/i18n";
import { ResUser } from "@/api/types";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SaveBtn from "@/components/SaveBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
  user: ResUser['data'] | undefined;
}

interface FormData {
  dateRange: DateRangeType;
  type: string;
  system_note: string;
}

interface QueryData {
  dateRange: string[] | undefined;
  type: string | undefined;
  system_note: string | undefined;
}

const Filter = ({ setFilters, user }: Props) => {
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
        tab: "paybackLog",
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

    setFilters((prevData: any) => ({
      ...prevData,
      start_date  : e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
      end_date    : e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
      system_note : e.system_note ? e.system_note : null,
      type        : e.type ? e.type : null,
    }));
  }, [search, user]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Row gutter={16}>
        <Col {...filterColProps}>
          <DateRange />
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.category")} name={"type"} initialValue={""}>
            <Select
              size="small"
              options={[
                {
                  label: i18next.t("col.all"),
                  value: "",
                },
                {
                  label: i18next.t("moneyType.earn"),
                  value: "적립",
                },
                {
                  label: i18next.t("moneyType.convert"),
                  value: "전환",
                },
                {
                  label: i18next.t("memberDetail.mis082"),
                  value: "시스템동시증감",
                },
                {
                  label: i18next.t("moneyType.userAdjust"),
                  value: "유저증감",
                },
              ]}
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={i18next.t("col.systemNote")} name={"system_note"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col
          {...filterColProps}
          style={{
            alignSelf: "center",
          }}
        >
          <SaveBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
