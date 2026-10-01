import i18next from "@/i18n/i18n";
import { ResUser } from "@/api/types";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import CategoryFilter from "@/pages/betting/record/component/CategoryFilter";
// import gameList from "@/pages/betting/record/gameList";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Radio, Row } from "antd";
// import { SelectProps } from "antd/lib";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
// import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  setFilter: Dispatch<SetStateAction<any | undefined>>;
  user: ResUser['data'] | undefined;
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

interface QueryData {
  dateRange: string[] | undefined;
  game_id: string | undefined;
  date_str: string;
}

const Filter = ({ setFilter, user }: Props) => {
  // const { t } = useTranslation();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();
  const [form] = Form.useForm<FormData>();

  const handleSubmit = (e: FormData) => {
    const query = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: `${pathname}`,
      search: stringify({
        ...query,
        // ...e,
        tab: pathname.includes('/user') ? "bettingLog" : undefined,
        game_id: e.game_id ? e.game_id : undefined,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        page: 1,
        date_str: e.date_str,
      }),
    });
  };

  const query = parse(search?.replace("?", "")) as unknown as QueryData;
  useEffect(() => {
    console.log('bettinglog query', query)
    form.setFieldsValue({
      ...query,
      dateRange: query.dateRange
        ? [dayjs(query.dateRange[0]), dayjs(query.dateRange[1])]
        : [null, null],
    });
    setFilter((prevData: any) => ({
      ...prevData,
      start_date  : query.dateRange ? GF.formatDate(query.dateRange[0], true) : null,
      end_date    : query.dateRange ? GF.formatDate(query.dateRange[1], true) : null,
      game_id     : query.game_id ?  query.game_id : null,
      date_str    : query.date_str ?? "updated_at",
    }));
  }, [search]);

  // const vendorOptions: SelectProps["options"] = [];

  // for (const key in gameList) {
  //   vendorOptions.push({
  //     label: gameList[key],
  //     value: key,
  //   });
  // }

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      {!["custom_sportshistory", "custom_sportsmarket"].includes(query?.game_id || "") && (
        <Row gutter={[16, 0]}>
            
          
          <Col span={8} xxl={6}>
            {/* <DateRange initialValue={[dayjs().startOf('day'), dayjs().endOf('day')]} showTime={{defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')]}} /> */}
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

          {/* <Col {...filterColProps}>
            <Form.Item label={t("memberDetail.mis053")} name={"game_id"}>
              <Input size="small" allowClear />
            </Form.Item>
          </Col> */}

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
      <CategoryFilter setFilters={setFilter} user={user} />
    </Form>
  );
};

export default Filter;
