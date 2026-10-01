import i18next from "@/i18n/i18n";
import { ResUser } from "@/api/types";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
// import gameList from "@/pages/betting/record/gameList";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Radio, Row } from "antd";
// import { SelectProps } from "antd/lib";
import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { useLocation } from "react-router-dom";
import CategoryFilter from "./component/CategoryFilter";

interface Props {
  setFilter: Dispatch<SetStateAction<any | undefined>>;
  user: ResUser['data'] | undefined;
  selectedDate?: string;
  gameCat: any;
  defaultDateRange: any
}

interface FormData {
  dateRange: DateRangeType;
  game_id: string;
  gameKey: string;
  betId: string;
  tranType: string;
  category: string;
  date_str: string;

}

// interface QueryData {
//   dateRange: string[] | undefined;
//   game_id: string | undefined;
//   date_str: string;
//   dateRangeMI: any;
// }

const Filter = ({ setFilter, user,gameCat,defaultDateRange }: Props) => {
  // const { t } = useTranslation();
  // const { search } = useLocation();
  const [form] = Form.useForm<FormData>();

  const handleSubmit = (values: FormData) => {
    setFilter((prevData: any) => ({
      ...prevData,
      start_date: values.dateRange?.[0] ? dayjs(values.dateRange[0])?.format('YYYY-MM-DD HH:mm:ss') : null,
      end_date: values.dateRange?.[1] ? dayjs(values.dateRange[1])?.format('YYYY-MM-DD HH:mm:ss') : null,
      game_id: values.game_id || null,
      date_str: values.date_str || "updated_at",
      page: 1, 
    }));
  };

  useEffect(() => {
    if (defaultDateRange && defaultDateRange[0] && defaultDateRange[1]) {
      setFilter((prevData: any) => ({
        ...prevData,
        start_date: dayjs(defaultDateRange[0]).format('YYYY-MM-DD HH:mm:ss'),
        end_date:dayjs(defaultDateRange[1]).format('YYYY-MM-DD HH:mm:ss')
      }));
    }
}, [defaultDateRange]);

 useEffect(() => {
    if (defaultDateRange && defaultDateRange[0] && defaultDateRange[1]) {
      form.setFieldsValue({
        date_str: "updated_at",
        dateRange: [dayjs(defaultDateRange[0]), dayjs(defaultDateRange[1])],
      });
    }
}, [defaultDateRange, form]);

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      {!["custom_sportshistory", "custom_sportsmarket"].includes(gameCat || "") && (
        <Row gutter={[16, 0]}>
            
          <Col span={8} xxl={6}>
            <DateRange showTime={{defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')]}} />
          </Col>
          <Col {...filterColProps}>
            <Form.Item name={"date_str"} label=" " initialValue={"updated_at"}>
              <Radio.Group>
                <Radio value={"updated_at"}>{i18next.t("betting.betResultK")}</Radio>
                <Radio value={"created_at"}>{i18next.t("betting.betStart")}</Radio>
              </Radio.Group>
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
      )}
      <CategoryFilter  setFilters={setFilter} user={user} />
    </Form>
  );
};

export default Filter;
