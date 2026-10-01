import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

export interface FormProps {
  dateRange: DateRangeType;
  username: string;
  contents: string;
  title: string;
}

export interface QueryProps {
  dateRange: string[] | undefined;
  username: string;
  contents: string;
  title: string;
}

interface Props {
  setBody: any;
}

const Filter = ({ setBody }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryProps;
    navigate({
      pathname: "/system/message",
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
    const e = parse(search.replace("?", "")) as unknown as QueryProps;

    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });

    setBody((prevData: any) => ({
      ...prevData,
      username: e.username ?? null,
      contents: e.contents ?? null,
      title: e.title ?? null,
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], true) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col {...filterColProps}>
          <DateRange />
        </Col>
        <Col {...filterColProps}>
          <Form.Item name={"title"} label={t("message.msg002")}>
            <Input size="small" />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item name={"contents"} label={t("message.msg003")}>
            <Input size="small" />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            label={t("memberInfo.mi004")}
            name={"username"}
            initialValue={""}
          >
            <Input
              size="small"
              allowClear
              placeholder="search username or leave blank"
            />
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
