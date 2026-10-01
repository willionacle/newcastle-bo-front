import i18next from "@/i18n/i18n";
import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Radio, Row, SelectProps } from "antd";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import gameList from "./gameList";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import dayjs from "dayjs";
import { GF } from "@/utils/GlobalFunctions";
import CategoryFilter from "./component/CategoryFilter";

interface Props {
  setFilter: any;
}

interface FormData {
  dateRange: DateRangeType;
  game_id: string;
  gameKey: string;
  betId: string;
  username: string;
  tranType: string;
  category: string;
  date_str: string | undefined;
}

interface QueryData {
  dateRange: string[] | undefined;
  game_id: string | undefined;
  gameKey: string | undefined;
  betId: string | undefined;
  username: string | undefined;
  tranType: string | undefined;
  category: string | undefined;
  game_category: string | undefined;
  date_str: string | undefined;
}

const Filter = ({ setFilter }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [form] = Form.useForm<FormData>();

  const handleSubmit = (e: FormData) => {
    const query = parse(search.replace("?", "")) as unknown as QueryData;
    console.log(e);
    navigate({
      pathname: "/betting",
      search: stringify({
        ...query,
        ...e,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        page: 1,
      }),
    });
  };

  useEffect(() => {
    const query = parse(search.replace("?", "")) as unknown as QueryData;

    form.setFieldsValue({
      ...query,
      dateRange: query.dateRange
        ? [dayjs(query.dateRange[0]), dayjs(query.dateRange[1])]
        : [null, null],
    });

    setFilter((prevData: any) => ({
      ...prevData,
      start_date: query.dateRange
        ? GF.formatDate(query.dateRange[0], true)
        : null,
      end_date: query.dateRange
        ? GF.formatDate(query.dateRange[1], true)
        : null,
      game_id: query.game_id ? query.game_id : null,
      username: query.username ? query.username : null,
      game_category: query.game_category ? query.game_category : null,
      date_str: query.date_str ? query.date_str : "updated_at",
    }));
  }, [search]);

  const vendorOptions: SelectProps["options"] = [];

  for (const key in gameList) {
    vendorOptions.push({
      label: gameList[key],
      value: key,
    });
  }

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <DateRange
            showTime={{
              defaultValue: [
                dayjs("00:00:00", "HH:mm:ss"),
                dayjs("23:59:59", "HH:mm:ss"),
              ],
            }}
          />
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
            <Input allowClear size="small" />
          </Form.Item>
        </Col> */}

        {/* <Col {...filterColProps}>
          <Form.Item
            label={t("memberDetail.mis052")}
            name={"betId"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col> */}

        <Col {...filterColProps}>
          <Form.Item
            label={t("memberDetail.mis028")}
            name={"username"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        {/* <Col {...filterColProps}>
          <Form.Item label={t("memberDetail.mis061")} name={"tranType"}>
            <Select
              options={[
                {
                  label: "패배",
                  value: "turn_lose",
                },
                {
                  label: "승리",
                  value: "turn_win",
                },
                {
                  label: "무승부",
                  value: "turn_draw",
                },
                {
                  label: "배팅출금",
                  value: "turn_out",
                },
                {
                  label: "배팅입금",
                  value: "turn_in",
                },
                {
                  label: "배팅",
                  value: "turn_bet",
                },
              ]}
              allowClear
              size="small"
            />
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
      <CategoryFilter setFilters={setFilter} />
    </Form>
  );
};

export default Filter;
