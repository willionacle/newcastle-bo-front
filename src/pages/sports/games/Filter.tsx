import DateRange, { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
}

interface FilterData {
  dateRange: DateRangeType;
  sport: string | undefined;
  country: string | undefined;
  league: string | undefined;
  team: string | undefined;
  keyword: string | undefined;
  marketType: string | undefined;
  orderby: string | undefined;
}

interface QueryData {
  dateRange: string[] | undefined;
  sport: string | undefined;
  country: string | undefined;
  league: string | undefined;
  team: string | undefined;
  keyword: string | undefined;
  marketType: string | undefined;
  orderby: string | undefined;
}

const SPORT_OPTIONS = [
  { value: "Football", label: "축구" },
  { value: "Basketball", label: "농구" },
  { value: "Baseball", label: "야구" },
  { value: "LoL", label: "LOL" },
  { value: "Ice Hockey", label: "아이스하키" },
  { value: "Volleyball", label: "배구" },
];

const MARKET_TYPE_OPTIONS = [
  { value: "1x2", label: "1X2" },
  { value: "handicap", label: "핸디캡" },
  { value: "underover", label: "언더/오버" },
];

const Filter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FilterData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;

    navigate({
      pathname: "/betting/sport-games",
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
    const e = parse(search.replace("?", "")) as unknown as QueryData;

    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });

    setFilters((prevData: any) => ({
      ...prevData,
      sport: e.sport ? e.sport : null,
      country: e.country ? e.country : null,
      league: e.league ? e.league : null,
      team: e.team ? e.team : null,
      keyword: e.keyword ? e.keyword : null,
      marketType: e.marketType ? e.marketType : null,
      orderby: e.orderby ? e.orderby : "asc",
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
            <DateRange label="col.kickoffTime" />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.sport")} name={"sport"}>
            <Select
              size="small"
              allowClear
              placeholder={t("col.sport")}
              options={SPORT_OPTIONS}
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.country")} name={"country"}>
            <Input size="small" allowClear placeholder={t("col.country")} />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.league")} name={"league"}>
            <Input size="small" allowClear placeholder={t("col.league")} />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.homeTeam")} name={"team"}>
            <Input
              size="small"
              allowClear
              placeholder={t("col.homeTeam")}
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("global.search")} name={"keyword"}>
            <Input size="small" allowClear placeholder={t("global.search")} />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.marketType")} name={"marketType"}>
            <Select
              size="small"
              allowClear
              placeholder={t("col.marketType")}
              options={MARKET_TYPE_OPTIONS}
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("global.sortOrder")} name={"orderby"}>
            <Select
              size="small"
              options={[
                { value: "asc", label: t("global.ascending") },
                { value: "desc", label: t("global.descending") },
              ]}
            />
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
