import i18next from "@/i18n/i18n";
import { DateRangeType } from "@/components/DateRange";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Row } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { parse, stringify } from "qs";
import DateRangeTag from "@/components/DateRangeTag";
import { SetStateAction, useEffect } from "react";
import dayjs from "dayjs";
import { GF } from "@/utils/GlobalFunctions";
import AgentSelect from "@/components/AgentSelect";
import { useTranslation } from "react-i18next";
import { DefaultOptionType } from "antd/es/select";
import { Select } from "antd/lib";
import { useCouponNames } from "@/api/cs-statics/coupon-usage";

interface FormProps {
  dateRange: DateRangeType;
  name: string | string[];
  agent_id: DefaultOptionType;
  type: string;
}

interface Props {
  setFilter: SetStateAction<any | undefined>;
}

interface QueryData {
  dateRange: string[];
  username: string;
  agent_id: DefaultOptionType;
}

const gradeOptions = [
  { value: "1", label: i18next.t("grade.bronze") },
  { value: "2", label: i18next.t("grade.silver") },
  { value: "3", label: i18next.t("grade.gold") },
  { value: "4", label: i18next.t("grade.emerald") },
  { value: "5", label: i18next.t("grade.ruby") },
  { value: "6", label: i18next.t("grade.diamond") },
  { value: "7", label: i18next.t("grade.blackDiamond") },
];

const Filter = ({ setFilter }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search } = useLocation();
  const { t } = useTranslation();
  const { data: couponNames, isLoading: couponNamesLoading } = useCouponNames();
  const selectedType = Form.useWatch('type', form);

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;

    // 배열을 쉼표로 구분된 문자열로 변환
    const nameValue = Array.isArray(e.name)
      ? e.name.join(',')
      : e.name;

    navigate({
      pathname: "/statistic/coupon-usage",
      search: stringify({
        ...q,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        agent_id: e.agent_id ? e.agent_id.label : undefined,
        page: 1,
        type: e.type ?? "",
        name: nameValue ?? "",
      }),
    });
  };

  // Reset name field when type changes
  useEffect(() => {
    if (selectedType !== undefined) {
      form.setFieldValue('name', undefined);
    }
  }, [selectedType, form]);

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryData & { type?: string; name?: string };
    console.log("filter effect", e);
    form.setFieldsValue({
      ...e,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });
    setFilter((prevData: any) => ({
      ...prevData,
      agent_id: e.agent_id ? e.agent_id : null,
      start_date: e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
      end_date: e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
      type: e.type || null,
      name: e.name || null,
    }));
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
          <Form.Item name="type" label={i18next.t("col.category")} initialValue={""}>
            <Select style={{width:"100%"}} allowClear>
              <Select.Option value="">{i18next.t("col.all")}</Select.Option>
              <Select.Option value="wheel">{i18next.t("storeSetting.ss007")}</Select.Option>
              <Select.Option value="coupon">{i18next.t("topNavi.tn030")}</Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item label={i18next.t("stat.nameGrade")} name="name">
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="children"
              maxTagCount="responsive"
              style={{width:"100%"}}
              allowClear
              placeholder={selectedType === "" ? i18next.t("stat.selectCategoryFirst") : i18next.t("stat.pleaseSelect")}
              loading={selectedType !== 'wheel' && couponNamesLoading}
              disabled={selectedType === "" || !selectedType}
            >
              {selectedType === "coupon" &&
                couponNames?.map((name: string) => (
                  <Select.Option key={name} value={name}>
                    {name}
                  </Select.Option>
                ))
              }
              {selectedType === "wheel" &&
                gradeOptions.map((grade) => (
                  <Select.Option key={grade.value} value={grade.value}>
                    {grade.label}
                  </Select.Option>
                ))
              }
            </Select>
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
