import DateRangeTag from "@/components/DateRangeTag";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row, Select } from "antd";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { HighStakesCategory } from "@/api/high-stakes/types";
import { DateRangeType } from "@/components/DateRange";

interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
}

interface FormData {
  dateRange: DateRangeType;
  username: string | undefined;
  game_category: HighStakesCategory | undefined;
}

interface QueryData {
  dateRange: string[] | undefined;
  username: string | undefined;
  game_category: HighStakesCategory | undefined;
}

// end_date is inclusive server-side; game_category must be one of the five
// fixed keys. See HIGH_STAKES_ALERT_FRONTEND_INTEGRATION.md §3.
const HistoryFilter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FormData>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FormData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/promotion/high-stakes",
      search: stringify({
        ...q,
        ...e,
        dateRange: e.dateRange ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()] : undefined,
        page: 1,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;

    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])] : [null, null],
    });

    setFilters((prevData: any) => ({
      ...prevData,
      username: e.username ? e.username : null,
      game_category: e.game_category ? e.game_category : null,
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], true) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,
    }));
  }, [search]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <Form.Item>
            <DateRangeTag showTime />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.id")} name={"username"}>
            <Input size="small" allowClear />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("highStakes.categoryColumn")} name={"game_category"}>
            <Select
              size="small"
              allowClear
              options={[
                { label: t("highStakes.categorySports"), value: "sports" },
                { label: t("highStakes.categoryMinigame"), value: "minigame" },
                { label: t("highStakes.categoryLive"), value: "live" },
                { label: t("highStakes.categorySlot"), value: "slot" },
                { label: t("highStakes.categorySpecial"), value: "special" },
              ]}
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <div style={{ marginBottom: 10 }}>&nbsp;</div>
          <SearchBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default HistoryFilter;
