import { DateRangeType } from "@/components/DateRange";
import { Col, Form, Input, Row } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { filterColProps } from "@/provider/filterColStyle";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import dayjs from "dayjs";
import { GF } from "@/utils/GlobalFunctions";
import SearchBtn from "@/components/SearchBtn";
import UserSelect from "@/components/UserSelect";
import { DefaultOptionType } from "antd/es/select";
import DateRangeTag from "./DateRangeTag";

export interface FormProps {
  dateRange: DateRangeType;
  game_id?: string | null;
  username?: DefaultOptionType;
}

export interface QueryData {
  dateRangeT: string[] | undefined;
  game_id: string | undefined;
  game_category?: string;
  username: DefaultOptionType;
}

interface Props {
  setFilters: any;
  username?: string;
}

const Filter = ({ setFilters, username }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const handleSubmit = (e: any) => {
    const query = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: `${pathname}`,
      search: stringify({
        ...query,
        tab: pathname.includes('/user') ? "info" : undefined,
        username: e.username ? e.username : null,
        game_id: e.game_id ? e.game_id : null,
        dateRangeT: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        page: 1
      }),
    });
  };
  

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData
    console.log(e.username)
    form.setFieldsValue({
      username: e.username ? e.username : undefined,
      game_id: e.game_id ? e.game_id : null,
      dateRange: e.dateRangeT ? [dayjs(e.dateRangeT[0]), dayjs(e.dateRangeT[1])]
      : [null, null],
    })
    setFilters((prevData: any) => ({
      ...prevData,
      username: username ?? (e.username?.label ?? null),
      start_date: e.dateRangeT ? GF.formatDate(e.dateRangeT[0], true) : null,
      end_date: e.dateRangeT ? GF.formatDate(e.dateRangeT[1], true) : null,
      vendor_id: e.game_id ? e.game_id : null,
      game_category: e.game_category ? e.game_category : null,
    }))
  }, [search])

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
    <Row gutter={16}>
      <Col span={6}>
        {/* <DateRange showTime={{defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')]}} /> */}
        <DateRangeTag showTime={{defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')]}} />
      </Col>
      {pathname.includes('totalrecord') && (
        <Col {...filterColProps}>
          <UserSelect label="ID" mode={undefined} />
        </Col>
      )}

      <Col {...filterColProps}>
        <Form.Item label={t("memberDetail.mis053")} name={"game_id"}>
          <Input size="small" allowClear />
        </Form.Item>
        
      </Col>

      <Col
        {...filterColProps}
        style={{
          alignSelf: "center",
        }}
      >
        <SearchBtn size="small" style={{marginBottom: '1.25rem'}} />
        {/* <Button
          size="small"
          htmlType="button"
          style={{
            marginLeft: "0.2rem",
          }}
          onClick={handleKoscaSearch}
        >
          배팅내역
        </Button> */}
      </Col>
    </Row>
  </Form>
  );
};

export default Filter;
