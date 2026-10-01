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
}

interface FormData {
  dateRange: DateRangeType;
  user_real_name: string;
  username: string;
}

interface QueryData {
  dateRange: string[];
  system_note: string;
  user_real_name: string;
  username?: string
}

const Filter = ({ setFilter }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const [form] = Form.useForm<FormData>();
  
  const handleSubmit = (e: FormData) => {
    const query = parse(search.replace("?", "")) as unknown as QueryData;
    console.log('MONEYLOG form', e)
    navigate({
      pathname: `${pathname}`,
      search: stringify({
        ...query,
        ...e,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
      }),
    });
  };

  useEffect(() => {
    console.log(pathname)
    const e = parse(search.replace("?", "")) as unknown as QueryData;
    console.log('MONEYLOG parsed search', e)
    console.log(e)
    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : undefined,
    });

    setFilter((prevData: any) => ({
      ...prevData,
      username    : e.username ? e.username : null,
      start_date  : e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
      end_date    : e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
      user_real_name : e.user_real_name ? e.user_real_name : null,
    }));

  }, [search]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <DateRange required />
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            label={t("ID")}
            name={"username"}
            initialValue={""}
          >
            <Input size="small" allowClear style={{width: '100%'}} />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            label={t("agent.al045")}
            name={"user_real_name"}
            initialValue={""}
          >
            <Input size="small" allowClear />
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
