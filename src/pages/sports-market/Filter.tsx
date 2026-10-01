import i18next from "@/i18n/i18n";
import { DateRangeType } from "@/components/DateRange";
import DateRangeTag from "@/components/DateRangeTag";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Row, Select } from "antd";
import { DefaultOptionType } from "antd/es/select";
import dayjs from "dayjs";
import { parse, stringify } from "qs";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface FormProps {
  dateRange: DateRangeType;
  agent_id: DefaultOptionType;
  filter_islive: string;
  filter_username: string;
  filter_amount: string;
  filter_match_status: string;
}

export interface QueryProps {
  dateRange: string[] | undefined;
  filter_agentid: DefaultOptionType;
  filter_islive: string | undefined;
  filter_username: string | undefined;
  filter_amount: string | undefined;
  filter_match_status: string | undefined;
}

interface Props {
  setFilter: any;
  isAtUserDetailsPage?: boolean;
}

const Filter = ({ setFilter }: Props) => {
  const [form] = Form.useForm<FormProps>();
  const navigate = useNavigate();
  const { search, pathname } = useLocation();

  const handleSubmit = (e: FormProps) => {
    const q = parse(search.replace("?", "")) as unknown as QueryProps;
    navigate({
      pathname,
      search: stringify({
        ...q,
        ...e,
        filter_agentid: e.agent_id ? e.agent_id.label : undefined,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        page: 1,
        tab: pathname.includes('/user') ? "bettingLog" : undefined,
      }),
    });
  };

  useEffect(() => {
    const e = parse(search.replace("?", "")) as unknown as QueryProps;

    form.setFieldsValue({
      ...e,
      // agent_id: e.filter_agentid ? e.filter_agentid.label : undefined,
      dateRange: e.dateRange
        ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
        : [null, null],
    });

    setFilter((prevData: any) => ({
      ...prevData,
      filter_startdate: e.dateRange ? GF.formatDate(e.dateRange[0], true) : null,
      filter_enddate: e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,
      filter_agentid: e.filter_agentid ? e.filter_agentid : null,
      filter_username: e.filter_username ? e.filter_username : null,
      filter_islive: e.filter_islive ? e.filter_islive : null,
      filter_amount: e.filter_amount ? e.filter_amount : null,
      filter_match_status: e.filter_match_status ? e.filter_match_status : null,
    }));
  }, [search]);

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={[16, 16]}>
        <Col {...filterColProps}>
          <DateRangeTag showTime />
        </Col>

        {/* <Col {...filterColProps}>
          <AgentSelect label={t("memberInfoEdit.mie005")} />
        </Col> */}

        {/* <Col {...filterColProps}>
          <Form.Item name={"filter_islive"} label="라이브 여부">
          <Select size={"small"} allowClear>
            <Select.Option value="0">
              프리매치
            </Select.Option>
            <Select.Option value="1">
              라이브
            </Select.Option>
          </Select>
          </Form.Item>
        </Col> */}
        {/* {!isAtUserDetailsPage && (
          <Col {...filterColProps}>
            <Form.Item name={"filter_username"} label="유저 ID">
              <Input size="small" />
            </Form.Item>
          </Col>
        )} */}

        {/* <Col {...filterColProps}>
          <Form.Item name={"filter_amount"} label="배팅합계">
            <Input size="small" />
          </Form.Item>
        </Col> */}

        <Col {...filterColProps}>
          <Form.Item name={"filter_match_status"} label={i18next.t("col.status")}>
            <Select size={"small"} allowClear>
              <Select.Option value="Finished">
                {i18next.t("sports.closed")}
              </Select.Option>
              <Select.Option value="On-Going">
                {i18next.t("status.ongoing")}
              </Select.Option>
              <Select.Option value="Waiting">
                {i18next.t("status.waiting")}
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        
        <Col
          {...filterColProps}
          style={{
            alignSelf: "center",
            marginBottom: "1rem",
          }}
        >
          <SearchBtn size="small" block />
        </Col>
      </Row>
    </Form>
  );
};

export default Filter;
