import i18next from "@/i18n/i18n";
import { ResUser } from "@/api/types";
import { DateRangeType } from "@/components/DateRange";
import DateRangeTag from "@/components/DateRangeTag";
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
  is_used: string;
  system_note: string;
}

interface QueryData {
  dateRange: string[] | undefined;
  type: string | undefined;
  is_used: string | undefined;
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
        tab: "couponLog",
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
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], true) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,
      system_note: e.system_note ? e.system_note : null,
      type: e.type ? e.type : null,
      is_used: e.is_used ? e.is_used : null,
    }));
  }, [search, user]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Row gutter={16}>
        <Col {...filterColProps}>
          <DateRangeTag showTime hasDefault={false}/>
        </Col>

        <Col {...filterColProps}>
          <Form.Item name={"is_used"} label={i18next.t("col.inUse")}>
            <Select size={"small"} allowClear>
              <Select.Option value="1">
                {i18next.t("status.use")}
              </Select.Option>
              <Select.Option value="0">
                {i18next.t("status.unused")}
              </Select.Option>
            </Select>
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
          <SaveBtn size="small" customStyle={{marginBottom: '1.25rem'}} />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
