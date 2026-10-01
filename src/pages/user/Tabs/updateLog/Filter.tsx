import { ResUser } from "@/api/types";
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
import { columnGroupOptions } from "../../update-log/Filter";

interface Props {
  setFilters: Dispatch<SetStateAction<any | undefined>>;
  user: ResUser["data"] | undefined;
}

interface FilterData {
  dateRange: DateRangeType;
  columnGroup: string[] | undefined;
  adminUsername: string | undefined;
}

interface QueryData {
  dateRange: string[] | undefined;
  columnGroup: string[] | undefined;
  adminUsername: string | undefined;
}

const Filter = ({ setFilters, user }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();
  const navigate = useNavigate();
  const { search } = useLocation();

  const handleSubmit = (e: FilterData) => {
    const q = parse(search.replace("?", "")) as unknown as QueryData;

    navigate({
      pathname: `/user/${user?.id}`,
      search: stringify({
        ...q,
        ...e,
        tab: "updateLog",
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
      username: user?.username ?? prevData?.username ?? null,
      columnGroup:
        e.columnGroup && e.columnGroup.length > 0 ? e.columnGroup : null,
      adminUsername: e.adminUsername ? e.adminUsername : null,
      startDate: e.dateRange
        ? `${GF.formatDate(e.dateRange[0], false)} 00:00:00`
        : null,
      endDate: e.dateRange
        ? `${GF.formatDate(e.dateRange[1], false)} 23:59:59`
        : null,
    }));
  }, [search, user]);

  return (
    <Form layout="vertical" form={form} onFinish={handleSubmit}>
      <Row gutter={[16, 0]}>
        <Col {...filterColProps}>
          <DateRange />
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.category")} name={"columnGroup"}>
            <Select
              mode="multiple"
              size="small"
              allowClear
              placeholder={t("col.selectCategory")}
              options={columnGroupOptions}
              maxTagCount="responsive"
            />
          </Form.Item>
        </Col>

        <Col {...filterColProps}>
          <Form.Item label={t("col.processedBy")} name={"adminUsername"}>
            <Input size="small" allowClear placeholder={t("col.processedBy")} />
          </Form.Item>
        </Col>

        <Col
          {...filterColProps}
          style={{ alignSelf: "center", marginBottom: "45px" }}
        >
          <SearchBtn block size="small" />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
