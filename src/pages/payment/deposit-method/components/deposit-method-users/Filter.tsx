import i18next from "@/i18n/i18n";
import GradeSelect from "@/components/GradeSelect";
import LevelSelector from "@/components/LevelSelector";
import SearchBtn from "@/components/SearchBtn";
import UserStatusSelect from "@/components/UserStatusSelect";
import { filterColProps } from "@/provider/filterColStyle";
import { Col, Form, Input, Row } from "antd";

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
            label={"ID"}
            name={"username"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <Form.Item
            label={i18next.t("col.name")}
            name={"user_real_name"}
            initialValue={""}
          >
            <Input size="small" allowClear />
          </Form.Item>
        </Col>
        <Col {...filterColProps}>
          <UserStatusSelect name="user_status" />
        </Col>
        <Col {...filterColProps}>
          <LevelSelector label={i18next.t("col.level")} />
        </Col>
        <Col {...filterColProps}>
          <GradeSelect
            name="grade"
            label={i18next.t("col.grade")}
            defaultValue={null}
            hideAll
          />
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
