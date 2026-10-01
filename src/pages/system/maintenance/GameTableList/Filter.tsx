import i18next from "@/i18n/i18n";
import SearchBtn from "@/components/SearchBtn";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row, Select } from "antd";
import { useTranslation } from "react-i18next";

interface Props {
  setFilters: any;
}

interface FilterData {
  table_id: string;
  virtual_table_id: string;
  game_name: string;
  game_type: string;
  is_blocked: string;
}

const Filter = ({ setFilters }: Props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm<FilterData>();

  const handleSubmit = (e: FilterData) => {
    setFilters((prevData: any) => ({
      ...prevData,
      ...e,
      page: 1
    }));
  };

  return (
    <Form layout="vertical" onFinish={handleSubmit} form={form}>
      <Row gutter={[16, 0]} style={{padding: '1rem 1rem 0'}}>
        <Col {...filterColProps}>
          <Form.Item
            label={i18next.t("col.tableId")}
            name={"table_id"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            label={i18next.t("col.virtualTableId")}
            name={"virtual_table_id"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            label={i18next.t("col.gameName")}
            name={"game_name"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            label={t("col.gameType")}
            name={"game_type"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            name={"is_blocked"}
            label={i18next.t("col.blocked")}
            initialValue={undefined}
            style={{ width: "100%" }}
          >
            <Select
              options={[
                { label: "Blocked", value: "true" },
                { label: "Not Blocked", value: "false" },
              ]}
              allowClear
            />
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
    </Form>
  );
};

export default Filter;
