import i18next from "@/i18n/i18n";
import { DateRangeType } from "@/components/DateRange";
import DateRangeTag from "@/components/DateRangeTag";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { GF } from "@/utils/GlobalFunctions";
import { Col, Form, Input, Row, Select } from "antd";
import { DefaultOptionType } from "antd/es/select";

export interface FormProps {
  dateRange: DateRangeType;
  agent_id: DefaultOptionType;
  filter_islive: string;
  filter_username: string;
  filter_amount: string;
}

interface Props {
  setFilter: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  userId?: string;
}

const Filter = ({ setFilter, userId }: Props) => {
  const [form] = Form.useForm<FormProps>();

  const handleSubmit = (e: FormProps) => {
    setFilter((prevData: any) => ({
      ...prevData,
      filter_startdate: e.dateRange ? GF.formatDate(e.dateRange[0], true) : null,
      filter_enddate: e.dateRange ? GF.formatDate(e.dateRange[1], true) : null,
      filter_agentid: e.agent_id ? e.agent_id.label : undefined,
      filter_username: e.filter_username ? e.filter_username : null,
      filter_islive: e.filter_islive ? e.filter_islive : null,
      filter_amount: e.filter_amount ? e.filter_amount : null,
      page: 1,
    }));
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={[16, 16]}>
        <Col {...filterColProps}>
          <DateRangeTag showTime />
        </Col>

        {/* <Col {...filterColProps}>
          <AgentSelect label={t("memberInfoEdit.mie005")} />
        </Col> */}

        <Col {...filterColProps}>
          <Form.Item name={"filter_islive"} label={i18next.t("sportsMarket.liveFlag")}>
          <Select size={"small"} allowClear>
            <Select.Option value="0">
              {i18next.t("betting.prematch")}
            </Select.Option>
            <Select.Option value="1">
              {i18next.t("title.live")}
            </Select.Option>
          </Select>
          </Form.Item>
        </Col>
        {!userId && (
          <Col {...filterColProps}>
            <Form.Item name={"filter_username"} label={i18next.t("col.userId")}>
              <Input size="small" />
            </Form.Item>
          </Col>
        )}

        <Col {...filterColProps}>
          <Form.Item name={"filter_amount"} label={i18next.t("col.betTotal")}>
            <Input size="small" />
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
