import { ResUser } from "@/api/types";
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

interface Props {
  setFilter: Dispatch<SetStateAction<any | undefined>>;
  user: ResUser['data'] | undefined;
}

interface FormData {
  dateRange: DateRangeType;
  title: string;
  contents: string;
}

interface QueryData {
  dateRange: string[];
  title: string;
  contents: string;
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
        tab: "messageLog",
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
        : [dayjs().startOf('month'), dayjs().endOf('month')],
    });

    setFilter((prevData: any) => ({
      ...prevData,
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], true) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,
      title: e.title ? e.title : null,
      contents: e.contents ? e.contents : null,
    }));
  }, [search, user]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <DateRange />
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("message.msg002")} name={"title"} initialValue={""}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("message.msg003")} name={"contents"} initialValue={""}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col
          {...filterColProps}
          style={{
            alignSelf: "center",
          }}
        >
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
