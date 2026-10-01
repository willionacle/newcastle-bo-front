import i18next from "@/i18n/i18n";
import { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { 
  Col, 
  Form, 
  Row ,
  Select
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import DateRangeTag from "@/components/DateRangeTag";
import { SetStateAction, useEffect, useMemo } from "react";
import dayjs from "dayjs";
import { GF } from "@/utils/GlobalFunctions";
import AgentSelect from "@/components/AgentSelect";
import { useTranslation } from "react-i18next";
import { DefaultOptionType } from "antd/es/select";
import { BonusUsageData } from "@/api/cs-statics/bonus-usage";

interface FormProps {
  dateRange: DateRangeType;
  name: string;
  agent_id: DefaultOptionType;
  bonus_name: DefaultOptionType;
}

interface Props {
  setFilter: SetStateAction<any | undefined>;
  data: BonusUsageData[] | undefined;
  loading: boolean;
}

interface QueryData {
  dateRange: string[];
  username: string;
  agent_id: DefaultOptionType;
  bonus_name: DefaultOptionType;
}

const Filter = ({setFilter, data, loading}: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { t } = useTranslation()

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;
    navigate({
      pathname: "/statistic/bonus-usage",
      search: stringify({
        ...q,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        agent_id: e.agent_id ? e.agent_id.label : undefined,
        bonus_name: e.bonus_name ? e.bonus_name.label : undefined,
        page: 1
      }),
    });
  };

  const bonusOptions = useMemo(() => {
    const list = data && data.length > 0 ? data.filter((item: BonusUsageData) => {
      if (item.bonus_amount !== 0 ||
        item.deposit_amount !== 0 ||
        item.bonus_count_application !== 0 ||
        item.bonus_count_used !== 0
      ) {
        return item
      }
    }) : [];

    return list?.map(item => ({label: item.bonus_name, value: item.bonus_name})) || [];
  }, [data]);


  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData;
    console.log('filter effect',e)
    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });
    setFilter((prevData: any) => ({
      ...prevData,
      agent_id: e.agent_id ? e.agent_id : null,
      bonus_name: e.bonus_name ? e.bonus_name : null,
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
    }))
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={16}>
        <Col {...filterColProps}>
          <DateRangeTag />
        </Col>

        <Col {...filterColProps}>
          <AgentSelect label={t("memberInfoEdit.mie005")} />
        </Col>
        <Col {...filterColProps}>
          <Form.Item name={["bonus_name"]} label={i18next.t("col.depositBonusName")} >
            <Select
              labelInValue
              optionFilterProp="label"
              notFoundContent={i18next.t("text.searchThenEnter")}
              options={bonusOptions}
              loading={loading}
              showSearch
              allowClear
              style={{width: "100%"}}
            />
          </Form.Item>
        </Col>

        <Col
          {...filterColProps}
          style={{ alignSelf: "center", marginTop: "-1.2rem" }}
        >
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
