import i18next from "@/i18n/i18n";
import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import DateRangeTag from "@/components/DateRangeTag";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { parse, stringify } from "qs";
import dayjs from "dayjs";
import { GF } from "@/utils/GlobalFunctions";
import GradeSelect from "@/components/GradeSelect";

interface Props {
  setFilter: (values: any) => void;
}

const Filter = ({ setFilter }: Props) => {
  const [form] = Form.useForm();
  const { search } = useLocation();
  const navigate = useNavigate();

  const handleSubmit = (e: any) => {
    console.log(e)
    const q = parse(search.replace("?", "")) as any;
    // setFilter(values);
    navigate({
      pathname: "/user/grade-change-log",
      search: stringify({
        ...q,
        dateRange: e.dateRange
          ? [e.dateRange[0]?.tz().format(), e.dateRange[1]?.tz().format()]
          : undefined,
        username: e.username ? e.username : undefined,
        agentUsername: e.agentUsername ? e.agentUsername : undefined,
        prevGrade: e.prevGrade ? e.prevGrade : undefined,
        changeGrade: e.changeGrade ? e.changeGrade : undefined,
        type: e.type ? e.type : undefined,
        page: 1
      }),
    });
  };

  // const handleReset = () => {
  //   form.resetFields();
  //   setFilter({});
  // };

  useEffect(() => {
      const e = parse(search.replace("?", "")) as any;
      console.log('filter effect',e)
      form.setFieldsValue({
        ...e,
        dateRange: e.dateRange
          ? [dayjs(e.dateRange[0]), dayjs(e.dateRange[1])]
          : [null, null],
      });
      setFilter((prevData: any) => ({
        ...prevData,
        username: e.username ? e.username : undefined,
        agentUsername: e.agentUsername ? e.agentUsername : undefined,
        prevGrade: e.prevGrade ? e.prevGrade : undefined,
        changeGrade: e.changeGrade ? e.changeGrade : undefined,
        type: e.type ? e.type : undefined,
        startDate: e.dateRange ? GF.formatDate(e.dateRange[0], false) : null,
        endDate: e.dateRange ? GF.formatDate(e.dateRange[1], false) : null,
      }))
    }, [search]);

  return (
    <Form form={form} layout="inline" onFinish={handleSubmit}>
      <Row>
        <Col>
          <DateRangeTag />
        </Col>
      </Row>
      <Form.Item name="username" label={i18next.t("title.userIdTitle")}>
        <Input placeholder={i18next.t("user.searchUsername")} size="small" style={{ width: 200 }} />
      </Form.Item>
      <Form.Item name="agentUsername" label={i18next.t("text.agent")}>
        <Select size="small" style={{ width: 120 }} allowClear placeholder={i18next.t("col.all")}>
          <Select.Option value="dongyang">{i18next.t("user.dongyang")}</Select.Option>
          <Select.Option value="daesin">{i18next.t("user.daishin")}</Select.Option>
        </Select>
      </Form.Item>
      <GradeSelect name="prevGrade" label={i18next.t("user.previousGrade")} style={{ width: 100 }} />
      <GradeSelect name="changeGrade" label={i18next.t("user.changedGrade")} style={{ width: 100 }} />
      <Form.Item name="type" label={i18next.t("title.promoteDemote")}>
        <Select size="small" style={{ width: 100 }}>
          <Select.Option value="promotion">{i18next.t("status.promotion")}</Select.Option>
          <Select.Option value="demotion">{i18next.t("status.demotion")}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
            {i18next.t("global.search")}
          </Button>
          {/* <Button icon={<ReloadOutlined />} onClick={handleReset}>
            초기화
          </Button> */}
        </Space>
      </Form.Item>
    </Form>
  );
};

export default Filter;